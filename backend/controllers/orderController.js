const asyncHandler = require('express-async-handler')
const model = require('../models')
var nodemailer = require('nodemailer');
const transport = require('../config/emailConfig.js');
const Order = model.order
const OrderItems = model.orderItems
const ShippingAddress = model.shippingAddress
const PaymentResult = model.paymentResult
const User = model.user

// @desc    Create new order
// @route   POST /api/orders
// @access  Private

const addOrderItems = asyncHandler(async (req, res) => {
    //const { orderItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body
    const { orderItems, shippingAddress, itemsPrice, paymentMethod, taxPrice, shippingPrice, totalPrice, orderRecommendation } = req.body

    if (orderItems && orderItems.length === 0) {
        res.status(400)
        throw new Error('No order items')
        return
    } else {
        const orderContent = {}
        const id = Date.now().toString()
        const order = {
            _id: id,
            userId: req.user._id,
            paymentMethod: paymentMethod, 
            itemsPrice: itemsPrice, 
            taxPrice: taxPrice, 
            shippingPrice: shippingPrice, 
            totalPrice: totalPrice,
            orderRecommendation: orderRecommendation,
            statut: true
        }
        const createdOrder = await Order.create(order)
        orderContent.order = createdOrder
        console.log(createdOrder)
        if(createdOrder){
            orderItems.map(item => {
                const orderItem = new OrderItems ({
                    product: item.product,
                    name: item.name,
                    image: item.image,
                    qty: item.qty,
                    price: item.price,
                    orderId: createdOrder._id
                })
                const createdOrderItem = orderItem.save()
                orderContent.orderItems = createdOrderItem
            })
            const orderAddress = {
                address: shippingAddress.address,
                city: shippingAddress.city,
                postalCode: shippingAddress.postalCode,
                country: shippingAddress.country,
                orderId: createdOrder._id
            }
            const shipping = await ShippingAddress.create(orderAddress)
            orderContent.shippingAddress = shipping

            var name = req.user.name
            var email = req.user.email
            var message = "Nouvelle commande enregistrée"
            var content = `name: ${name} \n email: ${email} \n message: ${message} `

            var mail = {
                from: name,
                to: 'contact@lekaakou.com',  // Change to email address that you want to receive messages on
                subject: 'Nouvelle commande',
                text: content
            }

            var transporter = nodemailer.createTransport(transport)
            transporter.sendMail(mail)
            console.log(orderItems)
            res.status(201).json({ order: createdOrder, orderItems: orderItems, shippingAddress: shipping})
        }
        //const orderContent = OrderItems.findOne({ where: {_id: createdOrder._id}, include: { OrderItems, ShippingAddress} } )
        
    }
})

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private

const getOrderById = asyncHandler(async (req, res) => {
    const order  = await Order.findOne({ where: {_id: req.params.id}, 
        include: [{model: OrderItems}, {model: ShippingAddress},  {model: User}] })
    //console.log(order)
    if(order) {
        res.json(order)
    } else {
        res.status(404)
        throw new Error('Error not found')
    }
})

// @desc    Update order to paid
// @route   GET /api/orders/:id/pay
// @access  Private

const updateOrderToPaid = asyncHandler(async (req, res) => {
    const order  = await Order.findByPk(req.params.id)

    if(order) {
        order.isPaid = true
        order.paidAt = Date.now()
        const payment = new PaymentResult ({
            id: req.body.id,
            status: req.body.update_time,
            update_time: req.body.update_time
        })
        const createdPayment = payment.save()
        if(createdPayment) {
            const updatedOrder = order.save()
            res.json(updatedOrder)
        }
        
    } else {
        res.status(404)
        throw new Error('Error not found')
    }
})

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
    const orders  = await Order.findAll({ where: { userId: req.user._id }})

    res.json(orders)
})

// @desc    Get all orders
// @route   GET /api/orders/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
    const pageSize = 5
    const page = Number(req.query.pageNumber) || 1

    const limit = pageSize
    const offset = pageSize * (page - 1)

    const orderList  = await Order.findAndCountAll({include: [{ model: User}], limit:limit, offset:offset, order: [['createdAt', 'DESC']]})
    //const results = await Product.findAndCountAll({ where: keyword, limit, offset })

    const { count: totalItems, rows: orders} = orderList

    res.json({ orders, page, pages: Math.ceil(totalItems / pageSize) })

    //res.json(orders)
})

// @desc    Update order to delivered
// @route   GET /api/orders/:id/deliver
// @access  Private/Admin

const updateOrderToDeliver = asyncHandler(async (req, res) => {
    const order  = await Order.findByPk(req.params.id)

    if(order) {
        order.isDelivered = true
        order.deliveredAt = Date.now()

        const updatedOrder = await order.save()
        res.json(updatedOrder)
    } else {
        res.status(404)
        throw new Error('Error not found')
    }
})

// @desc    Update order status
// @route   GET /api/orders/:id/updateOrder
// @access  Public
const updateOrderStatus = asyncHandler(async (req, res) => {
    const order  = await Order.findByPk(req.params.id)

    if(order) {
        if(order.statut){
            order.statut = false
            console.log('statut=>', order.statut)
        }
        else {
            order.statut = true
            console.log('statut=>', order.statut)
        }
        const updatedOrder = await order.save()
        res.json(updatedOrder)
    } else {
        res.status(404)
        throw new Error('Cette commande n\'existe pas ')
    }
})

module.exports = { addOrderItems, getOrderById, updateOrderToPaid, getMyOrders, getOrders, updateOrderToDeliver, updateOrderStatus }