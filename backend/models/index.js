const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");
const User  = require("./user.model.js");
const Purchase = require("./purchase.model.js")
const PurchaseDetail = require("./purchaseDetail.model.js")
const Sale = require("./sale.model.js")
const SaleDetail = require("./saleDetail.model.js")
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
db.purchase = Purchase(table);
db.purchaseDetail = PurchaseDetail(table);
db.sale = Sale(table);
db.saleDetail = SaleDetail(table);
db.item = Item(table);
db.itemDetail = ItemDetail(table);
db.returnItem = ReturnItem(table);

// User and Purchase Relationship
db.user.hasMany(db.purchase, { as: "purchase" });
db.purchase.belongsTo(db.user, {
  foreignKey: "userId",
  as: "user",
});

// User and Sale Relationship
db.user.hasMany(db.sale, { as: "sale" });
db.sale.belongsTo(db.user, {
  foreignKey: "userId",
  as: "user",
});

// Item and ItemDetail Relationship
db.item.hasMany(db.itemDetail, { as: "itemDetail" });
db.itemDetail.belongsTo(db.item, {
  foreignKey: "itemId",
  as: "item",
});

// Purchase and PurchaseDetail Relationship
db.purchase.hasMany(db.purchaseDetail, { as: "purchaseDetail" });
db.purchaseDetail.belongsTo(db.purchase, {
  foreignKey: "purchaseId",
  as: "purchase",
});

// Item and PurchaseDetail Relationship
db.item.hasMany(db.purchaseDetail, { as: "purchaseDetail" });
db.purchaseDetail.belongsTo(db.item, {
  foreignKey: "itemId",
  as: "item",
});

// Purchase and SaleDetail Relationship
db.sale.hasMany(db.saleDetail, { as: "saleDetail" });
db.saleDetail.belongsTo(db.sale, {
  foreignKey: "saleId",
  as: "sale",
});

// Item and SaleDetail Relationship
db.item.hasMany(db.saleDetail, { as: "saleDetail" });
db.saleDetail.belongsTo(db.item, {
  foreignKey: "itemId",
  as: "item",
});

// Item and returnItem Relationship
db.item.hasMany(db.returnItem, { as: "returnItem" });
db.returnItem.belongsTo(db.item, {
  foreignKey: "itemId",
  as: "item",
});

// Purchase and SaleDetail Relationship
db.sale.hasMany(db.returnItem, { as: "returnItem" });
db.returnItem.belongsTo(db.sale, {
  foreignKey: "saleId",
  as: "sale",
});

module.exports = db;