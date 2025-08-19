import express from 'express';
const app = express();
const port = 3000;

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', (req, res) => {
    res.sendFile(process.cwd() + '/views/index.html');
})

app.listen(port, () => {
    console.log(`Server running on port${port}`);
})