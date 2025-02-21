import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken'; 
import bcrypt from 'bcrypt';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const  SECRET_KEY = process.env.SECRET_KEY || 'default_secret_key';
const SALT_ROUNDS = process.env.SALT_ROUNDS || 10;

// Middleware to parse JSON bodies
// app.use(express.json());
app.use(bodyParser.json());
const users=[];


app.post('/register', async(req, res) => {
    const { username, password } = req.body;

    if (!username|| !password) {
        return res.status(400).json({ message: 'All fields (username, password) are required' })}

    if(users.find(user => user.username === username))
    {
        return res.status(408).json({ message: 'User already exists' })
    }

        // res.send(`Register user ${username} with ${password}`)
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        users.push({username,password:hashedPassword});
        res.status(201).json({ message: 'User registered successfully'})
       
        console.log(users);
    });

    app.post('/login', async(req, res) => {
        const { username, password } = req.body;
    
        if (!username || !password) {
            return res.status(400).json({ message: 'All fields (username, password) are required' });
        }
    
        const user = users.find(user => user.username === username);
    
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });

        // Respond with success message and token
        res.status(200).json({ message: 'Login successful', token });
    });

    app.get('/profile',verifyToken,(req,res)=>{
        return res.json({ message: `welcome ${req.username}` });
    })

    function verifyToken(req, res, next){
        const token = req.headers['authorization'];
        if (!token) {
            return res.status(401).json({ message: 'Token required.' });
        }
        try{
        const {username} =   jwt.verify(token, SECRET_KEY)
        req.username = username;
        next()
       }
       catch(error){
        return res.status(403).json({ message: 'Invalid or expired token.' });
       }
    }


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});