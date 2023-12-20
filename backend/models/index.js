const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");
const User  = require("./user.model.js");
const Transaction = require("./transactionIn.model.js")
const Goods = require("./goods.model.js")

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

db.users = User(table);
db.transaction = Transaction(table);
db.goods = Goods(table);

module.exports = db;