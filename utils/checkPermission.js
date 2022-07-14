const CustomError = require('../errors/index')
const checkPermission = (requsetUser, resourceUserId) => {
    // console.log(requserid)
    // console.log(typeof requserid)
    // console.log(searchid)
    // console.log(typeof searchid)
    if (requsetUser.role === 'admin') return;
    if (requsetUser.userId === resourceUserId.toString()) return;
    throw new CustomError.UnauthorizeError('Not authorized to acess this route')
}
module.exports = checkPermission