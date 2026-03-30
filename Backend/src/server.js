const buildApp = require('./app');
const env = require('./config/env');
const { connectDb } = require('./config/db');

async function start() {
  const app = buildApp();

  try {
    await connectDb(env.mongoUri);
    await app.listen({ port: env.port, host: '0.0.0.0' });
    app.log.info(`Server listening on port ${env.port}`);
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
}

start();
