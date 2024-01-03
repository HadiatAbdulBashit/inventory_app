const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");
const User  = require("./user.model.js");
const Transaction = require("./transaction.model.js")
const TransactionDetail = require("./transactionDetail.model.js")
const Item = require("./item.model.js")
const ItemDetail = require("./itemDetail.model.js")
const ReturnItem = require("./returnItem.model")

const table = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: 0,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};

db.sequelize = table;

db.user = User(table);
db.transaction = Transaction(table);
db.transactionDetail = TransactionDetail(table);
db.item = Item(table);
db.itemDetail = ItemDetail(table);
db.returnItem = ReturnItem(table);

// User and Transaction Relationship for Office User
db.transaction.belongsTo(db.user, {
  foreignKey: "pocOffice",
  as: "userOffice",
});

// User and Transaction Relationship for Warehouse User
db.transaction.belongsTo(db.user, {
  foreignKey: "pocWarehouse",
  as: "userWarehouse",
});

// Item and ItemDetail Relationship
db.item.hasMany(db.itemDetail, { as: "itemDetail" });
db.itemDetail.belongsTo(db.item, {
  foreignKey: "itemId",
  as: "item",
});

// Transaction and TransactionDetail Relationship
db.transaction.hasMany(db.transactionDetail, { as: "transactionDetail" });
db.transactionDetail.belongsTo(db.transaction, {
  foreignKey: "transactionId",
  as: "transaction",
});

// Item and TransactionDetail Relationship
db.itemDetail.hasMany(db.transactionDetail, { as: "transactionDetail" });
db.transactionDetail.belongsTo(db.itemDetail, {
  foreignKey: "itemDetailId",
  as: "itemDetail",
});

// Transaction and returnItem Relationship
db.returnItem.belongsTo(db.transactionDetail, {
  foreignKey: "transactionDetailId",
  as: "transactionDetail",
});

// Transaction and returnItem Relationship
db.transaction.hasMany(db.returnItem, { as: "returnItem" });
db.returnItem.belongsTo(db.transaction, {
  foreignKey: "transactionId",
  as: "transaction",
});

module.exports = db;