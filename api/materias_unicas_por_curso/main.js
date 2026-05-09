const router = require('express').Router();
const db = require('../../conexion')

router.get("/", function(req, res, next) {
    const { busqueda } = req.query;
    
    let busquedaParcial = busqueda;

    let sql = `
        SELECT cm.id, cm.id_curso, cm.id_materia, cm.id_profesor,
               m.nombre AS materia_nombre,
               CONCAT(c.anio, '° ', c.division) AS curso_nombre,
               c.turno AS turno
        FROM curso_materia cm
        JOIN materia m ON m.id = cm.id_materia
        JOIN curso c ON c.id = cm.id_curso
    `;

    if (busqueda) {
        sql += " WHERE m.nombre like ?"
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
    const {id_curso, id_materia, id_profesor} = req.body;

    let sql = "INSERT INTO curso_materia (id_curso, id_materia, id_profesor)";
    sql+= " VALUES (?, ?, ?)";

    db.query(sql, [id_curso, id_materia, id_profesor])
    .then(()=> {
        res.status(201).send("Guardado");
    })
    .catch((error)=> {
        console.error(error);
        res.status(500).send("ocurrió un error");
    })
})

router.delete ("/:curso_materia_id", function (req, res, next) {
    const {curso_materia_id} = req.params;
    const sql = "DELETE FROM curso_materia WHERE id = ?"
    db.query(sql, [curso_materia_id])
    .then(()=>{
        res.status(200).send("eliminado");
    })
    .catch((error)=>{
        console.error(error);
        res.status(500).send("ocurrió un error")
    })
})

router.put ("/:curso_materia_id", function(req, res, next) {
    const {curso_materia_id} = req.params;
    const {id_curso, id_materia, id_profesor} = req.body;
    const sql = "UPDATE curso_materia SET id_curso = ?, id_materia = ?, id_profesor = ? WHERE id = ?"
    db.query(sql, [id_curso, id_materia, id_profesor, curso_materia_id])
    .then(()=>{
        res.status(200).send("actualizado")
    })
    .catch((error)=>{
        console.error(error)
        res.status(500).send("ocurrió un error")
    })
})

module.exports = router;
