import Fastify from 'fastify';

import dbconnector from './db.js';
import authRoutes from './auth.js';

const fastify = Fastify({
    logger: true
});

fastify.register(dbconnector);

fastify.register(authRoutes);

async function unitRoutes(fastify, options){

    fastify.get('/api/get_units', async(request, reply) => {
        const client = await fastify.db.client;
        let units_rows;
        try {
            const {rows} = await client.query('SELECT name, unit_id FROM unit');
            units_rows = rows;
        } catch (err) {
            console.log(`Error in get_unit route: ${err}`);
            return reply.code(500).send("Internal Server Error: error on getting unit");
        }

        const result = {};
        for (let i = 0; i < units_rows.length; i++){
            result.units_rows.name = units_rows.unit_id;
        }
        return reply.code(200).send(JSON.stringify(result));
    })

    fastify.post('/api/add_unit', async(request, reply) => {
        const client = await fastify.db.client;

        // const [token_row, employee_role] = await determineAccess(client, request.headers.authorization.replace('Bearer ', ''), 'token', 'Employer')
        // if (!token_row){
        //     return reply.redirect(401, '/api/refresh');
        // }
        // if (!employee_role){
        //     return reply.code(403).send('Access denied');
        // }

        const user_id = token_row.employee_id;

        const req_data = request.body;

        try {
            const insert_data = {
                name: req_data.name,
                user_id: user_id
            }
            await insertUnit(client, insert_data);
            
            return reply.code(200).send('New unit was added');
        } catch (err) {
            console.log('Error while inserting data to database');
            return reply.code(500).send('Internal Server Error: error on adding unit');
        }

    });

    fastify.post('/api/delete_unit', async(request, reply)=>{

        // const [token_row, employee_role] = await determineAccess(client, request.headers.authorization.replace('Bearer ', ''), 'token', 'Employer')
        // if (!token_row){
        //     return reply.redirect(401, '/api/refresh');
        // }
        // if (!employee_role){
        //     return reply.code(403).send('Access denied');
        // }

        const client = await fastify.db.client;
        const req_data = request.body;
        try {
            await deleteUnit(client, req_data.unit_id);
            return reply.code(200).send('Unit was deleted successfully');
        } catch(err) {
            console.error("Error in POST /api/delete_unit: ", err);
            return reply.code(400).send('Bad Request: deletion of the unit failed');
        }
    })

    fastify.post('/api/update_unit/', async(request, reply)=>{
        
        const client = fastify.db.client;

        // const [token_row, employee_role] = await determineAccess(client, request.headers.authorization.replace('Bearer ', ''), 'token', 'Employer')
        // if (!token_row){
        //     return reply.redirect(401, '/api/refresh');
        // }
        // if (!employee_role){
        //     return reply.code(403).send('Access denied');
        // }

        const req_data = request.body;
        const user_id = token_row.employee_id;

        try {
            const insert_data = {
                name: req_data.name,
                unit_id: req_data.unit_id,
                user_id: user_id
            }
            await updateUnit(client, insert_data);
            
            return reply.code(200).send('Unit was updated');
        } catch (err) {
            console.log('Error while updating data to database');
            return reply.code(500).send('Internal Server Error: error on editing unit');   
        }
    });

    async function insertUnit(client, insert_data){
        try {
            const { rows } = await client.query(
                'INSERT INTO unit(name, updated_date, updated_by) VALUES ($1, NOW(), $2);',
                [insert_data.name, insert_data.user_id],
            );
          // Note: avoid doing expensive computation here, this will block releasing the client
            return;
        } catch (err) {
            console.error("InsertUnitError: ", err);
            throw new Error(err);
        }
    }    

    async function updateUnit(client, insert_data){
        try {
            const { rows } = await client.query(
                'UPDATE employee SET name = $1, updated_date = NOW(), updated_by = $2 WHERE unit_id = $3',
                [insert_data.name, insert_data.user_id, inser_data.unit_id],
            );
            return;
        } catch (err) {
            console.error("UpdateUnitError: ", err);
            throw new Error(err);
        }
    }

    
    async function deleteUnit(client, unit_id){
        try {
            const {rows} = await client.query(
                'DELETE FROM unit WHERE unit_id = $1;', [unit_id]
            );
            return;
        } catch (err) {
            console.log('Delete Unit Error: ', err);
            throw new Error(err);
        }
    }

}

export default unitRoutes;