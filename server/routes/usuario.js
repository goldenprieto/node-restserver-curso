const express = require('express');
const Usuario  = require('../models/usuario.js');

const app =express();

const bcrypt = require('bcrypt');
const _ = require('underscore');

const { verificarToken ,verificarAdmin_Role } = require('../middlewares/autenticacion.js');

app.get('/usuario',(req, res)=>{
    
    let desde = req.query.desde || 0;
    desde = Number (desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);
    Usuario.find({/* estado : true */},'nombre email role estado google img') 
    // se puede  hacer filtraciones a los campos de del json
            .limit(limite)
            .skip(desde)
            .exec((err, usuarios)=>{
                if(err){
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }
                Usuario.count({ /*estado : true */}, (err,conteo) => {

                    res.json({
                        ok:true,
                        usuarios,
                        cuantos : conteo
                    })
                })
               
            })
});

app.post('/usuario',[verificarToken, verificarAdmin_Role],(req, res)=>{
    let body = req.body;

    let usuario = new Usuario({
        nombre      : body.nombre,
        email       : body.email,
        password    : bcrypt.hashSync(body.password,10),
        role        : body.role
    });
    usuario.save((err,usuarioDB)=>{
        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok : true,
            usuario : usuarioDB
        });
    });
});

app.put('/usuario/:id',[verificarToken, verificarAdmin_Role],(req, res)=>{
    let id =  req.params.id;
    let body = _.pick(req.body,['nombre','email','img','role','estado']);
    

    Usuario.findByIdAndUpdate(id,body,{new: true,runValidators:true },(err,usuarioDB)=>{
        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            usuario : usuarioDB
        });
    })

   
});

app.delete('/usuario/:id',[verificarToken, verificarAdmin_Role],(req,res) => {
        let id = req.params.id
        let cambiaEstado = {
            estado: false
        } 
        Usuario.findByIdAndUpdate(id,cambiaEstado,{new : true},(err,usuarioDB) => {
            if(err){
                return res.status(400).json({
                        ok: false,
                        err
                });
            }
            res.json({
                ok:true,
                usuario: usuarioDB
            });
        })
        
})
// app.delete('/usuario/:id',(req, res)=>{
   
//     let id = req.params.id;
//     Usuario.findByIdAndRemove(id,(err,usuaioBorrado) =>{
//         if(err){
//             return res.status(400).json({
//                 ok : false,
//                 err,
//                 mensaje : `Error al borrar el usuario  ${err}`
//             });
//         };
//         if( !usuaioBorrado ){
//             return res.status(400).json({
//                 ok : false,
//                 err:{
//                     message:'Usuario No encontrado'
//                 }
//             });
//         };
//         res.json({
//             of : true,
//             usuario : usuaioBorrado
//            // message : `Eliminacion Correcta `
//         })
//     })

// });


module.exports= app;