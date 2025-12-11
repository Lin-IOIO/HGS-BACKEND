const router = require('express').Router();
const db = require('../../conexion')

// router.get("/", function(req, res, next) {
//     const { busqueda } = req.query;
    
//     let busquedaParcial = busqueda;

//     let sql = "SELECT * FROM cursos";

//     if (busqueda) {
//         sql += " WHERE año like ?"
//         busquedaParcial = `%${busqueda}%`
//     }

//     db.query(sql, [busquedaParcial])
//     .then (([respuesta])=> {
//         res.json({respuesta})
//     })
//     .catch((error)=> {
//         console.error(error);
//         res.status(500).send("ocurrió un error")
//     })
// })

router.get("/", (req, res) => {
    const { busqueda } = req.query;

    let sql = `
        SELECT 
            c.id,
            c.año AS anio_id,
            c.division AS division_id,
            c.turno AS turno_id,
            CONCAT(c.año, '°- ', c.division, '°') AS nombre,
            CASE c.turno
            WHEN 1 THEN 'Mañana'
            WHEN 2 THEN 'Tarde'
            WHEN 3 THEN 'Vespertino'
            ELSE 'Desconocido'
            END AS turno,
            COUNT(m.id) AS materias
        FROM cursos c
        LEFT JOIN materias_unicas_por_curso m
            ON m.pertenece_a_id_curso = c.id
    `;

    let params = [];

    if (busqueda) {
        sql += " WHERE c.año LIKE ?";
        params.push(`%${busqueda}%`);
    }

    sql += " GROUP BY c.id";

    db.query(sql, params)
    .then(([rows]) => {
        res.json(rows);
    })
    .catch((error) => {
        console.error(error);
        res.status(500).send("Ocurrió un error");
    });
});

router.get("/activos", (req, res) => {
    const sql = `
        SELECT COUNT(*) AS activos
        FROM cursos
    `;

    db.query(sql)
    .then(([rows]) => {
        res.json(rows[0]);
    })
    .catch((error) => {
        console.error(error);
        res.status(500).send("ocurrió un error");
    });
});

router.post("/", function (req, res, next) {
    const {año, division, turno, creado_por_id_admin} = req.body;

    let sql = "INSERT INTO cursos (año, division, turno, creado_por_id_admin)";
    sql+= " VALUES (?,?, ?, ?)";

    db.query(sql, [año, division, turno, creado_por_id_admin])
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
    const sql = "DELETE FROM cursos WHERE id = ?"
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
    const {año, division, turno, creado_por_id_admin} = req.body;
    const sql = "UPDATE cursos SET año = ?, division = ?, turno = ?, creado_por_id_admin = ? WHERE id = ?"
    db.query(sql, [año, division, turno, creado_por_id_admin, curso_id])
    .then(()=>{
        res.status(200).send("actualizado")
    })
    .catch((error)=>{
        console.error(error)
        res.status(500).send("ocurrió un error")
    })
})

module.exports = router;