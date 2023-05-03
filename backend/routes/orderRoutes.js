const express = require( 'express')
const router = express.Router()
const { addOrderItems, getOrderById, updateOrderToPaid, getMyOrders, getOrders, updateOrderToDeliver, updateOrderStatus} = require( '../controllers/orderController.js')
const { protect, admin } = require( '../middleware/authMiddleware.js')

router.route('/').post(protect, addOrderItems).get(protect, admin, getOrders)
router.route('/myorders').get(protect, getMyOrders)
router.route('/:id').get(protect, getOrderById)
router.route('/:id/pay').put(protect, updateOrderToPaid)
//router.route('/:id/pay').put(protect, admin, updateOrderToPaid)
router.route('/:id/deliver').put(protect, admin, updateOrderToDeliver)
router.route('/:id/updateStatus').put(protect, updateOrderStatus)

module.exports = router