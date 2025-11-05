const router = require('express').Router();
const db = require('../../conexion')

router.get("/", function(req, res, next) {
    const { busqueda } = req.query;
    
    let busquedaParcial = busqueda;

    let sql = "SELECT * FROM cursos";

    if (busqueda) {
        sql += " WHERE año like ?"
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
    const {año, division, creado_por_id_admin} = req.body;

    let sql = "INSERT INTO cursos (año, division, creado_por_id_admin)";
    sql+= " VALUES (?, ?, ?)";

    db.query(sql, [año, division, creado_por_id_admin])
    .then(()=> {
        res.status(201).send("Guardado");
    })
    .catch((error)=> {
        console.error(error);
        res.status(500).send("ocurrió un error");
    })
})

router.delete ("/:curso_id", function (req, res, next) {
    const {curso_id} = req.params;
    const sql = "DELETE FROM curso WHERE id = ?"
    db.query(sql, [curso_id])
    .then(()=>{
        res.status(200).send("eliminado");
    })
    .catch((error)=>{
        console.error(error);
        res.status(500).send("ocurrió un error")
    })
})

router.put ("/:curso_id", function(req, res, next) {
    const {curso_id} = req.params;
    const {año, division, creado_por_id_admin} = req.body;
    const sql = "UPDATE cursos SET año = ?, division = ?, creado_por_id_admin = ? WHERE id = ?"
    db.query(sql, [año, division, creado_por_id_admin, curso_id])
    .then(()=>{
        res.status(200).send("actualizado")
    })
    .catch((error)=>{
        console.error(error)
        res.status(500).send("ocurrió un error")
    })
})

module.exports = router;