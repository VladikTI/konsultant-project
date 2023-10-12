import Fastify from 'fastify';
import bcrypt from 'bcrypt';
import fastifyPostgres from '@fastify/postgres';

const fastify = Fastify({
    logger: true
  })

async function addEmployeeRoutes (fastify, options){
    fastify.register(fastifyPostgres, {
        connectionString: 'postgres://admin:admin@localhost/vacations'
    })

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
            user_id: {type: 'int'}, 
            role_id: {type: 'int'}
        }
    }

    fastify.post('/api/add_employee/', employeeBodyJsonSchema, async(request, reply) => {
        const req_data = request.body;
        const salt = await bcrypt.genSaltSync(10);
        const hashedPassword = await bcrypt.hashSync(req_data.password, salt);
        const client = await fastify.pg.connect();
        try {
            const employee_id = await insertEmployee(request.body);
            
            const role_id = await insertRole(request.body);

            await insertEmployeeRole(client, req_data.employee_id, req_data.role_id, req_data.user_id);
            
            await insertEmployeeUnit(client,req_data.employee_id, req_data.unit_id, req_data.user_id);
        } finally {
            // Release the client immediately after query resolves, or upon error
            client.release()
          }

    });
}

async function insertEmployee(client, insert_data){
    try {
        const { rows } = await client.query(
            'INSERT INTO employee(name, surname, patronymic, position, username, password, available_vacation, updated_date, updated_by) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW()::timestamp, $8) RETURNING employee_id',
            [insert_data.name, insert_data.surname, insert_data.patronymic, insert_data.position, insert_data.username, 
                hashedPassword, insert_data.available_vacation, insert_data.user_id],
        );
      // Note: avoid doing expensive computation here, this will block releasing the client
        return rows.employee_id;
    }  catch (err) {
        console.error("внутренний блок catch", err);
        return;
    }
}

async function insertRole(client, insert_data){
    try {
        const { rows } = await client.query(
            'INSERT INTO role(name, updated_date, updated_by) VALUES ($1, NOW()::timestamp, $2) RETURNING role_id',
            [insert_data.name, insert_data.user_id],
        );
      // Note: avoid doing expensive computation here, this will block releasing the client
        return rows.role_id;
    }  catch (err) {
        console.error("внутренний блок catch", err);
        return;
    }
}


async function insertEmployeeRole(client, employee_id, role_id, user_id){
    try {
        const { rows } = await client.query(
            'INSERT INTO employee_role (employee_id, role_id, NOW()::timestamp, updated_by) VALUES ($1, $2, NOW()::timestamp, $3)'
        );
      // Note: avoid doing expensive computation here, this will block releasing the client
        return;
    }  catch (err) {
        console.error("внутренний блок catch", err);
        return;
    }
}

async function insertEmployeeUnit(client, employee_id, unit_id, user_id){
    try {
        const { rows } = await client.query(
            'INSERT INTO employee_unit (employee_id, unit_id, NOW()::timestamp, updated_by) VALUES ($1, $2, NOW()::timestamp, $3)'
        );
      // Note: avoid doing expensive computation here, this will block releasing the client
        return rows.role_id;
    }  catch (err) {
        console.error("внутренний блок catch", err);
        return;
    }
}

export default addEmployeeRoutes;