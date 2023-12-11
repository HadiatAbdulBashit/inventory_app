'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class goods_out extends Model {
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
  goods_out.init({
    customer: DataTypes.STRING,
    date: DataTypes.DATE,
    id_user: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'goods_out',
  });
  return goods_out;
};