const jwt = require('jsonwebtoken')
require('dotenv').config()

const createJWT = ({ payload }) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.EXPIRE_IN })
    return token
}
const attachCookiesToResponse = ({ res, user }) => {
    const token = createJWT({ payload: user })
    const oneday = 1000 * 60 * 60 * 24
    const cookie = res.cookie('token', token, {
        httpOnly: true,
        expire: new Date(Date.now() + oneday),
        secure: process.env.NODE_ENV === "production",
        signed: true
    })

    return cookie
}

const isTokenValid = ({ token }) => jwt.verify(token, process.env.JWT_SECRET);

module.exports = { createJWT, isTokenValid, attachCookiesToResponse }