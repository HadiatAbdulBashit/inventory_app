const { Sequelize } = require('sequelize');

module.exports = (table) => {
    const Goods = table.define("goods", {
        uuid:{
            type: Sequelize.STRING,
            defaultValue: Sequelize.UUIDV4,
            allowNull: false,
            validate:{
                notEmpty: true
            }
        },
        name: {
            type: Sequelize.STRING
        },
        unit: {
            type: Sequelize.STRING
        },
        stock: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        price: {
            type: Sequelize.FLOAT
        },
    },{
        freezeTableName: true
    });

    return Goods;
};