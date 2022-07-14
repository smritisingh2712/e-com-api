const { getAllOrders, getSingleOrder, getCurrentUserOrders,
    createOrder, updateOrder } = require('../controllers/orderController')
const { authenticateUser, authorizePermission } = require('../middleware/authentication')
const express = require('express')
const router = express.Router()

router.route('/').get([authenticateUser, authorizePermission('admin')], getAllOrders).post(authenticateUser, createOrder)

router.route('/showAllMyOrders').get(authenticateUser, getCurrentUserOrders)

router.route('/:id').get(authenticateUser, getSingleOrder).patch(authenticateUser, updateOrder)

module.exports = router


