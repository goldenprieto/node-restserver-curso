const express = require('express');
const path = require('path');
const { verificarTokenImg } = require('../middlewares/autenticacion.js');

const fs = require('fs');


let  app = express();


app.get('/imagen/:tipo/:img',verificarTokenImg,(req , res) =>{

    let tipo = req.params.tipo;
    let img = req.params.img;

    let pathImagen = path.resolve(__dirname,`../../uploads/${tipo}/${img}`);
    let noImagePath = path.resolve(__dirname,'../assets/no-image.jpg');

    if(fs.existsSync(pathImagen)){
        res.sendFile(pathImagen)
    }else{
    res.sendFile(noImagePath)
    }
});





module.exports = app;