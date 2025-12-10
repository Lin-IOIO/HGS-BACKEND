const router = require('express').Router();
const db = require('../../conexion')

router.get("/", function(req, res, next) {
    const { busqueda } = req.query;
    
    let busquedaParcial = busqueda;

    let sql = "SELECT * FROM materias_unicas_por_curso";

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
    const {asignatura_id, pertenece_a_id_curso, id_profesor_asignado} = req.body;

    let sql = "INSERT INTO materias_unicas_por_curso (asignatura_id, pertenece_a_id_curso, id_profesor_asignado)";
    sql+= " VALUES (?, ?, ?)";

    db.query(sql, [asignatura_id, pertenece_a_id_curso, id_profesor_asignado])
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
    const sql = "DELETE FROM materias_unicas_por_curso WHERE id = ?"
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
    const {asignatura_id, pertenece_a_id_curso, id_profesor_asignado, id_plan_de_estudio_asignado} = req.body;
    const sql = "UPDATE materias_unicas_por_curso SET asignatura_id = ?, pertenece_a_id_curso = ?, id_profesor_asignado = ?, id_plan_de_estudio_asignado = ? WHERE id = ?"
    db.query(sql, [asignatura_id, pertenece_a_id_curso, id_profesor_asignado, id_plan_de_estudio_asignado, materia_id])
    .then(()=>{
        res.status(200).send("actualizado")
    })
    .catch((error)=>{
        console.error(error)
        res.status(500).send("ocurrió un error")
    })
})

module.exports = router;