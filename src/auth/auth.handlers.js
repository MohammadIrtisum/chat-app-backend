import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from "../dataBase/prisma.js";

// const users = [];

const  SECRET_KEY = process.env.SECRET_KEY || 'default_secret_key';
const SALT_ROUNDS = process.env.SALT_ROUNDS || 10;

export const registerHandler = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
  
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
  
    if (user) {
      return res.status(400).json({ message: "User already exists!" });
    }
  
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  
    await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
      },
    });
  
    res.status(201).json({ message: "User created successfully!" });
  };


export const loginHandler = async(req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'All fields (username, password) are required' });
    }

    // const user = users.find(user => user.username === username);
    const user = await prisma.user.findUnique({
        where: {
            email,
        },
    });

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid password' });
    }

    const token = jwt.sign({ email }, SECRET_KEY, { expiresIn: '1h' });

    // Respond with success message and token
    res.status(200).json({ message: 'Login successful', token });
}

