require('./config/config.js');
const express = require('express');
const colors = require('colors');

const app = express();
// const port = 

app.get('/usuario',(req, res)=>{
    res.json('Hola Mundo');
});

app.post('/usuario',(req, res)=>{
    res.json('Hola post');
});

app.put('/usuario',(req, res)=>{
    res.json('Hola put');
});

app.delete('/usuario',(req, res)=>{
    res.json('Hola deltete');
});

app.listen(process.env.PORT,()=>{
    console.log(`Escuchando el puerto ${process.env.PORT}`.blue);
});