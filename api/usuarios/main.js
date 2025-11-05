const router = require('express').Router();
const db = require('../../conexion')

router.get("/", function(req, res, next) {
    const { busqueda } = req.query;
    
    let busquedaParcial = busqueda;

    let sql = "SELECT * FROM usuarios";

    if (busqueda) {
        sql += " WHERE nombre like ?"
        busquedaParcial = `%${busqueda}%`
    }

    db.query(sql, [busquedaParcial])
    .then (([respuesta])=> {
        res.json({respuesta})
    })
    .catch((error)=> {
        console.error(error);
        res.status(500).send("ocurrió un error")
    })
})

router.post("/", function (req, res, next) {
    const {documento, nombre, apellido, correo, password, rol} = req.body;

    let sql = "INSERT INTO usuarios (documento, nombre, apellido, correo, password, rol)";
    sql+= " VALUES (?, ?, ?, ?, ?, ?)";

    db.query(sql, [documento, nombre, apellido, correo, password, rol])
    .then(()=> {
        res.status(201).send("Guardado");
    })
    .catch((error)=> {
        console.error(error);
        res.status(500).send("ocurrió un error");
    })
})

router.delete ("/:usuario_id", function (req, res, next) {
    const {usuario_id} = req.params;
    const sql = "DELETE FROM usuarios WHERE id = ?"
    db.query(sql, [usuario_id])
    .then(()=>{
        res.status(200).send("eliminado");
    })
    .catch((error)=>{
        console.error(error);
        res.status(500).send("ocurrió un error")
    })
})

router.put ("/:usuario_id", function(req, res, next) {
    const {usuario_id} = req.params;
    const {documento, nombre, apellido, correo, password, rol} = req.body;
    const sql = "UPDATE usuarios SET documento = ?, nombre = ?, apellido = ?, correo = ?, password = ?, rol = ? WHERE id = ?"
    db.query(sql, [documento, nombre, apellido, correo, password, rol, usuario_id])
    .then(()=>{
        res.status(200).send("actualizado")
    })
    .catch((error)=>{
        console.error(error)
        res.status(500).send("ocurrió un error")
    })
})

module.exports = router;