const router = require('express').Router();
const validarUsuario = require('./middleware')
const verificacionRoles = require('./verificarRoles')

const usuariosRouter = require('./usuarios/main')
const planesRouter = require('./planes_de_estudio/main')
const materiasRouter = require('./materias_unicas_por_curso/main')
const materiasCatalogoRouter = require("./materias/main")
const cursosRouter = require('./cursos/main')
const loginRouter = require("./usuarios/login")





router.use('/login', loginRouter)

router.use('/usuarios', validarUsuario, verificacionRoles(["admin"]), usuariosRouter)

router.use('/planes', validarUsuario, verificacionRoles(["admin", "profesor", "coordinador"]), planesRouter)

router.use('/curso-materias', validarUsuario, verificacionRoles(["admin", "profesor", "coordinador"]), materiasRouter)
router.use('/materias', validarUsuario, verificacionRoles(["admin", "profesor", "coordinador"]), materiasCatalogoRouter)

router.use('/cursos', validarUsuario, verificacionRoles(["admin", "profesor", "coordinador"]), cursosRouter)

// Endpoints heredados (tareas/turnos) quedaron fuera porque no existen en la nueva BD.

router.get('/', function (req, res, next) {
    res.send('Archivo principal de API')
})

module.exports = router;
