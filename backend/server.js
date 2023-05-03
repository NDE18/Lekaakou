const express = require('express');
const path = require('path');
const morgan = require('morgan');
const dotenv = require('dotenv');
const colors = require('colors');
const model = require('./models')
var nodemailer = require('nodemailer');
const transport = require('./config/emailConfig.js');
const { notFound, errorHandler } = require('./middleware/errorMiddleware.js');

const productRoutes = require('./routes/productRoutes.js');
const userRoutes = require('./routes/userRoutes.js');
const orderRoutes = require('./routes/orderRoutes.js')
const uploadRoutes = require('./routes/uploadRoutes.js'); 

dotenv.config()

//connectDB()
const PAYPAL_CLIENT_ID = "AeSGj0jVBo1keBZd3X4RSQjS7Zf1JUy5Rs98t-UXM053J-BFfvGs1DMfD9ipBddAb-fprp6zo0RxwX8R"
const app = express()

app.use(express.json())

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

app.get('/', (req, res) => {
  res.send('Api running ...')
})

const __dossier = path.resolve()
/* if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dossier, '/build')))

  app.get('*', (req, res) => 
    res.sendFile(path.resolve(__dossier, 'client', 'build', 'index.html')))
} else {
    app.get('/', (req, res) => {
      res.send('Api running ...')
  })
} */

model.sequelize.sync();

/* model.sequelize.sync({ force: true }).then(() => {
    console.log("Drop and re-sync db.");
}); */ 

var transporter = nodemailer.createTransport(transport)

transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log('Server is ready to take messages');
  }
});

app.use('/api/products', productRoutes)
app.use('/api/users', userRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/upload', uploadRoutes)

app.get('/api/config/paypal', (req, res) => 
    res.send(PAYPAL_CLIENT_ID)
)

// Make a folder static
app.use('/uploads', express.static(path.join(__dossier, '/uploads')))

app.use(notFound)
app.use(errorHandler) 


const PORT = process.env.PORT || 5000

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold))