const router = require('express').Router();

const usuariosRouter = require('./usuarios/main')
const tareasRouter = require('./tareas/main')
const planesRouter = require('./planes_de_estudio/main')
const materiasRouter = require('./materias_unicas_por_curso/main')
const cursosRouter = require('./cursos/main')
const turnosRouter = require('./turnos/main')

function validarUsuario (req, res, next) {
    console.log('pasó por middleware');
    next();
}



router.use('/usuarios', validarUsuario, usuariosRouter)

router.use('/tareas', validarUsuario, tareasRouter)

router.use('/planes', validarUsuario, planesRouter)

router.use('/materias', validarUsuario, materiasRouter)

router.use('/cursos', validarUsuario, cursosRouter)

router.use('/turnos', validarUsuario, turnosRouter)



router.get('/', function (req, res, next) {
    res.send('Archivo principal de API')
})

module.exports = router;