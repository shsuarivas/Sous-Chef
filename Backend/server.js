import express from 'express'

const PORT = 8080;

let app = express();
app.get('/', (req, res) => {
    res.send('Test!');
})

app.listen(8080, () => {
    console.log(`Backend listening on port ${PORT}`);
})