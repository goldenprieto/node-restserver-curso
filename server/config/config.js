//==============================================================
//                          PORT
//==============================================================
process.env.PORT= process.env.PORT ||3000;


//==============================================================
//                          ENTRONO
//==============================================================

process.env.NODE_ENV =  process.env.NODE_ENV || 'dev'; 

//===========================================================
//                          DATA BASE
//==============================================================

let urlDB 
if(process.env.NODE_ENV === 'dev'){
    urlDB = 'mongodb://localhost:27017/cafe';
}else{
    urlDB= 'mongodb+srv://golden:EpWxdmFjAZiSfraV@cluster0.i9y1r.mongodb.net/cafe';
}

process.env.URLDB = urlDB;

//==============================================================
//                  Vencimiento  del token 
//==============================================================
// 60 segundos
// 60 minutos
// 24 horas 
// 30 dias 
 process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

//==============================================================
//              SEED de autencidad o semilla del TOKEN 
//==============================================================

process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

//==============================================================
//              Google client ID
//==============================================================

process.env.CLIENT_ID = process.env.CLIENT_ID || '934412797672-p2jequtf32ic39ghr9r4p3lpmba3efuc.apps.googleusercontent.com';