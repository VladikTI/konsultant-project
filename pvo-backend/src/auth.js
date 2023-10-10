import Fastify from 'fastify';
import bcrypt from 'bcrypt';
import fastifyJwt from 'fastify-jwt';
import fastifyPostgres from '@fastify/postgres'

const fastify = Fastify({ logger: true });

fastify.register(fastifyPostgres, {
    connectionString: 'postgres://postgres@localhost/postgres'
})

fastify.get('/user/:id', async (req, reply) => {

})
// Register fastify-jwt with your secret key
fastify.register(fastifyJwt, {
  secret: 'your-secret-key', // Replace with a secure secret key
});

// Simulated user data (you should have a real database)
const users = [];

// Register route for user registration and JWT generation
fastify.post('/auth', async (request, reply) => {
    const { username, password } = request.body;
  
    fastify.pg.query(
        'SELECT employee_id, username, password, salt FROM employee WHERE username=$1', 
        [username],
        async function onResult (err, result) {
            if (err) {
                reply.status(500).send({ error: 'Database error' });
            } else {
                if (result.rows.length === 0) {
                    // Пользователь с таким именем не найден
                    reply.status(401).send({ error: 'Authentication failed' });
                } else {
                    // Сравниваем хешированный пароль из базы с введенным паролем и солью
                    const storedHashedPassword = result.rows[0].password;
                    const salt = result.rows[0].salt;
                    const isPasswordValid = await bcrypt.compare(password + salt, storedHashedPassword);
                
                    if (isPasswordValid) {
                    // Пароли совпадают, пользователь аутентифицирован
                    
                        // Generate a JWT token for the registered user
                        const token = fastify.jwt.sign({ username });
                        
                        reply.code(201).send({ token });
                        reply.send({ message: 'Authentication successful' });
                    } else {
                    // Пароли не совпадают
                        reply.status(401).send({ error: 'Authentication failed' });
                    }
                }
            }
        }
    );
});
  

// Start the server
fastify.listen(3000, (err) => {
  if (err) {
    console.error('Error starting the server:', err);
    process.exit(1);
  }
  console.log('Server is running on port 3000');
});
