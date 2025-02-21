import express from 'express';

const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(express.json());


app.get('/api', (req, res) => {
    res.json({ message: 'Hello, World!' });
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});