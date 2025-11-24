const router = require("express").Router();
const {verificarPass, generarToken} = require('@damianegreco/hashpass')
const {TOKEN_SECRET} = process.env

const db = require('../../conexion')

router.post('/', function(req, res, next) {
    const {documento, password} = req.body;
    let sql = "SELECT * FROM usuarios "
    sql += "WHERE documento = ?"

    db.query(sql, [documento])
    .then(([usuarios])=>{
        if(usuarios && usuarios.length === 1){
            const usuario = usuarios[0]
            if (verificarPass(password, usuario.password)){
                const token = generarToken(TOKEN_SECRET, 8, {id:usuario.id, usuario:usuario.nombre+" "+usuario.apellido, rol:usuario.rol})
                res.status(200).json({status: "ok", token})
            }
            else {
                console.log("Usuario no encontrado ", verificarPass(password, usuario.password))
                res.status(401).send('Usuario o contraseña incorrectos 2')
            }
        }
        else {
            console.log("Usuario no encontrado")
            res.status(401).send('Usuario o contraseña incorrectos 1')
        }
    })
    .catch((error)=>{
        console.error(error)
        res.status(500).send('error en la base de datos')
    })
})

module.exports = router;