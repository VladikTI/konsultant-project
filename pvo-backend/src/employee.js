import Fastify from 'fastify';
import bcrypt from 'bcrypt';
import dbconnector from './db.js';
// import { findUserId } from './user_utils.js';\
import authRoutes from './auth.js';

const fastify = Fastify({
    logger: true
})

fastify.register(dbconnector);

fastify.register(authRoutes);

async function employeeRoutes (fastify, options){

    fastify.get('/api/get_employees', async(request, reply) => {
        const client = await fastify.db.client;

        let data_result = new Array();

        try {
            const rows = await getEmployees(client);
            for (let line of rows){
                const data = {
                    employee_id: request.employee_id,
                    employee: line
                }
    
                data_result.push(data);
            };
            const result = {
                data: data_result
            }
            return reply.code(200).send(JSON.stringify(result));
        } catch (err) {
            console.log('Error in /api/get_employees: ', err);
            return reply.code(500).send('Error in /api/get_employees:', err);
        }
    })

    fastify.post('/api/add_employee', {preValidation: [fastify.authenticate]}, async(request, reply) => {

        const client = await fastify.db.client;
        
        // TODO: Add check for rights
        // const token_row = await findTokenInDatabase(client, request.headers.authorization.replace('Bearer ', ''), 'token');
        // if (!token_row){
        //     return reply.redirect(401, '/api/refresh');
        // }

        const req_data = request.body;
        
        const salt = await bcrypt.genSaltSync(10);
        const hashedPassword = await bcrypt.hashSync(req_data.password, salt);

        // const token_row = await findTokenInDatabase(client, req_data.token, 'token');
        const user_id = null;

        try {
            let insert_data = req_data;
            insert_data["user_id"] = user_id;
            insert_data.password = hashedPassword;

            const employee_id = await insertEmployee(client, insert_data);

            await insertEmployeeRole(client, employee_id, req_data.role_id, user_id);
            
            await insertEmployeeUnit(client, employee_id, req_data.unit_id, user_id);
            
            return reply.code(200).send('New employee was added');
        } catch (err) {
            console.log('Error while inserting data to database');
            return reply.code(500).send('Internal Server Error: error on adding employee');   
        }

    });

    fastify.post('/api/update_employee', {preValidation: [fastify.authenticate]}, async(request, reply)=>{
        
        const client = fastify.db.client;

        // TODO: Add check for rights
        // const token_row = await findTokenInDatabase(client, request.headers.authorization.replace('Bearer ', ''), 'token');
        // if (!token_row){
        //     return reply.redirect(401, '/api/refresh');
        // }

        const req_data = request.body;
        const user_id = 1;

        try {
            let insert_data = req_data;
            insert_data["user_id"] = user_id;
            
            await updateEmployee(client, insert_data);
            
            return reply.code(200).send('Employee was updated');
        } catch (err) {
            console.log('Error while updating data to database');
            return reply.code(500).send('Internal Server Error: error on editing employee');   
        }
        
    });

    fastify.post('/api/delete_employee', {preValidation: [fastify.authenticate]}, async(request, reply)=>{

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
            await deleteEmployee(client, req_data.employee_id);
            return reply.code(200).send('Employee was deleted successfully');
        } catch(err) {
            console.error("Error in POST /api/delete_unit: ", err);
            return reply.code(400).send('Bad Request: deletion of the employee failed');
        }
    })

    async function updateEmployee(client, insert_data){
        try {
            const { rows } = await client.query(
                'UPDATE employee SET name = $1, surname = $2, patronymic = $3, position = $4, username = $5, password = $6, available_vacation = $7, updated_date = NOW(), updated_by = $8 WHERE employee_id = $9',
                [insert_data.name, insert_data.surname, insert_data.patronymic, insert_data.position, insert_data.username, 
                    insert_data.password, insert_data.available_vacation, insert_data.user_id, inser_data.employee_id],
            );
            return;
        } catch (err) {
            console.error("Update Employee Error: ", err);
            throw new Error(err);
        }
    }


    async function insertEmployee(client, insert_data){
        try {
            const { rows } = await client.query(
                'INSERT INTO employee(name, surname, patronymic, position, username, password, available_vacation, updated_date, updated_by) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), $8) RETURNING employee_id;',
                [insert_data.name, insert_data.surname, insert_data.patronymic, insert_data.position, insert_data.username, 
                    insert_data.password, insert_data.available_vacation, insert_data.user_id],
            );
          // Note: avoid doing expensive computation here, this will block releasing the client
            return rows[0].employee_id;
        } catch (err) {
            console.error("Insert Employee Error: ", err);
            throw new Error(err);
        }
    }

    
    async function insertEmployeeRole(client, employee_id, role_id, user_id){
        try {
            const { rows } = await client.query(
                'INSERT INTO employee_role (employee_id, role_id, updated_date, updated_by) VALUES ($1, $2, NOW(), $3);', 
                [employee_id, role_id, user_id],
            );
          // Note: avoid doing expensive computation here, this will block releasing the client
            return;
        }  catch (err) {
            console.error("Insert EmployeeRole Error: ", err);
            throw new Error(err);
        }
    }
    
    async function insertEmployeeUnit(client, employee_id, unit_id, user_id){
        try {
            const { rows } = await client.query(
                'INSERT INTO employee_unit (employee_id, unit_id, updated_date, updated_by) VALUES ($1, $2, NOW(), $3)',
                [employee_id, unit_id, user_id]
            );
          // Note: avoid doing expensive computation here, this will block releasing the client
            return;
        }  catch (err) {
            console.error("Insert EmployeeUnit Error: ", err);
            throw new Error(err);
        }
    }

    async function deleteEmployee(client, employee_id){
        try {
            const {rows} = await client.query(
                'DELETE FROM employee WHERE employee_id = $1;', [employee_id]
            );
            return;
        } catch (err) {
            console.log('Delete Employee Error: ', err);
            throw new Error(err);
        }
    }

    async function getEmployees(client){
        try {
            const {rows} = await client.query(
                'SELECT employee.employee_id, employee.name as name, surname, patronymic, position, unit.name as unit FROM employee JOIN employee_unit ON employee.employee_id = employee_unit.employee_id JOIN unit ON employee_unit.unit_id = unit.unit_id; '
            )
            return rows;
        } catch (err) {
            console.log('Get Employees Error: ', err);
            throw new Error(err);
        }
    }
}





export default employeeRoutes;