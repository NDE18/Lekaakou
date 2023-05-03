module.exports = (sequelize, Sequelize) => {
    const Review = sequelize.define("review", {
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      rating: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      comment: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    });
  
    return Review;
};
