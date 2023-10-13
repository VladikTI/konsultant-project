import Fastify from 'fastify';
import bcrypt from 'bcrypt';
import fastifyJwt from 'fastify-jwt';
import { DateTime } from 'luxon';
import dbconnector from './db.js';
import findUserId from './user_utils.js';

const fastify = Fastify({ logger: true });


fastify.register(dbconnector);

async function authRoutes (fastify, options){
    // Register fastify-jwt with your secret key
    fastify.register(fastifyJwt, {
        secret: 'abcdef',
    });
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
                // Пароли совпадают, пользователь аутентифицирован

                    // Generate a JWT token for the registered user
                    const newAccessToken = await generateAccessToken(rows[0].employee_id)
                    
                    try {
                        const {rowsJWT} = await client.query('INSERT INTO authentication (employee_id, token, refresh_token, token_expire_date, refresh_token_expire_date) VALUES ($1,$2, $3, $4, $5)', 
                        [rows[0].employee_id, newAccessToken.token, newAccessToken.refresh_token, 
                        DateTime.local(newAccessToken.token_expire_date).toSQL({includeOffset: false}), 
                        DateTime.local(newAccessToken.refresh_token_expire_date).toSQL({includeOffset: false})])
                    } catch (err) {
                        console.log(err);
                        return reply.status(500).send({error: 'Database error'});
                    }

                    console.log("someth");
                    
                    return reply.code(201).send({"token": newAccessToken.token, "refresh_token": newAccessToken.refresh_token,
                        "token_expire_date": DateTime.local(newAccessToken.token_expire_date).toString(), 
                        "refresh_token_expire_date": DateTime.local(newAccessToken.refresh_token_expire_date).toString()});
                } else {
                // Пароли не совпадают
                    return reply.status(401).send({ error: 'Authentication failed' });
                }
            }
        } catch (err){
            console.log(err);
            return reply.status(500).send({ error: 'Database error' });
            
        }
    });
      
    fastify.post('/api/refresh/', async (request, reply) => {

        // Проверьте, есть ли Refresh Token в вашей базе данных
        const refreshTokenString = request.headers.authorization.replace('Bearer ', '');
        const storedAuthTokens = await findRefreshTokenInDatabase(refreshTokenString);
        
        const employee_id = await findUserId(client, refreshTokenString);

        if (!storedAuthTokens) {
            reply.code(401).send({ error: 'Invalid Refresh Token' });
            return;
        }
    
        // Проверьте, не истек ли срок действия Refresh Token
        if (isRefreshTokenExpired(storedAuthTokens)) {
            reply.code(401).send({ error: 'Refresh Token has expired' });
            return;
        }
    
        // Проверьте, что Refresh Token принадлежит пользователю
        if (storedAuthTokens.employee_id !== employee_id) {
            reply.code(401).send({ error: 'Refresh Token does not belong to the user' });
            return;
        }
    
        // Если все проверки успешны, создайте новый Access Token и верните его
        const newAccessToken = generateAccessToken(employee_id);
        
        return reply.code(200).send({ "token": newAccessToken.accessToken, "refresh_token": newAccessToken.refreshToken, 
        "token_expire_date": newAccessToken.tokenExpirationDateTime,
        "refresh_token_expire_date": newAccessToken.refreshTokenExpirationDateTime});
    });
    // Ваши функции для работы с базой данных и генерации токенов

    function findRefreshTokenInDatabase(refreshToken) {
        
        return new Promise( async (resolve, reject) => {
            const client = fastify.db.client;
            try {
                const {rows} = await client.query('SELECT refresh_token FROM authentication WHERE refresh_token=$1;', [refreshToken]);
                if (rows.length === 0) {
                    resolve(null);
                    return; // Если Refresh Token не найден, возвращаем null
                } else {
                    resolve(rows[0]);
                    return;
                }
            } catch (err) {
                reject(err);
                return;
            }
        });     
    };

    function isRefreshTokenExpired(storedAuthTokens) {
        // Проверка истечения срока действия Refresh Token
        // Вернуть true, если истек, и false, если действителен
        const expireDate = DateTime.fromSQL(storedAuthTokens.refresh_token_expire_date);
        return expireDate.isAfter(DateTime.now());
    }
      
    async function generateAccessToken(employee_id) {
        // Генерация нового Access Token для пользователя
        // Вернуть сгенерированный токен
        
        const client = fastify.db.client;
        try {
            const { rows } = await client.query('SELECT username FROM employee WHERE employee_id=$1;', [employee_id]);
            console.log('employee_id: ',employee_id);
            console.log('rows: ', rows);
            const tokenExpiresInMinutes = 60;
            const tokenExpirationDateTime = DateTime.local().plus({minutes: tokenExpiresInMinutes});
    
            const refreshTokenExpiresInMinutes = 60*24;
            const refreshTokenExpirationDateTime = DateTime.now().plus({minutes: refreshTokenExpiresInMinutes});
            const username = rows[0].username;
            const accessToken = fastify.jwt.sign({ username }, {expiresIn: tokenExpiresInMinutes * 60});
            const refreshToken = fastify.jwt.sign({username}, 'rabcdef', {expiresIn: refreshTokenExpiresInMinutes * 60});

            return {token: accessToken, refresh_token: refreshToken, token_expire_date: tokenExpirationDateTime, refresh_token_expire_date: refreshTokenExpirationDateTime};
        } catch (err) {
            console.error('Error generating JWT: ', err);
            throw new Error(`Failed to create access token`);
        }
    }

};






export default authRoutes;