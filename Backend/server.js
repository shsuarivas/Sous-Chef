import express from 'express'
import cors from 'cors'

const PORT = 8080;

let app = express();
app.use(cors());

app.get('/', (req, res) => {
    res.send('Test!');
});

app.get('/recipes', (req, res) => {
    res.send(JSON.stringify({
        recipes: [
            'Thing 1',
            'Thing 2',
            'Thing 3',
        ]
    }));
});

app.listen(8080, () => {
    console.log(`Backend listening on port ${PORT}`);
});