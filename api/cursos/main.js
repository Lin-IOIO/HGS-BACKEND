const router = require('express').Router();
const db = require('../../conexion')

router.get("/", (req, res) => {
    const { busqueda } = req.query;

    let sql = `
        SELECT 
            c.id,
            c.anio AS anio_id,
            c.division AS division_id,
            c.turno AS turno_id,
            CONCAT(c.anio, '�- ', c.division, '�') AS nombre,
            c.turno AS turno,
            COUNT(m.id) AS materias
        FROM curso c
        LEFT JOIN curso_materia m
            ON m.id_curso = c.id
    `;

    let params = [];

    if (busqueda) {
        sql += " WHERE c.anio LIKE ?";
        params.push(`%${busqueda}%`);
    }

    sql += " GROUP BY c.id";

    db.query(sql, params)
    .then(([rows]) => {
        res.json(rows);
    })
    .catch((error) => {
        console.error(error);
        res.status(500).send("Ocurri처 un error");
    });
});

router.get("/activos", (req, res) => {
    const sql = `
        SELECT COUNT(*) AS activos
        FROM curso
    `;

    db.query(sql)
    .then(([rows]) => {
        res.json(rows[0]);
    })
    .catch((error) => {
        console.error(error);
        res.status(500).send("ocurri처 un error");
    });
});

router.post("/", function (req, res, next) {
    const {anio, division, turno} = req.body;

    let sql = "INSERT INTO curso (anio, division, turno)";
    sql+= " VALUES (?, ?, ?)";

    db.query(sql, [anio, division, turno])
    .then(()=> {
        res.status(201).send("Guardado");
    })
    .catch((error)=> {
        console.error(error);
        res.status(500).send("ocurri처 un error");
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
        res.status(500).send("ocurri처 un error")
    })
})

router.put ("/:curso_id", function(req, res, next) {
    const {curso_id} = req.params;
    const {anio, division, turno} = req.body;
    const sql = "UPDATE curso SET anio = ?, division = ?, turno = ? WHERE id = ?"
    db.query(sql, [anio, division, turno, curso_id])
    .then(()=>{
        res.status(200).send("actualizado")
    })
    .catch((error)=>{
        console.error(error)
        res.status(500).send("ocurri처 un error")
    })
})

module.exports = router;
