import Fastify from 'fastify';
import dbconnector from './db.js';

const fastify = Fastify({
    logger: true
})

fastify.register(dbconnector);

async function findUserId(client, token) {
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

export default findUserId;