const router = require('express').Router();

const usuariosRouter = require('./usuarios/main')

function validarUsuario (req, res, next) {
    console.log('pasó por middleware');
    next();
}

router.use('/usuarios', validarUsuario, usuariosRouter)

router.get('/', function (req, res, next) {
    res.send('Archivo principal de API')
})

module.exports = router;