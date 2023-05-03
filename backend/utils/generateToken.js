const jwt = require('jsonwebtoken')

const generateToken = (id) => {
    return jwt.sign({ id }, 'rodo'/*process.env.JWT_SECRET*/, {
        expiresIn: '30d'
    })
}

module.exports = generateToken