module.exports = (sequelize, Sequelize) => {
    return sequelize.define("confirmationToken", {
        token: {
            type: Sequelize.STRING
        },
        expiredAt: {
            type: Sequelize.DATE
        }
    });
};
