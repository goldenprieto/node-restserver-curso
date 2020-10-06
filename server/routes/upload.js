const express = require('express');
const fileUpload = require('express-fileupload');
const { Schema } = require('mongoose');
const { constant } = require('underscore');
const app = express();

const fs = require('fs');
const path = require('path'); 

const Usuario =  require('../models/usuario');
const Producto = require('../models/producto');

 // default  options

 app.use(fileUpload({ useTempFiles: true }));

 app.put('/upload/:tipo/:id', (req , res  ) => {

    let tipo    =   req.params.tipo;
    let id      =   req.params.id;

    if (!req.files){
        return res.status(400).json({
            ok  :   true,
            message : 'No se a selecciona nigun archivo'
        });
    }

//==============================================================
//                      VALIDAR TIPO
//==============================================================

let tiposValidado =  ['productos','usuarios'];
if(tiposValidado.indexOf(tipo) < 0){
    return res.status(400).json({
        ok  :   false,
        err :   {
                message : `los tipos permitidos son ${tiposValidado}`,
                tipo
        }
    })
}

//==============================================================
//              VALIDAR EXTENCIONES DE LOS ARCHIVOS
//==============================================================

    let archivo = req.files.archivo;
    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length -1];


    //          Extensiones  permitidas 
    let extensionesValidas = ['png','jpg','gif','jpeg']

    if(extensionesValidas.indexOf(extension) < 0 ){
        return res.status(400).json({
            ok  :   false,
            err: {
                message : `las extenciones  permitidas son : ${extensionesValidas}`,
                ext : extension
            }
        });
    }
//==============================================================
//               CAMBIAR LOS NOMBRES A LOS ARCHIVOS 
//==============================================================
let nombreArchivo = `${id}-${ new Date().getMilliseconds() }.${extension}`


//==============================================================
//                   GUARDAR LOS ARCHIVOS 
//==============================================================
    archivo.mv( `uploads/${tipo}/${nombreArchivo}`, (err)=> {
        if (err)
          return res.status(500).json({
                ok  : false,
                err
          });
    

        //  carga de los archivos
          if(tipo == 'usuarios'){
            imagenUsuario(id,res,nombreArchivo);
          }else{
            imagenProducto(id,res,nombreArchivo);
          }
       
      });

 });

function imagenUsuario( id ,res, nombreArchivo){
    Usuario.findById(id,(err, usuarioBD) => {
        if(err){
            borraArchivo(nombreArchivo.img,'usuarios');//busca  y elimina el archivo
            return res.status(500).json({
                ok  :   false,
                err :   {
                    message: 'Problemas al buscar la busqueda',
                    err
                }
            });
        }
        if(!usuarioBD){
            borraArchivo(nombreArchivo.img,'usuarios');//busca  y elimina el archivo
            return res.status(400).json({
                ok  : false,
                err : {
                    message : 'Usuario No Existe ',
                    err
                }
            });
        }
        // busca si existe el path  que tenemos
        
        borraArchivo(usuarioBD.img,'usuarios');

        usuarioBD.img = nombreArchivo;
        usuarioBD.save((err,usuarioGuardado) => {
            res.json({
                ok      : true,
                usuario : usuarioGuardado,
                img     : nombreArchivo
            });
        });

    });
}

function imagenProducto(id ,res, nombreArchivo){
    Producto.findById(id,(err, productoBD) => {
        if(err){
            borraArchivo(nombreArchivo.img,'productos');//busca  y elimina el archivo
            return res.status(500).json({
                ok  :   false,
                err :   {
                    message: 'Problemas al buscar la busqueda',
                    err
                }
            });
        }
        if(!productoBD){
            borraArchivo(nombreArchivo.img,'productos');//busca  y elimina el archivo
            return res.status(400).json({
                ok  : false,
                err : {
                    message : 'Producto No Existe ',
                    err
                }
            });
        }
        // busca si existe el path  que tenemos
        
        borraArchivo(productoBD.img,'productos');

        productoBD.img = nombreArchivo;
        productoBD.save((err,productoGuardado) => {
            res.json({
                ok       : true,
                producto : productoGuardado,
                img      : nombreArchivo
            });
        });

    });
    
}


function borraArchivo(nombreImagen,tipo){
    let pathImagen = path.resolve(__dirname,`../../uploads/${tipo}/${nombreImagen}`);
        if(fs.existsSync(pathImagen)){
            fs.unlinkSync(pathImagen);
        }
}

 module.exports = app;