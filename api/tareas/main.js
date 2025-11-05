const router = require('express').Router();
const db = require('../../conexion')

router.get("/", function(req, res, next) {
    const { busqueda } = req.query;
    
    let busquedaParcial = busqueda;

    let sql = "SELECT * FROM tareas";

    if (busqueda) {
        sql += " WHERE titulo like ?"
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
    const {titulo, consignas, fecha_inicio, fecha_fin, creado_por_id_profesor, pertenece_a_id_materia} = req.body;

    let sql = "INSERT INTO tareas (titulo, consignas, fecha_inicio, fecha_fin, creado_por_id_profesor, pertenece_a_id_materia)";
    sql+= " VALUES (?, ?, ?, ?, ?, ?)";

    db.query(sql, [titulo, consignas, fecha_inicio, fecha_fin, creado_por_id_profesor, pertenece_a_id_materia])
    .then(()=> {
        res.status(201).send("Guardado");
    })
    .catch((error)=> {
        console.error(error);
        res.status(500).send("ocurrió un error");
    })
})

router.delete ("/:tarea_id", function (req, res, next) {
    const {tarea_id} = req.params;
    const sql = "DELETE FROM tareas WHERE id = ?"
    db.query(sql, [tarea_id])
    .then(()=>{
        res.status(200).send("eliminado");
    })
    .catch((error)=>{
        console.error(error);
        res.status(500).send("ocurrió un error")
    })
})

router.put ("/:tarea_id", function(req, res, next) {
    const {tarea_id} = req.params;
    const {titulo, consignas, fecha_inicio, fecha_fin} = req.body;
    const sql = "UPDATE tareas SET titulo = ?, consignas = ?, fecha_inicio = ?, fecha_fin = ? WHERE id = ?"
    db.query(sql, [titulo, consignas, fecha_inicio, fecha_fin, tarea_id])
    .then(()=>{
        res.status(200).send("actualizado")
    })
    .catch((error)=>{
        console.error(error)
        res.status(500).send("ocurrió un error")
    })
})

module.exports = router;