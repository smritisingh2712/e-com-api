const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors/index')
const Product = require('../models/Product')
const path = require('path')
const createProduct = async (req, res) => {
    req.body.user = req.user.userId
    const product = await Product.create(req.body)
    res.status(StatusCodes.CREATED).json({ product })
}

const getAllProducts = async (req, res) => {
    const products = await Product.find({})

    res.status(StatusCodes.OK).json({ products, count: products.length })
}

const getSingleProduct = async (req, res) => {

    const { id: prodctId } = req.params
    const product = await Product.findOne({ _id: prodctId }).populate('reviews')

    if (!product) {

        throw new CustomError.NotFoundError(`no product with id :${prodctId}`)
    }
    res.status(StatusCodes.OK).json({ product })
}

const updateProduct = async (req, res) => {
    const { id: prodctId } = req.params
    const product = await Product.findOneAndUpdate({ _id: prodctId }, req.body, { new: true, runValidators: true });
    if (!product) {

        throw new CustomError.NotFoundError(`no product with id :${prodctId}`)
    }
    res.status(StatusCodes.OK).json({ product })
}


const deleteProduct = async (req, res) => {
    const { id: prodctId } = req.params
    const product = await Product.findOne({ _id: prodctId });
    //console.log("ba ki na ", product)
    if (!product) {

        throw new CustomError.NotFoundError('no product available with this id ')
    }
    await product.remove();
    res.status(StatusCodes.OK).json({ msg: `product successfull remove ` })
}

const uploadImage = async (req, res) => {
    console.log(req.files)
    if (!req.files) {
        throw new CustomError.BadRequestError('No File Uploaded')
    }
    const productImg = req.files.image
    if (!productImg.mimetype.startsWith('image')) {
        throw new CustomError.BadRequestError('Please Upload Image')
    }
    const maxSize = 1024 * 1024
    if (productImg.size > maxSize) {
        throw new CustomError.BadRequestError(`Please Upload a image less than 1MB`)
    }
    const imagePath = path.join(__dirname, '../public/uploads/' + `${productImg.name}`)
    await productImg.mv(imagePath)
    res.status(StatusCodes.OK).json({ image: { src: `/uploads/${productImg.name}` } })
}
module.exports = {
    createProduct, getAllProducts,
    getSingleProduct, updateProduct, deleteProduct, uploadImage
}