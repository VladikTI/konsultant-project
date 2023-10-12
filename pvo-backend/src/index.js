import Fastify from 'fastify'
import fastifyStatic from '@fastify/static'
import path from 'path'
import { fileURLToPath } from 'url';
import authRoutes from './auth.js';
import addEmployeeRoutes from './addEmployee.js';

const fastify = Fastify({
  logger: true
})

fastify.register(authRoutes);

fastify.register(addEmployeeRoutes);

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);




// fastify.register(fastifyStatic, {
//     root: path.join(__dirname, 'public')
// });


// fastify.get('/', async (request, reply) => {
//     const filePath = path.join('../../pvo-frontend/src/routes', 'index.jsx');
//     return reply.type('text/html; charset="Utf-8"').sendFile('filePath');
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