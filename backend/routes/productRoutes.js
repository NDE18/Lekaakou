const express = require('express')
const router = express.Router()
const { protect, admin } = require('../middleware/authMiddleware.js')
const { getProducts, getProductById, updateProduct, deleteProduct, createProduct, createProductReview, getTopProducts, createUserProduct, updateUserProduct, deleteUserProduct, getUserProducts } = require('../controllers/productsController.js')

router.route('/').get(getProducts).post(protect, admin, createProduct)
router.route('/:id/reviews').post(protect, createProductReview)
router.get('/top', getTopProducts)
router.route('/:id').get(getProductById).delete(protect, admin, deleteProduct).put(protect, admin, updateProduct)
router.route('/user').post(protect, createUserProduct)
router.route('/user/:id').put(protect, updateUserProduct).delete(protect, deleteUserProduct)
router.route('/user/products/:id').get(getUserProducts)


module.exports = router