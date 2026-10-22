type LogFields = Record<string, string | number | boolean | null | undefined>;

function write(level: 'info' | 'error', event: string, fields: LogFields = {}) {
  // Do not pass request bodies, authorization headers, health data, or stack traces to this logger.
  console[level](JSON.stringify({ timestamp: new Date().toISOString(), level, event, ...fields }));
}

export const logger = {
  info: (event: string, fields?: LogFields) => write('info', event, fields),
  error: (event: string, fields?: LogFields) => write('error', event, fields),
};
