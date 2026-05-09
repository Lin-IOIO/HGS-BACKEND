const router = require("express").Router();
const {verificarPass, generarToken} = require('@damianegreco/hashpass')
const {TOKEN_SECRET} = process.env

const db = require('../../conexion')

router.post('/', function(req, res, next) {
    const {DNI, contrasena} = req.body;
    console.log(req.body)
    let sql = `
        SELECT u.id, u.DNI, u.nombre, u.apellido, u.contrasena, r.nombre AS rol
        FROM usuarios u
        JOIN roles r ON r.id = u.id_rol
        WHERE u.DNI = ?
    `;

    db.query(sql, [DNI])
    .then(([usuarios])=>{
        if(usuarios && usuarios.length === 1){
            const usuario = usuarios[0]
            if (verificarPass(contrasena, usuario.contrasena)){
                const token = generarToken(TOKEN_SECRET, 8, {id:usuario.id, usuario:usuario.nombre+" "+usuario.apellido, rol:usuario.rol})
                res.status(200).json({status: "ok", token})
            }
            else {
                console.log("Usuario no encontrado ", verificarPass(contrasena, usuario.contrasena))
                res.status(401).send('Usuario o contraseña incorrectos 2')
            }
        }
        else {
            console.log("Usuario no encontrado")
            console.log(usuarios)
            res.status(401).send('Usuario o contraseña incorrectos 1')
        }
    })
    .catch((error)=>{
        console.error(error)
        res.status(500).send('error en la base de datos')
    })
})

module.exports = router;
