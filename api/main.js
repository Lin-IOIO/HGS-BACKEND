const router = require('express').Router();
const validarUsuario = require('./middleware')
const verificacionRoles = require('./verificarRoles')

const usuariosRouter = require('./usuarios/main')
const tareasRouter = require('./tareas/main')
const planesRouter = require('./planes_de_estudio/main')
const materiasRouter = require('./materias_unicas_por_curso/main')
const cursosRouter = require('./cursos/main')
const turnosRouter = require('./turnos/main')
const loginRouter = require("./usuarios/login")
const asignaturasRouter = require("./asignaturas/main")





router.use('/login', loginRouter)

router.use('/usuarios', validarUsuario, verificacionRoles(["admin"]), usuariosRouter)

router.use('/tareas', validarUsuario, verificacionRoles(["admin", "profesor"]), tareasRouter)

router.use('/planes', validarUsuario, verificacionRoles(["admin", "profesor", "coordinador"]), planesRouter)

router.use('/materias', validarUsuario, verificacionRoles(["admin", "profesor", "coordinador"]), materiasRouter)

router.use('/cursos', validarUsuario, verificacionRoles(["admin", "profesor", "coordinador"]), cursosRouter)

router.use('/turnos', validarUsuario, verificacionRoles(["admin", "profesor", "coordinador"]), turnosRouter)

router.use('/asignaturas', validarUsuario, verificacionRoles(["admin", "profesor", "coordinador"]), asignaturasRouter)



router.get('/', function (req, res, next) {
    res.send('Archivo principal de API')
})

module.exports = router;