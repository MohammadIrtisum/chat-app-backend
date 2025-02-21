import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken'; 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const  SECRET_KEY = process.env.SECRET_KEY || 'default_secret_key';

// Middleware to parse JSON bodies
// app.use(express.json());
app.use(bodyParser.json());
const users=[];


app.post('/register', (req, res) => {
    const { username, password } = req.body;

    if (!username|| !password) {
        return res.status(400).json({ message: 'All fields (username, password) are required' })}

    if(users.find(user => user.username === username))
    {
        return res.status(408).json({ message: 'User already exists' })
    }

        // res.send(`Register user ${username} with ${password}`)
        users.push({username,password});
        res.status(201).json({ message: 'User registered successfully'})
       

    });

    app.post('/login', (req, res) => {
        const { username, password } = req.body;
    
        if (!username || !password) {
            return res.status(400).json({ message: 'All fields (username, password) are required' });
        }
    
        const user = users.find(user => user.username === username);
    
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
    
     
        if (user.password !== password) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });

        // Respond with success message and token
        res.status(200).json({ message: 'Login successful', token });
    });


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});