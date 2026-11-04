-- The initial migration used "on conflict do nothing", so a care-documents bucket that
-- already existed never received its limits. Apply them whether or not it pre-existed.
update storage.buckets
set public = false,
    file_size_limit = 26214400,
    allowed_mime_types = array['application/pdf', 'image/jpeg', 'image/png']
where id = 'care-documents';
