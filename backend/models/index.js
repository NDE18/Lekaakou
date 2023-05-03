const dbConfig = require("../config/db.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.product = require("./productModel.js")(sequelize, Sequelize);
db.review = require("./reviewModel.js")(sequelize, Sequelize);
db.user = require("./userModel.js")(sequelize, Sequelize);
db.order = require("./orderModel.js")(sequelize, Sequelize);
db.shippingAddress = require("./shippingAddressModel.js")(sequelize, Sequelize);
db.paymentResult = require("./paymentResultModel.js")(sequelize, Sequelize);
db.orderItems = require("./orderItemsModel.js")(sequelize, Sequelize);
db.confirmationToken = require("./confirmationTokenModel.js")(sequelize, Sequelize);
/*db.images = require("./image.model.js")(sequelize, Sequelize); */

 db.user.hasOne(db.product, {
  foreignKey: "user",
});

db.user.hasMany(db.order)

db.order.belongsTo(db.user) 

db.user.hasOne(db.review, {
  foreignKey: "user"
})

db.user.hasOne(db.confirmationToken, {
  foreignKey: "userId",
});

/* db.product.hasOne(db.orderItems, {
  foreignKey: 'product'
})*/

db.order.hasMany(db.orderItems);

db.orderItems.belongsTo(db.order); 

db.product.hasMany(db.review)

db.review.belongsTo(db.product)

db.order.hasMany(db.shippingAddress)

db.shippingAddress.belongsTo(db.order) 

db.paymentResult.hasOne(db.order, {
  foreignKey: "paymentResult"
})


/*db.ROLES = ["user", "admin", "moderator"]; */

/* db.tutorials.hasMany(db.comments, { as: "comments" });
db.comments.belongsTo(db.tutorials, {
  foreignKey: "tutorialId",
  as: "tutorial",
}); */

module.exports = db;
