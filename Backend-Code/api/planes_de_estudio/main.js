const router = require('express').Router();
const db = require('../../conexion')

router.get("/", function(req, res, next) {
    const { busqueda } = req.query;
    
    let busquedaParcial = busqueda;

    let sql = "SELECT * FROM planes_de_estudio";

    if (busqueda) {
        sql += " WHERE creado_por_id_coordinador like ?"
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
    const {archivo, creado_por_id_coordinador} = req.body;

    let sql = "INSERT INTO planes_de_estudio (archivo, creado_por_id_coordinador)";
    sql+= " VALUES (?, ?)";

    db.query(sql, [archivo, creado_por_id_coordinador])
    .then(()=> {
        res.status(201).send("Guardado");
    })
    .catch((error)=> {
        console.error(error);
        res.status(500).send("ocurrió un error");
    })
})

router.delete ("/:plan_id", function (req, res, next) {
    const {plan_id} = req.params;
    const sql = "DELETE FROM planes_de_estudio WHERE id = ?"
    db.query(sql, [plan_id])
    .then(()=>{
        res.status(200).send("eliminado");
    })
    .catch((error)=>{
        console.error(error);
        res.status(500).send("ocurrió un error")
    })
})

router.put ("/:plan_id", function(req, res, next) {
    const {plan_id} = req.params;
    const {archivo, creado_por_id_coordinador} = req.body;
    const sql = "UPDATE tareas SET archivo = ?, creado_por_id_coordinador = ? WHERE id = ?"
    db.query(sql, [archivo, creado_por_id_coordinador, plan_id])
    .then(()=>{
        res.status(200).send("actualizado")
    })
    .catch((error)=>{
        console.error(error)
        res.status(500).send("ocurrió un error")
    })
})

module.exports = router;