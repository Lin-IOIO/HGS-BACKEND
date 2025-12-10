const router = require('express').Router();
const {hashPass} = require('@damianegreco/hashpass')

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
        res.json(respuesta)
    })
    .catch((error)=> {
        console.error(error);
        res.status(500).send("ocurrió un error")
    })
})

router.get("/resumen", (req, res) => {
    const sql = `
        SELECT COUNT(*) AS total
        FROM usuarios
        WHERE rol = 'profesor' OR rol = 'coordinador'
    `;

    db.query(sql)
    .then(([rows]) => {
        res.json(rows[0]);
    })
    .catch((error) => {
        console.error(error);
        res.status(500).send("Ocurrió un error");
    });
});

router.get("/activos", (req, res) => {
    const sql = `
        SELECT COUNT(*) AS total_cursos
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
    const {documento, nombre, apellido, correo, password, rol} = req.body;

    let sql = "INSERT INTO usuarios (documento, nombre, apellido, correo, password, rol)";
    sql+= " VALUES (?, ?, ?, ?, ?, ?)";

    const hashedPassword = hashPass(password)

    db.query(sql, [documento, nombre, apellido, correo, hashedPassword, rol])
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

    const hashedPassword = hashpass(password)

    db.query(sql, [documento, nombre, apellido, correo, hashedPassword, rol, usuario_id])
    .then(()=>{
        res.status(200).send("actualizado")
    })
    .catch((error)=>{
        console.error(error)
        res.status(500).send("ocurrió un error")
    })
})

module.exports = router;