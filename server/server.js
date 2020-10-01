require('./config/config.js');

const express = require('express');
const app = express();
//const { request } = require('express');
 const path = require('path');
const colors = require('colors');

// Llamando a mongoose
const mongoose = require('mongoose');

// llamando a body parser
const  bodyParser = require('body-parser');

// parse aplication/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false }))
// parse aplication/json
app.use(bodyParser.json());

// habilitar la carpetapublica
app.use( express.static(path.resolve( __dirname,'../public')));

// Configuracion Global de rutas 
app.use(require('./routes/index.js'));



mongoose.connect(process.env.URLDB,
    {   useNewUrlParser: true , useCreateIndex : true   },
    (err ,res)=>{
    if( err )  throw err;
    console.log('Base de datos MONGO Status:'.blue,'ONLINE'.green);
});

app.listen(process.env.PORT,()=>{
    console.log(`Server Escuchando en el puerto: `.blue,`${process.env.PORT}`.green);
});