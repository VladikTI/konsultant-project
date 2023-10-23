import Fastify from 'fastify';

import dbconnector from './db.js';
import authRoutes from './auth.js';

import multipart from '@fastify/multipart'
import fs from 'fs'
import util from 'util'
import { pipeline } from 'stream'

const pump = util.promisify(pipeline);


const fastify = Fastify({
    logger: true
});

fastify.register(dbconnector);

fastify.register(authRoutes);

fastify.register(multipart);

async function fileManager(fastify, options){

    fastify.get('/api/get_documents', async(request, reply)=>{
        const client = fastify.db.client;
        const req_data = request.body;
        
        let data_result = new Array();
        try {
            for (const req of req_data){
                const result_row = await getDocuments(client, req_data.file_id)
                data_result.push(result_row);
            }
            const result = {
                files: data_result
            }
            return reply.code(200).send(JSON.stringify(result));
        } catch (err){
            console.log('Error in /api/get_documents: ', err);
            return reply.code(500).send('Internal Server Error: error on getting documents');
        }
    })

    // Загрузка файлов на сервер
    fastify.post('/api/upload_document', async (request, reply)=>{

        const client = await fastify.db.client;
        const req_data = request.body;
        if (!request.isMultipart()) {
            return reply.code(400).send('File Upload Error: file was expected.');;
        }
        const upload_file = await req.file();
        
        try {
            await pump(upload_file.file, fs.createWriteStream(`./employee_applications/${upload_file.filename}`));
            return reply.code(200).send('File uploaded successfully');
        } catch (err) {
            console.log("File Upload Error: ", err);
            return reply.code(500).send('Internal Server Error: file upload error');
        }
    })

    fastify.get('/api/download_file', (request, reply) => {
        // Указание пути к файлу PDF на сервере

        const req_data = request.body;
        const filePath = `./employee_applications/${req_data.filename}.pdf`;
      
        // Проверка существования файла
        if (!fs.existsSync(filePath)) {
          reply.code(404).send('Файл не найден');
          return;
        }

        const readStream = fs.createReadStream(filePath);
      
        // Установка заголовков для скачивания
        reply.header('Content-Type', 'application/pdf');
        reply.header('Content-Disposition', `attachment; filename=${filePath}`); // Имя файла для скачивания
      
        // Отправка файла клиенту
        reply.send(readStream);
    });

    async function getDocuments(client, file_id){
        try {
            const {rows} = await client.query(
                'SELECT * FROM file WHERE file_id = $1;', [file_id]
            )
            return rows;
        } catch (err) {
            console.log('Get Files Error: ', err);
            throw new Error(err);
        }
    }
    

}

export default fileManager;