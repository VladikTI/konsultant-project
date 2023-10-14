import Fastify from 'fastify';
import dbconnector from './db.js';
// import fastifyPlugin from 'fastify-plugin';

const fastify = Fastify({
    logger: true
})

fastify.register(dbconnector);

export async function findUserId(token) {
    try {
        const {rows} = await client.query(
            'SELECT employee_id FROM authentication WHERE refresh_token=$1;',
            [token]
        );
        return rows[0].employee_id;
    }  catch (err) {
        console.log('Find User Id Error: ', err);
        throw new Error(err);
    }
}
