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

    fastify.post('/api/upload_document', async (request, reply)=>{

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

}

export default fileManager;