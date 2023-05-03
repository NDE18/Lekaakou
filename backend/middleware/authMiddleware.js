const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const model = require('../models')
const User = model.user

const protect = asyncHandler(async (req, res, next) => {
    let token

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1]

            const decoded = jwt.verify(token, "rodo"/* process.env.JWT_SECRET */)

            req.user = await  User.findByPk(decoded.id)//.select('-password')

            next()
        } catch(error) {
            console.error(error)
            res.status(401)
            throw new Error('Accès refusé, erreur de token')
        }
    }
    if(!token) {
        res.status(401)
        throw new Error('Accès refusé, absence de token')
    }
})

const admin = (req, res, next) => {
    if(req.user && req.user.isAdmin) {
        next()
    } else {
        res.status(401)
        throw new Error('NAccès refusé')
    }
}

module.exports = { protect, admin }