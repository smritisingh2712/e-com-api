const User = require('../models/User')
const { createJWT, isTokenValid, attachCookiesToResponse } = require('../utils')
const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors/index')
const jwt = require('jsonwebtoken')
const register = async (req, res) => {
    const { email, name, password } = req.body
    const emailExist = await User.findOne({ email })
    if (emailExist) {
        throw new CustomError.BadRequestError('Email alredy exist')

    }
    //first registered user is an admin
    const isFirstAccount = (await User.countDocuments({})) === 0;
    const role = isFirstAccount ? 'admin' : 'user';
    const user = await User.create({ email, name, password, role })
    const tokenUser = { name: user.name, userId: user._id, role: user.role }
    attachCookiesToResponse({ res, user: tokenUser })
    res.status(StatusCodes.CREATED).json({ user: tokenUser })
}

const login = async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        throw new CustomError.BadRequestError('Please enter email and password')
    }
    const user = await User.findOne({ email })
    if (!user) {
        throw new CustomError.UnauthenticatedError('Invalid Credentials')
    }
    const isPasswordCorrect = await user.comparePassword(password)
    if (!isPasswordCorrect) {
        throw new CustomError.UnauthenticatedError('Invalid Credentials')
    }

    const tokenUser = { name: user.name, userId: user._id, role: user.role }
    attachCookiesToResponse({ res, user: tokenUser })
    res.status(StatusCodes.OK).json({ user: tokenUser })


}

const logout = async (req, res) => {
    res.cookie('token', 'logout', {
        httpOnly: true,
        expire: new Date(Date.now())
    })
    res.status(200).send("logout successfull")
}
module.exports = { login, logout, register }