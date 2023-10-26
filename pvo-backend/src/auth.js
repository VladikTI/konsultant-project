import Fastify from 'fastify';
import bcrypt from 'bcrypt';
import fastifyJwt from '@fastify/jwt';
import { DateTime } from 'luxon';
import dbconnector from './db.js';

const fastify = Fastify({ logger: true });

fastify.register(dbconnector);

const accessExpireTimeSeconds = 3600;
const refreshExpireTimeSeconds = 86400;

async function authRoutes (fastify, options){

    fastify.post('/auth', async (request, reply) => {

        const client = fastify.db.client;
        const { username, password } = request.body;
        try {
            const {rows} = await client.query('SELECT employee_id, username, password FROM employee WHERE username=$1', [username]);
            if (rows.length === 0) {
                // Пользователь с таким именем не найден
                return reply.status(401).send({ error: 'Authentication failed' });
            } else {
                // Сравниваем хешированный пароль из базы с введенным паролем и солью
                const storedHashedPassword = rows[0].password;
                const isPasswordValid = await bcrypt.compare(password, storedHashedPassword);
            
                if (isPasswordValid) {

                    const newAccessToken = await generateAccessToken(username);
                    const newRefreshToken = await generateRefreshToken(username);
                    let accessTokenExpire = DateTime.local().plus({seconds: accessExpireTimeSeconds});
                    let refreshTokenExpire = DateTime.local().plus({seconds: refreshExpireTimeSeconds});
                    
                    try {
                        await client.query(
                            'INSERT INTO authentication (employee_id, token, refresh_token, token_expire_date, refresh_token_expire_date) VALUES ($1,$2, $3, $4, $5)', 
                            [rows[0].employee_id, newAccessToken, newRefreshToken, 
                             accessTokenExpire.toSQL({includeOffset: false}), refreshTokenExpire.toSQL({includeOffset: false})]
                        )
                    } catch (err) {
                        console.log(err);
                        return reply.status(500).send('Database error');
                    }
                    
                    return reply.code(201).send(JSON.stringify({
                        token: newAccessToken, 
                        refresh_token: newRefreshToken,
                        token_expire_date: accessTokenExpire.toString(), 
                        refresh_token_expire_date: refreshTokenExpire.toString()
                    }));
                } else {
                // Пароли не совпадают
                    return reply.status(401).send('Authentication failed');
                }
            }
        } catch (err){
            console.log(err);
            return reply.status(500).send('Database error');
        }
    });
      
    fastify.post('/api/refresh', {preValidation: [fastify.authenticate]}, async (request, reply) => {
        const client = fastify.db.client;

        const refreshTokenString = request.headers.authorization.replace('Bearer ', '');
        const storedAuthTokens = await findTokenInDatabase(client, refreshTokenString, 'refresh_token');
        
        // const employee_id = await findUserId(client, refreshTokenString, "refresh_token");

        if (!storedAuthTokens) {
            reply.code(401).send('Invalid Refresh Token').redirect('/login');
            return;
        }
    
        if (isRefreshTokenExpired(storedAuthTokens)) {
            reply.code(401).send('Refresh Token has expired').redirect('/login');
            return;
        }
    
        // Если все проверки успешны, создайте новый Access Token и верните его

        let username;
        try {
            const { rows }= await client.query(
                'SELECT username FROM employee WHERE employee_id=$1;', 
                [storedAuthTokens.employee_id]
            );
            username = rows[0].username;
        } catch(err) {
            console.error("Error While Refreshing Token: ", err);
            return reply.code(500).send('Refresh Error: Database Error');
        }

        const newAccessToken = await generateAccessToken(username);
        const accessTokenExpire = DateTime.local();

        try {
            await client.query(
                'UPDATE authentication SET token = $1, token_expire_date = $2 WHERE employee_id = $3',
                [newAccessToken, accessTokenExpire.toSQL(), storedAuthTokens.employee_id]
            );
        } catch (err) {
            console.error("Error While Refreshing Token: ", err);
            return reply.code(500).send('Refresh Error: Database Error');
        }
        
        return reply.code(200).send(JSON.stringify({
            token: newAccessToken, 
            refresh_token: storedAuthTokens.refreshToken, 
            token_expire_date: accessTokenExpire,
            refresh_token_expire_date: storedAuthTokens.refresh_token_expire_date
        }));
    });
    // Ваши функции для работы с базой данных и генерации токенов

    async function findTokenInDatabase(client, token, token_name) {
        try {
            const {rows} = await client.query(
                `SELECT * FROM authentication WHERE ${token_name}=$1 ORDER BY updated_date;`,
                [token]
            );
            return rows[0];
        }  catch (err) {
            console.log('Find User Id Error: ', err);
            throw new Error(err);
        }
    }

    function isRefreshTokenExpired(storedAuthTokens) {

        const expireDate = DateTime.fromSQL(storedAuthTokens.refresh_token_expire_date);
        return expireDate>DateTime.now();
    }

    async function generateAccessToken(username) {
        try {
            const accessToken = fastify.jwt.sign({ name: username }, { expiresIn: accessExpireTimeSeconds});
            return accessToken;
        } catch (err) {
            console.error("Generate Access Token Error", err);
            throw new Error(err);
        }
    }

    async function generateRefreshToken(username) {
        try {
            const refreshToken = fastify.jwt.sign({ name: username }, { expiresIn: refreshExpireTimeSeconds});
            return refreshToken;
        } catch (err) {
            console.error("Generate Refresh Token Error", err);
            throw new Error(err);
        }
    }

    // async function determineAccess(client, token, token_name, role_name){
    //     const token_row = await findTokenInDatabase(client, token, token_name);

    //     if (!token_row){
    //         return reply.redirect(401, '/api/refresh');
    //     }
        
    //     try {
    //         const employee_role = await client.query('SELECT * FROM employee_role JOIN role ON employee_role.role_id = role.role_id WHERE employee_id = $1 AND name = $2;',
    //         [token_row.employee_id, role_name] );
    //         return [token_row, employee_role];
    //     } catch (err) {
    //         console.error('Error determining access', err);
    //         return [token_row, null];
    //     }
        
    // }

};






export default authRoutes;