'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class goods extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Users);
    }
  }
  goods.init({
    name: DataTypes.STRING,
    stock: DataTypes.INTEGER,
    id_incoming_goods: DataTypes.STRING,
    id_user: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'goods',
  });
  return goods;
};