const router = require('express').Router();
const {hashPass} = require('@damianegreco/hashpass')

const db = require('../../conexion')

router.get("/", function(req, res, next) {
    const { busqueda } = req.query;
    
    let busquedaParcial = busqueda;

    let sql = `
        SELECT u.id, u.DNI, u.nombre, u.apellido, u.correo_electronico, u.id_rol, r.nombre AS rol
        FROM usuarios u
        JOIN roles r ON r.id = u.id_rol
    `;

    if (busqueda) {
        sql += " WHERE u.nombre like ?"
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
        FROM usuarios u
        JOIN roles r ON r.id = u.id_rol
        WHERE r.nombre = 'profesor' OR r.nombre = 'coordinador'
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

router.get("/profesores", (req, res) => {
    const sql = `
        SELECT u.id, u.DNI, u.nombre, u.apellido, u.correo_electronico, u.id_rol, r.nombre AS rol
        FROM usuarios u
        JOIN roles r ON r.id = u.id_rol
        WHERE r.nombre = 'profesor'
    `;

    db.query(sql)
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
        SELECT COUNT(*) AS total_cursos
        FROM curso
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
    const {DNI, nombre, apellido, correo_electronico, contrasena, id_rol} = req.body;

    let sql = "INSERT INTO usuarios (DNI, nombre, apellido, correo_electronico, contrasena, id_rol)";
    sql+= " VALUES (?, ?, ?, ?, ?, ?)";

    const hashedPassword = hashPass(contrasena)

    db.query(sql, [DNI, nombre, apellido, correo_electronico, hashedPassword, id_rol])
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
    const {DNI, nombre, apellido, correo_electronico, contrasena, id_rol} = req.body;
    const baseSql = "UPDATE usuarios SET DNI = ?, nombre = ?, apellido = ?, correo_electronico = ?, id_rol = ?"
    const params = [DNI, nombre, apellido, correo_electronico, id_rol]

    let sql = baseSql

    if (contrasena && String(contrasena).trim() !== '') {
        const hashedPassword = hashPass(contrasena)
        sql += ", contrasena = ?"
        params.push(hashedPassword)
    }

    sql += " WHERE id = ?"
    params.push(usuario_id)

    db.query(sql, params)
    .then(()=>{
        res.status(200).send("actualizado")
    })
    .catch((error)=>{
        console.error(error)
        res.status(500).send("ocurrió un error")
    })
})

module.exports = router;
