const router = require('express').Router();
const db = require('../../conexion')

router.get("/", function(req, res, next) {
    const { busqueda } = req.query;
    
    let busquedaParcial = busqueda;

    let sql = "SELECT * FROM materia";

    if (busqueda) {
        sql += " WHERE nombre like ?"
        busquedaParcial = `%${busqueda}%`
    }

    db.query(sql, [busquedaParcial])
    .then (([respuesta])=> {
        res.json(respuesta)
    })
    .catch((error)=> {
        console.error(error);
        res.status(500).send("ocurrió un error")
    })
})

router.post("/", function (req, res, next) {
    const {nombre} = req.body;

    let sql = "INSERT INTO materia (nombre)";
    sql+= " VALUES (?)";

    db.query(sql, [nombre])
    .then(()=> {
        res.status(201).send("Guardado");
    })
    .catch((error)=> {
        console.error(error);
        res.status(500).send("ocurrió un error");
    })
})

router.delete ("/:materia_id", function (req, res, next) {
    const {materia_id} = req.params;
    const sql = "DELETE FROM materia WHERE id = ?"
    db.query(sql, [materia_id])
    .then(()=>{
        res.status(200).send("eliminado");
    })
    .catch((error)=>{
        console.error(error);
        res.status(500).send("ocurrió un error")
    })
})

router.put ("/:materia_id", function(req, res, next) {
    const {materia_id} = req.params;
    const {nombre} = req.body;
    const sql = "UPDATE materia SET nombre = ? WHERE id = ?"
    db.query(sql, [nombre, materia_id])
    .then(()=>{
        res.status(200).send("actualizado")
    })
    .catch((error)=>{
        console.error(error)
        res.status(500).send("ocurrió un error")
    })
})

module.exports = router;
