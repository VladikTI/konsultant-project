import fastifyPlugin from 'fastify-plugin';
import pg from 'pg';

const { Client } = pg;

// require('dotenv').config()
const client = new Client({
    user: 'admin',
    password: 'admin',
    host: 'pvo-db',
    port: 5432,
    database: 'vacations'
})
async function dbconnector(fastify, options, done) {
    try {
        await client.connect()
        console.log("db connected succesfully")
        fastify.decorate('db', {client})
        done();
    } catch(err) {
        console.error(err)
        done();
    }
}
export default fastifyPlugin(dbconnector)