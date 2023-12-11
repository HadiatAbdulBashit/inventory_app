'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class goods_in_detail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Goods_ins);
      this.belongsTo(models.Goods);
    }
  }
  goods_in_detail.init({
    quantity: DataTypes.INTEGER,
    id_goods_in: DataTypes.STRING,
    id_goods: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'goods_in_detail',
  });
  return goods_in_detail;
};