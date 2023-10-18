import Fastify from 'fastify';

import dbconnector from './db.js';
import authRoutes from './auth.js';

const fastify = Fastify({
    logger: true
});

fastify.register(authRoutes);

async function applicationsManager(fastify, options){

    fastify.get('/api/get_applications', async(request, reply) =>{
        const client = await fastify.db.client;
        const req_data = request.body;
        let data_result = new Array();
        try {
            for (const req of req_data){
                let output_rows = new Array();  
                const rows = await getApplications(client, req.employee_id);
                for (line of rows){
                    output_rows.push({
                        "employee_id": line.employee_id,
                        "start_date": DateTime.fromSQL(line.start_date).toISO({includeOffset: false}),
                        "end_date": DateTime.fromSQL(line.end_date).toISO({includeOffset: false}),
                        "days": line.days,
                        "status": line.status,
                        "created_date": DateTime.fromSQL(line.created_date).toISO({includeOffset: false}),
                        "file_id": line.file_id
                    });
                };
                const data = {
                    "employee_id": req.employee_id,
                    "applications": output_rows
                }

                data_result.push(data);
            }
            const result = {
                "data": data_result
            }
            return reply.code(200).send(result);
        } catch (err){
            console.log('Error in /api/get_applications: ', err);
            return reply.code(500).send('Internal Server Error: error on getting applications');
        }
    })

    fastify.post('/api/create_application', async(request, reply)=>{
        const client = await fastify.db.client;
        const req_data = request.body;
        try {
            const insert_data = {
                employee_id : req_data.employee_id,
                start_date: DateTime.toSQLDate(req_data.start_date),
                end_date: DateTime.toSQLDate(req_data.end_date),
                status: "awaiting",
            };
            await createApplication(client, insert_data);
            return reply.code(200).send('Application was created successfully');
        } catch (err) {
            console.error("Error in POST /api/create_application: ", err);
            return reply.code(400).send('Bad Request: application creation failed');
        }
    })

    fastify.post('/api/delete_application', async(request, reply)=>{
        const client = await fastify.db.client;
        const req_data = request.body;
        try {
            await deleteApplication(client, req_data.request_id);
            return reply.code(200).send('Application was deleted successfully');
        } catch(err) {
            console.error("Error in POST /api/delete_application: ", err);
            return reply.code(400).send('Bad Request: deletion of the application failed');
        }
    })

    async function getApplications(client, employee_id){
        try {
            const {rows} = await client.query(
                'SELECT request_id, employee_id, start_date, end_date, days, status, created_date, file_id FROM request WHERE employee_id = $1;', [employee_id]
            )
            return rows;
        } catch (err) {
            console.log('Get applications error: ', err);
            throw new Error(err);
        }
    };

    async function createApplication(client, insert_data){
        try {
            const {rows} = await client.query(
                'INSERT INTO request (employee_id, start_date, end_date, days, status, created_date, updated_date, updated_by) VALUES ($1, $2, $3, $4, $5, NOW(), NOW(), $6);', 
                [insert_data.employee_id, insert_data.start_date, insert_data.end_date, insert_data.days,
                 insert_data.status, insert_data.employee_id]
            );
            return;
        } catch (err) {
            console.log('Create Application Error: ', err);
            throw new Error(err);
        }
    }

    async function deleteApplication(client, request_id){
        try {
            const {rows} = await client.query(
                'DELETE FROM request WHERE request_id = $1;', [request_id]
            );
            return;
        } catch (err) {
            console.log('Delete Application Error: ', err);
            throw new Error(err);
        }
    }

}

export default applicationsManager;