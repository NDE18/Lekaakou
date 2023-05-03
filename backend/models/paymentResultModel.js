module.exports = (sequelize, Sequelize) => {
    const PaymentResult = sequelize.define("paymentResult", {
      
        _id: {type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true},
        status: {type: Sequelize.STRING},
        update_time: {type: Sequelize.STRING},
        email_address: {type: Sequelize.STRING},
      
    });
  
    return PaymentResult;
};
