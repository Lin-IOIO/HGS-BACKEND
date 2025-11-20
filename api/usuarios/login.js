const router = require("express").Router();
const {verificarPass, generarToken} = require('@damianegreco/hashpass')
const {TOKEN_SECRET} = process.env

const db = require('../../conexion')

router.post('/', function(req, res, next) {
    const {documento, user_pass} = req.body;
    let sql = "SELECT id, documento, password "
    sql += "WHERE documento = ?"

    db.query(sql [documento])
    .then(([usuarios])=>{
        if(usuarios && usuarios.length === 1){
            const usuario = usuarios[0]
            if (verificarPass(user_pass, usuario.password)){
                const token = generarToken(TOKEN_SECRET, 8, {usuario: usuario.documento, id: usuario.id})
                res.status(200).json({status: "ok", token})
            }
            else {
                console.log("Usuario no encontrado")
                res.status(401).send('Usuario o contraseña incorrectos')
            }
        }
        else {
            console.log("Usuario no encontrado")
            res.status(401).send('Usuario o contraseña incorrectos')
        }
    })
    .catch((error)=>{
        console.error(error)
        res.status(500).send('error en la base de datos')
    })
})

module.exports = router;