const {verificarToken} = require('@damianegreco/hashpass')
const {TOKEN_SECRET} = process.env;

function middleware(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader){
        return res.status(401).send('no autorizado, linea 8')
    }

    const token = authHeader.split(' ')[1]

    if (!token){
        res.status(401).send('formato de Token inválido')
    }

    const verificacion = verificarToken(token, TOKEN_SECRET)

    if (verificacion?.data) {
        req.user = verificacion.data
        next()
    }else {
        res.status(401).send('no autorizado, linea 23')
    }
}

module.exports = middleware;