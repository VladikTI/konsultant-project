import Fastify from 'fastify';
import bcrypt from 'bcrypt';
import fastifyJwt from '@fastify/jwt';
import { DateTime } from 'luxon';
import dbconnector from './db.js';
// import cors from '@fastify/cors';


const fastify = Fastify({ logger: true });

fastify.register(dbconnector);



async function authRoutes (fastify, options){
    // Register fastify-jwt with your secret key
    fastify.register(fastifyJwt, {
        secret: '$2b$10$XXLk187ZPJU1OhhUw2.jEeFEYC4ufWO2fGuyEkGFRGdDhQoTm5gxm'
    });


    fastify.decorate('authenicate', async function (request, reply){
        try {
            await request.jwtVerify();
        } catch (err) {
            reply.code(401).send(err);
        }
    })

    // Register route for user registration and JWT generation
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
                    let accessTokenExpire = DateTime.local();
                    let refreshTokenExpire = accessTokenExpire.plus({days: 1});
                    
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
                    
                    return reply.code(201).send({
                        token: newAccessToken, 
                        refresh_token: newRefreshToken,
                        token_expire_date: accessTokenExpire.toString(), 
                        refresh_token_expire_date: refreshTokenExpire.toString()
                    });
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
      
    fastify.post('/api/refresh/', async (request, reply) => {
        const client = fastify.db.client;
        // Проверьте, есть ли Refresh Token в вашей базе данных
        const refreshTokenString = request.headers.authorization.replace('Bearer ', '');
        const storedAuthTokens = await findTokenInDatabase(client, refreshTokenString, 'refresh_token');
        
        // const employee_id = await findUserId(client, refreshTokenString, "refresh_token");

        if (!storedAuthTokens) {
            reply.code(401).send({ error: 'Invalid Refresh Token' }).redirect('/login');
            return;
        }
    
        // Проверьте, не истек ли срок действия Refresh Token
        if (isRefreshTokenExpired(storedAuthTokens)) {
            reply.code(401).send({ error: 'Refresh Token has expired' }).redirect('/login');
            return;
        }
    
        // Если все проверки успешны, создайте новый Access Token и верните его
        const newAccessToken = generateAccessToken(employee_id);
        
        return reply.code(200).send({ "token": newAccessToken.accessToken, "refresh_token": newAccessToken.refreshToken, 
        "token_expire_date": newAccessToken.tokenExpirationDateTime,
        "refresh_token_expire_date": newAccessToken.refreshTokenExpirationDateTime});
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
        return expireDate.isAfter(DateTime.now());
    }

    // function isAccessTokenExpired(stored)
      
    async function generateAccessToken(username) {
        try {
            const accessToken = fastify.jwt.sign({ name: username }, { expiresIn: '1h'});
            return accessToken;
        } catch (err) {
            console.error("Generate Access Token Error", err);
            throw new Error(err);
        }
    }

    async function generateRefreshToken(username) {
        try {
            const refreshToken = fastify.jwt.sign({ name: username }, { expiresIn: '1d'});
            return refreshToken;
        } catch (err) {
            console.error("Generate Refresh Token Error", err);
            throw new Error(err);
        }
    }


    // async function generateAccessToken(employee_id) {
        
    //     const client = fastify.db.client;
    //     try {
    //         const { rows } = await client.query('SELECT username FROM employee WHERE employee_id=$1;', [employee_id]);
    //         console.log('employee_id: ',employee_id);
    //         console.log('rows: ', rows);
    //         const tokenExpiresInMinutes = 60;
    //         const tokenExpirationDateTime = DateTime.local().plus({minutes: tokenExpiresInMinutes});
    
    //         const refreshTokenExpiresInMinutes = 60*24;
    //         const refreshTokenExpirationDateTime = DateTime.now().plus({minutes: refreshTokenExpiresInMinutes});
    //         const username = rows[0].username;
    //         const accessToken = fastify.jwt.sign({ username }, {expiresIn: tokenExpiresInMinutes * 60});
    //         const refreshToken = fastify.jwt.sign({username}, 'rabcdef', {expiresIn: refreshTokenExpiresInMinutes * 60});

    //         return {token: accessToken, refresh_token: refreshToken, token_expire_date: tokenExpirationDateTime, refresh_token_expire_date: refreshTokenExpirationDateTime};
    //     } catch (err) {
    //         console.error('Error generating JWT: ', err);
    //         throw new Error(`Failed to create access token`);
    //     }
    // }

    

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