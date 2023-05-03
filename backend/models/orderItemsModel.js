module.exports = (sequelize, Sequelize) => {
    const OrderItems = sequelize.define("orderItems", {
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      qty: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      image: {
        type: Sequelize.STRING,
        allowNull: false
      },
      price: {
        type: Sequelize.FLOAT,
        allowNull: false
      }
    });
  
    return OrderItems;
};
