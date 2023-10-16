import Fastify from 'fastify';

import dbconnector from './db.js';
import authRoutes from './auth.js';

const fastify = Fastify({
    logger: true
});

fastify.register(authRoutes);

async function applicationManager(fastify, options){

    const client = await fastify.db.client;
    async function getApplications(client, search_data){
        try {
            const {rows} = await client.query(
                'SELECT FROM '
            )
        } catch (err) {
            console.log('Get applications error: ', err);
            throw new Error(err);
        }
    };
}

export default applicationManager;