export const APP_CORS_CONFIG = {
  origin: (_: unknown, callback: any) => {
    callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'PUT', 'POST', 'OPTIONS', 'DELETE', 'PATCH'],
  headers: ['x-user', 'X-Signature', 'accept', 'content-type', 'authorization'],
};
