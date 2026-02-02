import express from 'express'
import cors from 'cors'

const PORT = 8080;

let app = express();
app.use(cors());

app.get('/', (req, res) => {
    res.send('Test!');
})

app.listen(8080, () => {
    console.log(`Backend listening on port ${PORT}`);
})