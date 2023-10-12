import Fastify from 'fastify';
import bcrypt from 'bcrypt';
import fastifyJwt from 'fastify-jwt';
import fastifyPostgres from '@fastify/postgres';
import { DateTime } from 'luxon';

const fastify = Fastify({ logger: true });

fastify.register(fastifyPostgres, {
    connectionString: 'postgres://admin@localhost/vacations'
})

async function authRoutes (fastify, options){
    // Register fastify-jwt with your secret key
    fastify.register(fastifyJwt, {
        secret: 'abcdef', // Replace with a secure secret key
    });


    console.log("12SDFASDFASDF");
    // Register route for user registration and JWT generation
    fastify.post('/api/auth/', async (request, reply) => {
        const { username, password } = request.body;
        
        await fastify.pg.query(
            'SELECT employee_id, username, password, salt FROM employee WHERE username=$1', [username],
            async function onResult (err, result) {
                if (err) {
                    return reply.status(500).send({ error: 'Database error' });
                }
                
                if (result.rows.length === 0) {
                    // Пользователь с таким именем не найден
                    return reply.status(401).send({ error: 'Authentication failed' });
                } else {
                    // Сравниваем хешированный пароль из базы с введенным паролем и солью
                    const storedHashedPassword = result.rows[0].password;
                    const isPasswordValid = await bcrypt.compare(password, storedHashedPassword);
                
                    if (isPasswordValid) {
                    // Пароли совпадают, пользователь аутентифицирован

                        // Generate a JWT token for the registered user
                    

                        await fastify.pg.query(
                            'INSERT INTO authentication (employee_id, token, refresh_token, token_expire_date, refresh_token_expire_date) VALUES ($1,$2, $3, $4, $5)', 
                            [result.rows[0].employee_id, accessToken, refreshToken, tokenExpirationDateTime.toSQL(), refreshTokenExpirationDateTime.toSQL()],
                            async function onResult (err, result) {
                                if (err) {
                                    return reply.status(500).send({error: 'Database error'});
                                }
                            })
                        
                        return reply.code(201).send({token: accessToken, refresh_token: refreshToken, token_expire_date: tokenDateString, refresh_token_expire_date: refreshTokenDateString});
                        
                        console.log("someth");
                    } else {
                    // Пароли не совпадают
                        return reply.status(401).send({ error: 'Authentication failed' });
                    }
                }
            })
    });
};
  
fastify.post('/api/refresh/', async (request, reply) => {
    const { refresh_token } = request.body;
  
    // Проверьте, есть ли Refresh Token в вашей базе данных
    const storedAuthTokens = await findRefreshTokenInDatabase(refresh_token);
  
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
    if (storedAuthTokens.employee_id !== request.employee_id) {
        reply.code(401).send({ error: 'Refresh Token does not belong to the user' });
        return;
    }
  
    // Если все проверки успешны, создайте новый Access Token и верните его
    const newAccessToken = generateAccessToken(request.employee_id);
  
    return reply.code(200).send({ token: newAccessToken.accessToken, refresh_token: newAccessToken.refreshToken, token_expire_date: newAccessToken.tokenExpirationDateTime,
    refresh_token_expire_date: newAccessToken.refreshTokenExpirationDateTime});
});

// Ваши функции для работы с базой данных и генерации токенов

function findRefreshTokenInDatabase(refreshToken) {
    return new Promise((resolve, reject) => {
        fastify.pg.query(
            'SELECT refresh_token FROM authorization WHERE refresh_token=$1',
            [refreshToken],
            (err, result) => {
                if (err) {
                    reject(err);
                    return;
                }
            
                if (result.rows.length === 0) {
                    resolve(null); // Если Refresh Token не найден, возвращаем null
                } else {
                    resolve(result.rows[0]);
                }
            });
    });
}

function isRefreshTokenExpired(storedAuthTokens) {
  // Проверка истечения срока действия Refresh Token
  // Вернуть true, если истек, и false, если действителен
    const expireDate = DateTime.fromSQL(storedAuthTokens.refresh_token_expire_date);
    return expireDate.isAfter(DateTime.now());
}

function generateAccessToken(employee_id) {
  // Генерация нового Access Token для пользователя
  // Вернуть сгенерированный токен
    const client = fastify.pg.connect()
    try {
        const { rows } = client.query(
        'SELECT username FROM employee WHERE employee_id=$1', [employee_id],
        )
        const tokenExpiresInMinutes = 60;
        const tokenExpirationDateTime = DateTime.local().plus({minutes: tokenExpiresInMinutes});

        const refreshTokenExpiresInMinutes = 60*24;
        const refreshTokenExpirationDateTime = DateTime.now().plus({minutes: refreshTokenExpiresInMinutes});
        const username = rows[0].username;
        const accessToken = fastify.jwt.sign({ username }, {expiresIn: tokenExpiresInMinutes * 60});
        const refreshToken = fastify.jwt.sign({username}, 'rabcdef', {expiresIn: refreshTokenExpiresInMinutes * 60});
    // Note: avoid doing expensive computation here, this will block releasing the client
        return {accessToken, refreshToken, tokenExpirationDateTime, refreshTokenExpirationDateTime};
    } finally {
        // Release the client immediately after query resolves, or upon error
        client.release();
    }
}


export default authRoutes;