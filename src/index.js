import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import authRouter from './auth/auth.routes.js';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;



// Middleware to parse JSON bodies
// app.use(express.json());
app.use(bodyParser.json());
app.use("auth",authRouter);


    // app.get('/profile',verifyToken,(req,res)=>{
    //     return res.json({ message: `welcome ${req.username}` });
    // })

    


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});