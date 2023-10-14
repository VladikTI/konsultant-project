import Fastify from 'fastify';
import bcrypt from 'bcrypt';
import dbconnector from './db.js';
import { findUserId } from './user_utils.js';

const fastify = Fastify({
    logger: true
})

fastify.register(dbconnector);

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
        const req_data = await request.body;
        const salt = await bcrypt.genSaltSync(10);
        const hashedPassword = await bcrypt.hashSync(req_data.password, salt);

        const user_id = await findUserId(request.headers.authorization.replace('Bearer ', ''));


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
        } catch (err) {
            console.log('Error while inserting data to database');
            return reply.code(500).send('Internal Server Error');   
        }

    });

    // fastify.post('/api/update_employee/', async(request, reply)=>{
    //     const client = fastify.db.client;
    //     const req_data = request.body;
    //     try {
    //         const 
    //     }
        
    // })


    async function updateEmployee(client, insert_data){
        try {
            const { rows } = await client.query(
                'UPDATE employee SET name = $1, surname = $2, patronymic = $3, position = $4, username = $5, password = $6, available_vacation = $7, updated_date = NOW(), updated_by = $8 WHERE employee_id = $9',
                [insert_data.name, insert_data.surname, insert_data.patronymic, insert_data.position, insert_data.username, 
                    insert_data.password, insert_data.available_vacation, insert_data.user_id, inser_data.employee_id],
            );
          // Note: avoid doing expensive computation here, this will block releasing the client
        } catch (err) {
            console.error("InsertEmployeeError: ", err);
            return;
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
            return;
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
            return;
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
            return;
        }
    }


}





export default employeeRoutes;