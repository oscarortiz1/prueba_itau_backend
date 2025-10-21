export default () => ({
  app: {
    port: parseInt(process.env.PORT ?? '3000', 10),
  },
  database: {
    uri: process.env.MONGODB_URI ?? 'mongodb://localhost:27017/prueba_itau',
  },
  auth: {
    jwtSecret: process.env.JWT_SECRET ?? 'change-me',
    jwtExpiresIn: parseInt(process.env.JWT_EXPIRES_IN ?? '3600', 10),
  },
});
