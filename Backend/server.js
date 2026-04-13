import express from 'express';
import cors from 'cors';
import authRouter from './src/routes/auth.js';
import userRouter from './src/routes/user.js';

const PORT = process.env.PORT || 8080;

let app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Test!');
});

app.use('/auth', authRouter);
app.use('/user', userRouter);

app.listen(PORT, () => {
    console.log(`Backend listening on port ${PORT}`);
});