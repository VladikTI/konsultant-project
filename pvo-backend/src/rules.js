import Fastify from 'fastify';

import dbconnector from './db.js';
import authRoutes from './auth.js';

const fastify = Fastify({
    logger: true
});

fastify.register(dbconnector);

fastify.register(authRoutes);

async function rulesRoutes(fastify, options){

    fastify.get('/api/get_rules', {preValidation: [fastify.authenticate]}, async(request, reply) => {
        const client = await fastify.db.client;
        try {
            const {rows} = await client.query('SELECT * FROM rules');
            return reply.code(200).send(JSON.stringify(rows));
        } catch (err) {
            console.log(`Error in get_rules route: ${err}`);
            return reply.code(500).send("Internal Server Error: error on getting rules");
        }
        
    })

    fastify.post('/api/add_rule', {preValidation: [fastify.authenticate]}, async(request, reply) => {
        const client = await fastify.db.client;

        // const [token_row, employee_role] = await determineAccess(client, request.headers.authorization.replace('Bearer ', ''), 'token', 'Employer')
        // if (!token_row){
        //     return reply.redirect(401, '/api/refresh');
        // }
        // if (!employee_role){
        //     return reply.code(403).send('Access denied');
        // }

        const user_id = 1;

        const req_data = request.body;

        try {
            const insert_data = req_data;
            insert_data["user_id"] = user_id;
            await insertRule(client, insert_data);
            
            return reply.code(200).send('New rule was added');
        } catch (err) {
            console.log('Error while inserting data to database');
            return reply.code(500).send('Internal Server Error: error on adding rule');
        }

    });

    fastify.post('/api/delete_rule', {preValidation: [fastify.authenticate]}, async(request, reply)=>{

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
            await deleteRule(client, req_data.rule_id);
            return reply.code(200).send('Rule was deleted successfully');
        } catch(err) {
            console.error("Error in POST /api/delete_rule: ", err);
            return reply.code(400).send('Bad Request: deletion of the rule failed');
        }
    })

    fastify.post('/api/update_rule', {preValidation: [fastify.authenticate]}, async(request, reply)=>{
        
        const client = fastify.db.client;

        // const [token_row, employee_role] = await determineAccess(client, request.headers.authorization.replace('Bearer ', ''), 'token', 'Employer')
        // if (!token_row){
        //     return reply.redirect(401, '/api/refresh');
        // }
        // if (!employee_role){
        //     return reply.code(403).send('Access denied');
        // }

        const req_data = request.body;
        const user_id = 1;

        try {
            const insert_data = req_data;
            insert_data["user_id"] = user_id;
            await updateRule(client, insert_data);
            
            return reply.code(200).send('Rule was updated successfully');
        } catch (err) {
            console.log('Error while updating data to database');
            return reply.code(500).send('Internal Server Error: error on editing rule');   
        }
    });

    async function insertRule(client, insert_data){
        try {
            const { rows } = await client.query(
                'INSERT INTO rule(rule_description, options, expiration_date, status, updated_date, updated_by) VALUES ($1, $2, $3, $4, NOW(), $5);',
                [insert_data.rule_description, insert_data.options, insert_data.expiration_date, insert_data.status, insert_data.user_id],
            );
            return;
        } catch (err) {
            console.error("Insert Rule Error: ", err);
            throw new Error(err);
        }
    }    

    async function updateRule(client, insert_data){
        try {
            const { rows } = await client.query(
                'UPDATE rule SET rule_description = $1, options = $2, expiration_date = $3, status = $4, updated_date = NOW(), updated_by = $5 WHERE rule_id = $6',
                [insert_data.rule_description, insert_data.options, insert_data.expiration_date, insert_data.status, insert_data.user_id, insert_data.rule_id],
            );
            return;
        } catch (err) {
            console.error("Update Rule Error: ", err);
            throw new Error(err);
        }
    }

    
    async function deleteRule(client, rule_id){
        try {
            const {rows} = await client.query(
                'DELETE FROM rule WHERE rule_id = $1;', [rule_id]
            );
            return;
        } catch (err) {
            console.log('Delete Rule Error: ', err);
            throw new Error(err);
        }
    }

}

export default rulesRoutes;