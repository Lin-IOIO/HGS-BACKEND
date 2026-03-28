const router = require('express').Router();
const db = require('../../conexion')

router.get("/", function(req, res, next) {
    const { busqueda } = req.query;
    
    let busquedaParcial = busqueda;

    let sql = `
        SELECT p.id, p.id_curso_materia, p.id_coordinador, p.link_descarga, p.fecha_carga,
               m.nombre AS materia_nombre,
               CONCAT(c.anio, '�- ', c.division, '�') AS curso_nombre,
               c.turno AS turno
        FROM planes_estudio p
        JOIN curso_materia cm ON cm.id = p.id_curso_materia
        JOIN materia m ON m.id = cm.id_materia
        JOIN curso c ON c.id = cm.id_curso
    `;

    if (busqueda) {
        sql += " WHERE p.id_coordinador like ?"
        busquedaParcial = `%${busqueda}%`
    }

    db.query(sql, [busquedaParcial])
    .then (([respuesta])=> {
        res.json(respuesta)
    })
    .catch((error)=> {
        console.error(error);
        res.status(500).send("ocurri처 un error")
    })
})

router.post("/", function (req, res, next) {
    const {id_curso_materia, id_coordinador, link_descarga, fecha_carga} = req.body;

    let sql = "INSERT INTO planes_estudio (id_curso_materia, id_coordinador, link_descarga, fecha_carga)";
    sql+= " VALUES (?, ?, ?, ?)";

    db.query(sql, [id_curso_materia, id_coordinador, link_descarga, fecha_carga])
    .then(()=> {
        res.status(201).send("Guardado");
    })
    .catch((error)=> {
        console.error(error);
        res.status(500).send("ocurri처 un error");
    })
})

router.delete ("/:plan_id", function (req, res, next) {
    const {plan_id} = req.params;
    const sql = "DELETE FROM planes_estudio WHERE id = ?"
    db.query(sql, [plan_id])
    .then(()=>{
        res.status(200).send("eliminado");
    })
    .catch((error)=>{
        console.error(error);
        res.status(500).send("ocurri처 un error")
    })
})

router.put ("/:plan_id", function(req, res, next) {
    const {plan_id} = req.params;
    const {id_curso_materia, id_coordinador, link_descarga, fecha_carga} = req.body;
    const sql = "UPDATE planes_estudio SET id_curso_materia = ?, id_coordinador = ?, link_descarga = ?, fecha_carga = ? WHERE id = ?"
    db.query(sql, [id_curso_materia, id_coordinador, link_descarga, fecha_carga, plan_id])
    .then(()=>{
        res.status(200).send("actualizado")
    })
    .catch((error)=>{
        console.error(error)
        res.status(500).send("ocurri처 un error")
    })
})

module.exports = router;
