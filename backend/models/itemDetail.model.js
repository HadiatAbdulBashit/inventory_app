const { Sequelize } = require('sequelize');

module.exports = (table) => {
    const ItemDetail = table.define("itemDetail", {
        id:{
            type: Sequelize.STRING,
            defaultValue: Sequelize.UUIDV4,
            allowNull: false,
            primaryKey: true,
            validate:{
                notEmpty: true
            }
        },
        unit: {
            type: Sequelize.STRING
        },
        stock: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        price: {
            type: Sequelize.INTEGER
        },
    },{
        freezeTableName: true
    });

    return ItemDetail;
};