const jwt = require('jsonwebtoken');
// =====================================================
//       verificar token
//======================================================

let verificarToken = (req ,res , next) => {

    let token = req.get('token');
    
    jwt.verify(token , process.env.SEED, (err, decoded ) => {
        if( err ){
            return res.status(401).json({
                ok : false,
                message: 'Token invalido '
            });
        }
        req.usuario = decoded.usuario;
        next();
    });  
};

// =====================================================
//       verificar  AdminRole
//======================================================
let verificarAdmin_Role = ( req , res ,next) => {

    let usuario = req.usuario;

    if(usuario.role === 'ADMIN_ROLE'){
        next();
    }else {
        return res.status(401).json({
            ok : false,
            message : "Su rol no tiene permisos para esta accion "
        });
    }
   
};

module.exports = {
    verificarToken,
    verificarAdmin_Role
}