import Fastify from 'fastify'
import fastifyStatic from '@fastify/static'
import path from'path'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fastify = Fastify({
  logger: true
})


fastify.register(fastifyStatic, {
    root: path.join(__dirname, 'public')
});


fastify.get('/', async (request, reply) => {
    const filePath = path.join(__dirname, 'public', 'file.html');
    return reply.type('text/html; charset="Utf-8"').sendFile('file.html');
});

const start = async () => {
  try {
    await fastify.listen({port: 3000, host: "0.0.0.0"})
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()