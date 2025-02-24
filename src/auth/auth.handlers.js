import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


const users = [];

const  SECRET_KEY = process.env.SECRET_KEY || 'default_secret_key';
const SALT_ROUNDS = process.env.SALT_ROUNDS || 10;

export const registerHandler = async(req, res) => {
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
    };


export const loginHandler = async(req, res) => {
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
}

