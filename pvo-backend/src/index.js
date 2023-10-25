import Fastify from 'fastify';
import cors from '@fastify/cors';
import fastifyJwt from '@fastify/jwt';

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

fastify.register(fastifyJwt, {
  secret: '$2b$10$XXLk187ZPJU1OhhUw2.jEeFEYC4ufWO2fGuyEkGFRGdDhQoTm5gxm'
});

fastify.decorate("authenticate", async function (request, reply) {
  try {
      await request.jwtVerify();
  } catch (err) {
      reply.send(err);
  }
});


fastify.register(cors, {
  origin: true,
  methods: ['OPTIONS', 'GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
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