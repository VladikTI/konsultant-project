import Fastify from 'fastify'
import fastifyStatic from '@fastify/static'
import path from 'path'

import authRoutes from './auth.js';
import employeeRoutes from './employee.js';
import dbconnector from './db.js'
import applicationsManager from './applications_management.js';
import unitRoutes from './units.js';
import fileManager from './file_management.js';
import rulesRoutes from './rules.js';

const fastify = Fastify({
  logger: true
})


fastify.register(dbconnector);

fastify.register(authRoutes);

fastify.register(employeeRoutes);

fastify.register(unitRoutes);

fastify.register(applicationsManager);

fastify.register(rulesRoutes);

fastify.register(fileManager);


// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);


// fastify.register(fastifyStatic, {
//     root: path.join(__dirname, 'public')
// });


// fastify.get('/admin', async (request, reply) => {
    // const token = request.headers.authorization
// });

const start = async () => {
  try {
    await fastify.listen({port: 3000, host: "0.0.0.0"})
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()