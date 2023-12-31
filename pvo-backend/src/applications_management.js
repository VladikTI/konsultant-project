import Fastify from 'fastify';

import dbconnector from './db.js';
import authRoutes from './auth.js';

import { DateTime } from 'luxon';

const fastify = Fastify({
    logger: true
});

fastify.register(dbconnector);

fastify.register(authRoutes);

async function applicationsManager(fastify, options){

    fastify.post('/api/get_applications', async(request, reply) =>{
        const client = await fastify.db.client;
        const req_data = request.body.users;
        let data_result = new Array();
        try {
            for (const req of req_data){
                let output_rows = new Array();
                const rows = await getApplications(client, req.employee_id);
                for (let line of rows){
                    output_rows.push({
                        employee_id: line.employee_id,
                        start_date: DateTime.fromJSDate(line.start_date).toISO({includeOffset: false}),
                        end_date: DateTime.fromJSDate(line.end_date).toISO({includeOffset: false}),
                        days: line.days,
                        name: line.name,
                        surname: line.surname, 
                        patronymic: line.patronymic,
                        unit_id: line.unit_id,
                        status: line.status,
                        request_id: line.request_id,
                        comment: line.comment,
                        created_date: DateTime.fromJSDate(line.created_date).toISO({includeOffset: false}),
                        file_id: line.file_id
                    });
                };
                const data = {
                    employee_id: req.employee_id,
                    applications: output_rows
                }

                data_result.push(data);
            }
            return reply.code(200).send(JSON.stringify(data_result));
        } catch (err){
            console.log('Error in /api/get_applications: ', err);
            return reply.code(500).send('Internal Server Error: error on getting applications');
        }
    })

    fastify.post('/api/get_unit_applications', async(request, reply) =>{
        const client = await fastify.db.client;
        const req_data = request.body;
        try {  
            let output_rows = new Array();  
            const rows = await getUnitApplications(client, req_data.unit_id);
            for (let line of rows){
                output_rows.push({
                    employee_id: line.employee_id,
                    name: line.name,
                    surname: line.surname,
                    patronymic: line.patronymic,
                    start_date: DateTime.fromJSDate(line.start_date).toISO({includeOffset: false}),
                    end_date: DateTime.fromJSDate(line.end_date).toISO({includeOffset: false}),
                    days: line.days,
                    status: line.status,
                    comment: line.comment,
                    request_id: line.request_id,
                    created_date: DateTime.fromJSDate(line.created_date).toISO({includeOffset: false}),
                    file_id: line.file_id
                });
            };
            
            return reply.code(200).send(JSON.stringify(output_rows));
        } catch (err){
            console.log('Error in /api/get_applications: ', err);
            return reply.code(500).send('Internal Server Error: error on getting applications');
        }
    })

    fastify.post('/api/create_application', async(request, reply)=>{
        const client = await fastify.db.client;
        const req_data = request.body;
        try {
            let insert_data = req_data;
            insert_data.start_date = DateTime.fromISO(req_data.start_date).toSQLDate();
            insert_data.end_date = DateTime.fromISO(req_data.end_date).toSQLDate();
            insert_data["status"] = "awaiting";
            console.log(insert_data.start_date);
            console.log(insert_data.end_date);
            // const insert_data = {
            //     employee_id : req_data.employee_id,
            //     start_date: DateTime.toSQLDate(req_data.start_date),
            //     end_date: DateTime.toSQLDate(req_data.end_date),
            //     status: "awaiting",
            // };
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


    fastify.post('/api/application_management', async(request, reply)=>{

        // const [token_row, employee_role] = await determineAccess(client, request.headers.authorization.replace('Bearer ', ''), 'token', 'Employer')
        // if (!token_row){
        //     return reply.redirect(401, '/api/refresh');
        // }
        // if (!employee_role){
        //     return reply.code(403).send('Access denied');
        // }

        const client = await fastify.db.client;
        const req_data = request.body;
        const user_id = 1; //TODO: Добавить проверку
        try {
            let handle_data = req_data;
            handle_data["user_id"] = user_id;
            await handleApplication(client, handle_data);
            return reply.code(200).send('Application was handled successfully');
        } catch (err) {
            console.error("Error in POST /api/application_managment: ", err);
            return reply.code(400).send('Bad Request: handling of the application failed');
        }
    })

    async function getApplications(client, employee_id){
        try {
            const {rows} = await client.query(
                'SELECT name, surname, patronymic, request_id, employee.employee_id, start_date, end_date, days, status, comment, created_date, file_id FROM request JOIN employee ON request.employee_id = employee.employee_id WHERE employee.employee_id = $1;', 
                [employee_id]
            )
            return rows;
        } catch (err) {
            console.log('Get applications error: ', err);
            throw new Error(err);
        }
    };
    
    async function getUnitApplications(client, unit_id){
        try {
            const {rows} = await client.query(
                'SELECT employee.name, surname, patronymic, request_id, employee.employee_id, start_date, end_date, days, status, comment, created_date, file_id FROM employee JOIN employee_unit ON employee.employee_id = employee_unit.employee_id JOIN unit ON employee_unit.unit_id = unit.unit_id JOIN employee_role ON employee.employee_id = employee_role.employee_id JOIN request ON request.employee_id = employee.employee_id WHERE employee_unit.unit_id = $1;', 
                [unit_id]
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
                'INSERT INTO request (employee_id, start_date, end_date, days, status, comment, created_date, updated_date, updated_by) VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW(), $7);', 
                [insert_data.employee_id, insert_data.start_date, insert_data.end_date, insert_data.days,
                 insert_data.status, insert_data.comment, insert_data.employee_id]
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

    async function handleApplication(client, decision_data){
        try {
            const {rows} = await client.query(
                'UPDATE request SET status=$1, updated_date = NOW(), updated_by = $2 WHERE request_id = $3;',
                [decision_data.status, decision_data.user_id, decision_data.request_id]
            )
            return;
        } catch (err) {
            console.log('Handle Application Error: ', err);
            throw new Error(err);
        }
    }

}

export default applicationsManager;
