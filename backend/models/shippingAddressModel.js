module.exports = (sequelize, Sequelize) => {
    const ShippingAddress = sequelize.define("shippingAddress", {
        address: {type: Sequelize.STRING, allowNull: false},
        city: {type: Sequelize.STRING, allowNull: false},
        postalCode: {type: Sequelize.STRING, allowNull: false},
        country: {type: Sequelize.STRING, allowNull: false},
    });
  
    return ShippingAddress;
};
