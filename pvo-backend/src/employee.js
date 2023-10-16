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

    const employeeBodyJsonSchema = {
        type: 'object',
        properties: {
            name: {type: 'string'},
            surname: {type: 'string'},
            patronymic: {type: 'string'},
            position: {type: 'string'},
            username: {type: 'string'},
            password: {type: 'string'},
            unit_id: {type: 'int'},
            available_vacation: {type: 'int'},
            role_id: {type: 'int'}
        }
    }

    fastify.post('/api/add_employee', employeeBodyJsonSchema, async(request, reply) => {

        const client = await fastify.db.client;
        
        // TODO: Add check for rights
        const token_row = await findTokenInDatabase(client, request.headers.authorization.replace('Bearer ', ''), 'token');
        if (!token_row){
            return reply.redirect(401, '/api/refresh');
        }

        const req_data = request.body;
        
        const salt = await bcrypt.genSaltSync(10);
        const hashedPassword = await bcrypt.hashSync(req_data.password, salt);

        const user_id = token_row.employee_id;

        try {
            const insert_data = {
                name: req_data.name,
                surname: req_data.surname,
                patronymic: req_data.patronymic,
                position: req_data.position,
                username: req_data.username,
                password: hashedPassword,
                available_vacation: req_data.available_vacation,
                user_id: user_id
            }
            const employee_id = await insertEmployee(client, insert_data);

            await insertEmployeeRole(client, employee_id, req_data.role_id, user_id);
            
            await insertEmployeeUnit(client, employee_id, req_data.unit_id, user_id);
            
            return reply.code(200).send('New employee was added');
        } catch (err) {
            console.log('Error while inserting data to database');
            return reply.code(500).send('Internal Server Error: error on adding employee');   
        }

    });

    fastify.post('/api/update_employee/', async(request, reply)=>{
        
        const client = fastify.db.client;

        // TODO: Add check for rights
        const token_row = await findTokenInDatabase(client, request.headers.authorization.replace('Bearer ', ''), 'token');
        if (!token_row){
            return reply.redirect(401, '/api/refresh');
        }

        const req_data = request.body;
        const user_id = token_row.employee_id;

        try {
            const insert_data = {
                name: req_data.name,
                surname: req_data.surname,
                patronymic: req_data.patronymic,
                position: req_data.position,
                username: req_data.username,
                password: hashedPassword,
                available_vacation: req_data.available_vacation,
                user_id: user_id
            }
            await updateEmployee(client, insert_data);
            
            return reply.code(200).send('Employee was updated');
        } catch (err) {
            console.log('Error while updating data to database');
            return reply.code(500).send('Internal Server Error: error on editing employee');   
        }
        
    });

    // fastify.post('/api/register_admin/', async(request, reply) =>{

    //     const client = fastify.db.client;

        
    // })


    async function updateEmployee(client, insert_data){
        try {
            const { rows } = await client.query(
                'UPDATE employee SET name = $1, surname = $2, patronymic = $3, position = $4, username = $5, password = $6, available_vacation = $7, updated_date = NOW(), updated_by = $8 WHERE employee_id = $9',
                [insert_data.name, insert_data.surname, insert_data.patronymic, insert_data.position, insert_data.username, 
                    insert_data.password, insert_data.available_vacation, insert_data.user_id, inser_data.employee_id],
            );
            return;
        } catch (err) {
            console.error("UpdateEmployeeError: ", err);
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
            console.error("InsertEmployeeError: ", err);
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
            console.error("InsertEmployeeRoleError: ", err);
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
            console.error("InsertEmployeeUnitError: ", err);
            throw new Error(err);
        }
    }



}





export default employeeRoutes;