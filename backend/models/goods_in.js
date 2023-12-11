'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class goods_in extends Model {
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
  goods_in.init({
    suplier: DataTypes.STRING,
    date: DataTypes.DATE,
    id_user: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'goods_in',
  });
  return goods_in;
};