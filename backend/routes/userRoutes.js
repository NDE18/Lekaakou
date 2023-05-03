const express = require('express')
const router = express.Router()
const { authUser, getUserProfile, registrerUser, updateUserProfile, getUsers, deleteUser, getUserById, updateUser, contactUs, emailConfirmation } = require('../controllers/userController.js')
const { protect, admin } = require('../middleware/authMiddleware.js')

router.route('/').post(registrerUser).get(protect, admin, getUsers)
router.get('/confirmation/:id', emailConfirmation)
router.post('/login', authUser)
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile)
router.route('/:id').delete(protect, admin, deleteUser).get(protect, admin, getUserById).put(protect, admin, updateUser)
router.post('/contactus', contactUs)
module.exports = router