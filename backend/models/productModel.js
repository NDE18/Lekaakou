module.exports = (sequelize, Sequelize) => {
    const Product = sequelize.define("product", {
      _id: {
        type: Sequelize.STRING,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.TEXT
      },
      brand: {
        type: Sequelize.STRING
      },
      category: {
        type: Sequelize.STRING
      },
      rating: {
        type: Sequelize.FLOAT,
        defaultValue: 0
      },
      /* reviews: {
        type: Sequelize.ARRAY(Sequelize.JSON),
        references:
      } */
      numReviews: {
        type: Sequelize.INTEGER,
        default: 0
      },
      price: {
        type: Sequelize.FLOAT
      }, 
      countInStock: {
        type: Sequelize.FLOAT,
        default: 0
      },
      image: {
        type: Sequelize.STRING
      }
    });
  
    return Product;
};
