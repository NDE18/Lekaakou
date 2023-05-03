module.exports = (sequelize, Sequelize) => {
    const Order = sequelize.define("order", {
      _id: {
        type: Sequelize.STRING,
        primaryKey: true
      },
      paymentMethod: {
        type: Sequelize.STRING,
        allowNull: true
      },
      taxPrice: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0
      },
      shippingPrice: {
        type: Sequelize.FLOAT,
        allowNull: false,
        default: 0
      },
      totalPrice: {
        type: Sequelize.FLOAT,
        allowNull: false,
        default: 0.0
      }, 
      isPaid: {
        type: Sequelize.BOOLEAN,
        default: false
      },
      paidAt: {
        type: Sequelize.DATE
      },
      isDelivered: {
          type: Sequelize.BOOLEAN,
          default: false
      },
      deliveredAt: {
          type: Sequelize.DATE
      },
      orderRecommendation: {
        type: Sequelize.STRING,
        allowNull: true
      },
      statut :{
        type: Sequelize.BOOLEAN,
        default: true,
      }
    });
  
    return Order;
};
