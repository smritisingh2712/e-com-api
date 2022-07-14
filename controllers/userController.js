const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors/index')
const { attachCookiesToResponse, checkPermission } = require('../utils')
const getAllUsers = async (req, res) => {

    const users = await User.find({ role: 'user' }).select('-password')

    res.status(StatusCodes.OK).json({ users })
}

const getSingleUser = async (req, res) => {
    const id = (req.params.id)

    const user = await User.findById(id).select('-password')
    if (!user) {
        throw new CustomError.UnauthenticatedError(`user not found with :${req.params.id}`)
    }

    checkPermission(req.user, user._id)
    res.status(StatusCodes.OK).json({ user })
}

const showCurrentUser = (req, res) => {
    res.status(StatusCodes.OK).json({ user: req.user })
}

const updateUser = async (req, res) => {
    const { name, email } = req.body
    if (!email || !name) {
        throw new CustomError.BadRequestError('please provide the data you want to update')
    }

    const user = await User.findOneAndUpdate({ _id: req.user.userId }, { email, name }, { new: true, runValidators: true });
    const tokenUser = { name: user.name, userId: user._id, role: user.role, email: user.email }
    attachCookiesToResponse({ res, user: tokenUser })
    res.status(StatusCodes.OK).json({ user: tokenUser })

}

const updateUserPassword = async (req, res) => {
    const { newPassword, oldPassword } = req.body
    if (!newPassword || !oldPassword) {
        throw new CustomError.BadRequestError('please provide both values')
    }

    const user = await User.findById(req.user.userId)

    const isPasswordCorrect = await user.comparePassword(oldPassword)

    if (!isPasswordCorrect) {
        throw new CustomError.UnauthenticatedError('Invalid Credentials')
    }
    user.password = newPassword
    await user.save();//then new password save in database
    res.status(StatusCodes.OK).json({ msg: 'Success! Password Updated..' })
}
module.exports = {
    getAllUsers, getSingleUser,
    showCurrentUser, updateUser,
    updateUserPassword
}