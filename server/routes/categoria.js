const express = require('express');
const Categoria  = require('../models/categoria.js');
const _ = require('underscore');

const app =express();

const { verificarToken,verificarAdmin_Role } = require('../middlewares/autenticacion.js');

//=========================================================================
//                         LISTA TODAS LAS CATEGORIAS 
//=========================================================================
app.get('/categoria',(req , res )=>{
    let desde = req.query.desde || 0;
    desde = Number (desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);
    Categoria.find({/* estado : true */},'nombre descripcion estado') 
    // se puede  hacer filtraciones a los campos de del json
            .limit(limite)
            .skip(desde)
            .exec((err, categoria)=>{
                if(err){
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }
                Categoria.count({ /*estado : true */}, (err,conteo) => {

                    res.json({
                        ok:true,
                        categoria,
                        cuantos : conteo
                    })
                })
               
            })
});

//=========================================================================
//                         LISTA UNA CATEGORIA POR SU ID 
//=========================================================================
app.get('/categoria/:id',(req , res) => {
    let id =  req.params.id;

    Categoria.findById(id,(err ,  post )=>{
        if(!err){
            let categoriaDB = post;
            return res.json({
                    ok          : true,
                    categoria   : categoriaDB
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
//                              CREA CATEGORIA 
//=========================================================================
app.post('/categoria',[verificarToken],(req, res)=>{
    let body = req.body;

    let categoria = new Categoria({
        nombre          : body.nombre,
        descripcion     : req.usuario._id
    });
    categoria.save((err,categoriaDB)=>{
        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok : true,
            usuario : categoriaDB
        });
    });
});

//=========================================================================
//                         MODIFICA UNA CATEGORIA
//=========================================================================

app.put('/categoria/:id',[verificarToken],(req , res )=>{
    let id =  req.params.id;
    let body = _.pick(req.body,['nombre','descripcion']);
    

    Categoria.findByIdAndUpdate(id,body,{new: true },(err,categoriaDB)=>{
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
            categoria : categoriaDB
        });
    })

});

//=========================================================================
//    ELIMINA  UNA CATEGORIA  DE MANERA FISICA (Se borra de DB)
//=========================================================================
app.delete('/categoria/:id',[verificarToken,verificarAdmin_Role],(req ,res ) =>{

    let id = req.params.id;
    Categoria.findByIdAndRemove(id,(err,categoriaBorrado) =>{
        if(err){
            return res.status(400).json({
                ok : false,
                err,
                mensaje : `Error al borrar el Categoria  ${err}`
            });
        };
        if( !categoriaBorrado ){
            return res.status(400).json({
                ok : false,
                err:{
                    message:'Usuario No encontrado'
                }
            });
        };
        res.json({
            of : true,
            usuario : categoriaBorrado,
            message : `Eliminacion Correcta `
        })
    })
});

//=========================================================================
//    ELIMINA  UNA CATEGORIA  DE MANERA LOGICA (Cambia de estado a False)
//=========================================================================
// app.delete('/categoria/:id',verificarToken,(req,res) => {
//     let id = req.params.id
//     let cambiaEstado = {
//         estado: false
//     } 
//     Categoria.findByIdAndUpdate(id,cambiaEstado,{new : true},(err,categoriaDB) => {
//         if(err){
//             return res.status(400).json({
//                     ok: false,
//                     err
//             });
//         }
//         res.json({
//             ok:true,
//             categoria: categoriaDB
//         });
//     })
    
// });



module.exports = app;