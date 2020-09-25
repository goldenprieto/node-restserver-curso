require('./config/config.js');

const express = require('express');
const app = express();
//const { request } = require('express');

const colors = require('colors');

// Llamando a mongoose
const mongoose = require('mongoose');

// llamando a body parser
const  bodyParser = require('body-parser');

// parse aplication/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false }))
// parse aplication/json
app.use(bodyParser.json());

// Routing 
app.use(require('./routes/usuario.js'));



mongoose.connect(process.env.URLDB,
    {   useNewUrlParser: true , useCreateIndex : true   },
    (err ,res)=>{
    if( err )  throw err;
    console.log('Base de datos ONLINE'.green);
});

app.listen(process.env.PORT,()=>{
    console.log(`Escuchando el puerto ${process.env.PORT}`.blue);
});