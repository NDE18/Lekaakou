const asyncHandler = require('express-async-handler')
var bcrypt = require("bcryptjs");
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const model = require('../models')
const Product = model.product
const Review = model.review

// @desc    Fetch all product
// @route   GET /api/products/
// @access  public

const getProducts = asyncHandler(async (req, res) => {
    const pageSize = 12
    const page = Number(req.query.pageNumber) || 1

    /* const keyword = req.query.keyword ? {
        name: {
            $regex: req.query.keyword,
            $options: 'i'
        }
    } : {} */
    var keyword = req.query.keyword ? { name: { [Op.like]: `%${req.query.keyword}%` }} : null    
    const user = {user: { [Op.eq]: '1627998933289'}}
    const limit = pageSize
    const offset = pageSize * (page - 1)
    const count = await Product.count({ where: user })
    const results = await Product.findAndCountAll({ where: keyword, limit, offset })

    const { count: totalItems, rows: products} = results

    res.json({ products, page, pages: Math.ceil(count / pageSize) })
})

// @desc    Fetch all product
// @route   GET /api/user/products/
// @access  public

const getUserProducts = asyncHandler(async (req, res) => {
    const pageSize = 24
    const page = Number(req.query.pageNumber) || 1

    var keyword = req.query.keyword ? { name: { [Op.like]: `%${req.query.keyword}%` }} : null    
    const user = {user: { [Op.eq]: req.query.id}}
    const limit = pageSize
    const offset = pageSize * (page - 1)
    const count = await Product.count({ where: user })
    const results = await Product.findAndCountAll({ where: keyword, limit, offset })

    const { count: totalItems, rows: products} = results

    res.json({ products, page, pages: Math.ceil(count / pageSize) })
})

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  public

const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findOne({ where: {_id: req.params.id}, include:{ model: Review }})
    
    if(product){
        res.json(product)
    } else {
        res.status(404)
        throw new Error('Product not found')
    }
})

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin

const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.destroy({ where: {_id: req.params.id} })
    
    if(product){
        //await Product.(req.params.id)
        res.json({ message: "Product removed"})
    } else {
        res.status(404)
        throw new Error('Product not found')
    }
})

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Public/User

const deleteUserProduct = asyncHandler(async (req, res) => {
    const product = await Product.destroy({ where: {_id: req.params.id} })
    
    if(product){
        //await Product.(req.params.id)
        res.json({ message: "Product removed"})
    } else {
        res.status(404)
        throw new Error('Product not found')
    }
})

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin

const createProduct = asyncHandler(async (req, res) => {
    const id = Date.now().toString()
    const product = {
        _id: id,
        name: 'Sample name',
        price: 0,
        user: req.body.userId,
        image: '/images/sample.jpg',
        brand: 'Sample brand',
        category: 'Sample category',
        countInStock: 0,
        numReviews: 0,
        description: 'Sample description'
    }

    //const createdProduct = await product.save()
    const createdProduct = await Product.create(product)
    /* const id = sampleProduct.id
    const newId = bcrypt.hashSync(String(id))
    sampleProduct._id = newId
    const createdProduct = await sampleProduct.save() */
    res.status(201).json(createdProduct)
})

// @desc    Update a product
// @route   PUT /api/products
// @access  Private/Admin

const updateProduct = asyncHandler(async (req, res) => {
    const {name, price, description, image, brand, category, countInStock } = req.body

    const product = await Product.findByPk(req.params.id)
    
    if(product) {
        product.name = name
        product.price = price
        product.description = description
        product.image = image
        product.brand = brand
        product.category = category
        product.countInStock = countInStock

        const updatedProduct = await product.save()
        res.status(201).json(updatedProduct)
    } else {
        res.status(404)
        throw new Error('Product not found')
    }
    
})

// @desc    Create a product
// @route   POST /api/products
// @access  Public/User

const createUserProduct = asyncHandler(async (req, res) => {
    const id = Date.now().toString()
    const product = {
        _id: id,
        name: 'Sample name',
        price: 0,
        user: req.user._id,
        image: '/images/sample.jpg',
        brand: 'Sample brand',
        category: 'Sample category',
        countInStock: 0,
        numReviews: 0,
        description: 'Sample description'
    }

    //const createdProduct = await product.save()
    const createdProduct = await Product.create(product)
    res.status(201).json(createdProduct)
})

// @desc    Update a product
// @route   PUT /api/products
// @access  Public/User

const updateUserProduct = asyncHandler(async (req, res) => {
    const {name, price, description, image, brand, category, countInStock, user } = req.body

    const product = await Product.findByPk(req.params.id)
    
    if(product) {
        product.name = name
        product.price = price
        product.description = description
        product.image = image
        product.brand = brand
        product.category = category
        product.countInStock = countInStock
        product.user = user

        const updatedProduct = await product.save()
        res.status(201).json(updatedProduct)
    } else {
        res.status(404)
        throw new Error('Produit non trouvé')
    }
    
})

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private

const createProductReview = asyncHandler(async (req, res) => {
    const { rating, comment } = req.body

    const reviews = await Review.findAll({ where: { productId: req.params.id }})
    //console.log(product.length)
    if(reviews) {
        const alreadyReviewed = reviews.find((r) => r.user.toString() === req.user._id.toString())
    
        if(alreadyReviewed) {
            res.status(400)
            throw new Error ('Product already reviewed')
        }
        const product = await Product.findByPk(req.params.id)
        if(product) {
            const review = {
                name: req.user.name,
                rating: Number(rating),
                comment,
                user: req.user._id,
                productId: req.params.id
            }

            Review.create(review)
            product.numReviews = reviews.length

            product.rating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length

            await product.save()
            res.status(201).json({ message: 'Review added' })
        }
    } else {
        res.status(404)
        throw new Error('Product not found')
    }
    
})

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public

const getTopProducts = asyncHandler(async (req, res) => {

    const products = await Product.findAll({ limit: 3, order: [["rating", "DESC"]] })
    
    res.json(products)
})

module.exports = { getProducts, getProductById, deleteProduct, createProduct, updateProduct, createProductReview, getTopProducts, createUserProduct, updateUserProduct, deleteUserProduct, getUserProducts }