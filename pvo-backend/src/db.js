import fastifyPlugin from 'fastify-plugin';
import pg from 'pg';
const { Client } = pg;

// require('dotenv').config()
const client = new Client({
    user: 'admin',
    password: 'admin',
    host: '172.21.0.3',
    port: 5432,
    database: 'vacations'
})
async function dbconnector(fastify, options) {
    try {
        await client.connect()
        console.log("db connected succesfully")
        fastify.decorate('db', {client})
    } catch(err) {
        console.log("\nSHIT 4\n")
        console.error(err)
    }
}
export default fastifyPlugin(dbconnector)