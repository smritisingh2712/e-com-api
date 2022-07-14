const CustomError = require('../errors/index')
const { isTokenValid } = require('../utils/index')
const authenticateUser = async (req, res, next) => {
    const token = req.signedCookies.token

    if (!token) {
        console.log("token hi nhi hai")
        throw new CustomError.UnauthenticatedError('Authentication Invalid');
    }
    try {
        //const payload = isTokenValid({ token })
        const { name, userId, role } = isTokenValid({ token })
        req.user = { name, userId, role }

        next()
    } catch (error) {
        console.log("token galat hai ")
        throw new CustomError.UnauthenticatedError('Authentication Invalid')
    }

}
// const authorizePermission = (req, res, next) => {
//     if (req.user.role !== 'admin') {
//         throw new CustomError.UnauthorizeError('Unauthorized to access this route')
//     }
//     next()
// }

const authorizePermission = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            throw new CustomError.UnauthorizeError('Unauthorized to access this route')
        }
        next()
    }


}





module.exports = { authenticateUser, authorizePermission }