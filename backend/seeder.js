const dotenv = require('dotenv')
const colors = require('colors')
const model = require('./models')
const users = require('./data/users.js')
const products = require('./data/products.js')
const User = model.user
const Product = model.product
const Order = model.order

dotenv.config() 

const importData = async () => {
    try {

        const createdUsers = users.map(user => {
            return { ...user,_id: Date.now().toString() + user.name}
        })
        await User.bulkCreate(createdUsers)

        const adminUser = createdUsers[0]._id

        const sampleProduct = products.map(product => {
            return { ...product, user: adminUser, _id: Date.now().toString() + product.id }
        })

        await Product.bulkCreate(sampleProduct)

        console.log('Data imported!'.green.inverse)
        process.exit()
    } catch (error) {
        console.error(`${error}`.red.inverse)
        process.exit(1)
    }
}

const destroyData = async () => {
    try {
        await Order.deleteMany()
        await Product.deleteMany()
        await User.deleteMany()

        console.log('Data Destroyed!'.red.inverse)
        process.exit()
    } catch (error) {
        console.error(`${error}`.red.inverse)
        process.exit(1)
    }
}

if(process.argv[2] === '-d') {
    destroyData()
} else {
    /* model.sequelize.sync({ force: true }).then(() => {
        console.log("Drop and re-sync db.");
    }); */
    importData()
}