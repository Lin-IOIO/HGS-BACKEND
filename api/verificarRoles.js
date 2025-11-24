function verificarRoles(rolesPermitidos) {

    return (req, res, next) => {

        console.log(rolesPermitidos)
        console.log(req.user)

        if (!req.user || !req.user.rol) {
            return res.status(403).send('Acceso denegado: Rol no definido.');
        }

        const userRol = req.user.rol;

        if (rolesPermitidos.includes(userRol)) {
            next();
        } else {
            res.status(403).send('Acceso denegado: No tienes permiso para este servicio.');
        }
    };
}

module.exports = verificarRoles;