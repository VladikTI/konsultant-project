import Fastify from 'fastify';

import dbconnector from './db.js';
import authRoutes from './auth.js';
import multipart from '@fastify/multipart'

import fs from 'node:fs';
// import uitl from 'node:util';
// import {pipeline} from 'node:stream';
// const pump = util.promisify(pipeline);

const fastify = Fastify({
    logger: true
});

fastify.register(dbconnector);

fastify.register(authRoutes);

fastify.register(multipart);

fastify.post('/api/upload_document', async (request, reply)=>{

    if (!request.isMultipart()) {
        return reply.code(400).send('Ошибка: Ожидался файл');;
      }
    
      // Обработка загруженного файла
      request.multipart((field, file, filename, encoding, mimetype) => {
        if (mimetype !== 'application/pdf') {
          return reply.code(400).send('Ошибка: Загруженный файл не является PDF');;
        }
    
        // Вы можете сохранить файл на сервере
        const savePath = `./uploads/${filename}`;
        file.pipe(fs.createWriteStream(savePath));
    
        // Дополнительная обработка, если необходимо
    
        // Отправьте ответ клиенту
        reply.send('Файл успешно загружен');
      });
    
      await request.done();
    
})