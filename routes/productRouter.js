const {
    createProduct, getAllProducts,
    getSingleProduct, updateProduct, deleteProduct, uploadImage
} = require('../controllers/productController')
const { getSingleProductReview } = require('../controllers/reviewController')
const { authenticateUser, authorizePermission } = require('../middleware/authentication')
const express = require('express');
const router = express.Router()
router.route('/').post([authenticateUser, authorizePermission('admin')], createProduct).get(getAllProducts)


router.route('/uploadImage').post([authenticateUser, authorizePermission('admin')], uploadImage)

router.route('/:id').get(getSingleProduct).patch([authenticateUser, authorizePermission('admin')], updateProduct).delete([authenticateUser, authorizePermission('admin')], deleteProduct)
router.route('/:id/reviews').get(getSingleProductReview)
module.exports = router