import crypto from 'node:crypto';
import { Router } from 'express';
import { requireCapability } from '../auth.js';
import { config } from '../config.js';
import { ApiError } from '../http.js';
import { documentSchema, documentTypes, maxDocumentBytes, uploadRequestSchema } from '../schemas.js';
import { supabase } from '../supabase.js';
import { audit, idParam, route } from './util.js';

export const documentRoutes = Router();
const bucket = () => supabase.storage.from(config.SUPABASE_DOCUMENTS_BUCKET);

documentRoutes.get('/documents', route(async (req, res) => {
  const { circleId } = await requireCapability(req, res, 'document:read');
  const { data, error } = await supabase.from('documents')
    .select('id, title, filename, content_type, size_bytes, category, created_at, updated_at, author:created_by_member_id(display_name)')
    .eq('circle_id', circleId).order('created_at', { ascending: false });
  if (error) throw error;
  res.json({ data });
}));

// Step 1 of an upload: the server picks the storage path (never derived from the user's filename)
// and returns a single-use token. The browser then sends the file straight to Supabase Storage,
// so large files never pass through this process.
documentRoutes.post('/documents/upload-url', route(async (req, res) => {
  const { circleId } = await requireCapability(req, res, 'document:write');
  const input = uploadRequestSchema.parse(req.body);
  const path = `${circleId}/${crypto.randomUUID()}.${documentTypes[input.contentType]}`;
  const { data, error } = await bucket().createSignedUploadUrl(path);
  if (error) throw error;
  res.status(201).json({ data: { bucket: config.SUPABASE_DOCUMENTS_BUCKET, path: data.path, token: data.token } });
}));

// Step 2: register the uploaded object. Size and type come from storage, not from the client.
documentRoutes.post('/documents', route(async (req, res) => {
  const { circleId, memberId } = await requireCapability(req, res, 'document:write');
  const input = documentSchema.parse(req.body);
  const pathPattern = new RegExp(`^${circleId}/[0-9a-f-]{36}\\.(pdf|jpg|png)$`);
  if (!pathPattern.test(input.path)) throw new ApiError(400, 'The upload does not belong to this Care Circle.');

  const { data: info, error: infoError } = await bucket().info(input.path);
  if (infoError || !info) throw new ApiError(400, 'The uploaded file was not found. Please upload it again.');
  const contentType = info.contentType ?? '';
  const size = Number(info.size ?? 0);
  if (!(contentType in documentTypes) || size <= 0 || size > maxDocumentBytes) {
    await bucket().remove([input.path]);
    throw new ApiError(400, 'Only PDF, JPEG, or PNG files up to 25 MB can be stored.');
  }

  const { data, error } = await supabase.from('documents').insert({
    circle_id: circleId,
    created_by_member_id: memberId,
    title: input.title,
    filename: input.filename,
    storage_path: input.path,
    content_type: contentType,
    size_bytes: size,
    category: input.category,
  }).select('id, title, filename, content_type, size_bytes, category, created_at, updated_at').single();
  if (error) throw error;
  res.status(201).json({ data });
}));

documentRoutes.get('/documents/:id/download-url', route(async (req, res) => {
  const { circleId, memberId } = await requireCapability(req, res, 'document:read');
  const documentId = idParam(req, 'Document');
  const { data: document, error } = await supabase.from('documents').select('storage_path, filename').eq('circle_id', circleId).eq('id', documentId).maybeSingle();
  if (error) throw error;
  if (!document) throw new ApiError(404, 'Document not found.');
  const download = req.query.download === '1' ? document.filename : undefined;
  const { data, error: signingError } = await bucket().createSignedUrl(document.storage_path, 60, download ? { download } : undefined);
  if (signingError) throw signingError;
  // Fail closed: a download link is never returned without its audit entry.
  await audit({ circleId, actorMemberId: memberId, action: 'download_url_issued', resourceType: 'document', resourceId: documentId });
  res.json({ data: { url: data.signedUrl, expiresInSeconds: 60 } });
}));

documentRoutes.delete('/documents/:id', route(async (req, res) => {
  const { circleId } = await requireCapability(req, res, 'document:write');
  const documentId = idParam(req, 'Document');
  const { data: document, error } = await supabase.from('documents').select('storage_path').eq('circle_id', circleId).eq('id', documentId).maybeSingle();
  if (error) throw error;
  if (!document) throw new ApiError(404, 'Document not found.');
  // Remove the file first: a leftover row is visible and retryable, a leftover file is not.
  const { error: removeError } = await bucket().remove([document.storage_path]);
  if (removeError) throw removeError;
  const { error: deleteError } = await supabase.from('documents').delete().eq('circle_id', circleId).eq('id', documentId);
  if (deleteError) throw deleteError;
  res.status(204).end();
}));
