const express = require('express');
const Producto  = require('../models/producto.js');
const _ = require('underscore');

const app =express();
const { verificarToken } = require('../middlewares/autenticacion.js');


//=========================================================================
//                         LISTAR TODOS LOS PRODUCTOS 
//=========================================================================

app.get('/producto',(req , res ) => {

    let desde = req.query.desde || 0;
    desde = Number (desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);
    Producto.find({disponible : true },/*'nombre descripcion estado'*/) 
    
            .limit(limite)
            .skip(desde)
            .populate('usuario','nombre email')
            .populate('categoria','nombre')
            .exec((err, producto)=>{
                if(err){
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }
                Producto.count({ disponible : true }, (err,conteo) => {

                    res.json({
                        ok:true,
                        producto,
                        cuantos : conteo
                    })
                })
               
            })
});

//=========================================================================
//                         LISTAR UN PRODUCTO POR ID 
//=========================================================================

app.get('/producto/:id',(req ,res ) => {
    let id =  req.params.id;

    Producto.findById(id,(err ,  post )=>{
        if(!err){
            let productoDB = post;
            return res.json({
                    ok          : true,
                    categoria   : productoDB
                    });
        }else{
            return res,status(400).json({
                ok      : false,
                err
            });
        }
    });
});

//=========================================================================
//                     BUSCAR PRODUCTOS POR SU NOMBRE
//=========================================================================

app.get('/producto/buscar/:termino',verificarToken,(req , res )=>{
    let termino = req.params.termino;

    let regex = new RegExp(termino,'i');

    Producto.find({ nombre  : regex })
        .populate('categoria','nombre')
        .exec((err,producto )=>{
            if(err){
                res.status(500).json({
                    ok  :   true,
                    err
                });
            }
            res.status(200).json({
                ok  :   true,
                producto
            });
        })
});

//=========================================================================
//                         REGISTRAR UN PRODUCTO
//=========================================================================

app.post('/producto',verificarToken,(req ,res ) => {
    let body = req.body;

    let producto = new Producto({
        nombre      :   body.nombre,
        precioUni   :   body.precio,
        descripcion :   body.descripcion,
        categoria   :   body.categoria,
        usuario     :   req.usuario._id

    });
    producto.save((err,productoDB)=>{
        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }
        res.status(201).json({
            ok : true,
            usuario : productoDB
        });
    });
});

//=========================================================================
//                         ACTUALIZAR UN PRODUCTO 
//=========================================================================

app.put('/producto/:id',[verificarToken],( req , res ) =>{
    let id =  req.params.id;
    
    let body = _.pick(req.body,'nombre','precioUni');


    Producto.findByIdAndUpdate(id,body,{new: true ,runValidators:true },(err,productoDB)=>{
        if(err){
            return res.status(400).json({
                ok: false,
                message:{
                    id , 
                    err : 'error en cat',
                    body
                }
            });
        }
        res.json({
            ok: true,
            producto : productoDB
        });
    })

});


//=========================================================================
//              BORRAR UN PRODUCTO LOGICAMENTE (disponible : false)
//=========================================================================

app.delete('/producto/:id',verificarToken, (req , res ) =>{
    let id = req.params.id
        let cambiaEstado = {
            disponible: false
        } 
    Producto.findByIdAndUpdate(id,cambiaEstado,{new : true},(err,productoDB) => {
        if(err){
            return res.status(400).json({
                    ok: false,
                    err
            });
        }
        res.json({
            ok          :   true,
            producto    :   productoDB
        });
    })
});



module.exports = app;