const { Sequelize } = require('sequelize');

module.exports = (table) => {
    const Purchase = table.define("purchase", {
        id: {
            type: Sequelize.STRING,
            defaultValue: Sequelize.UUIDV4,
            allowNull: false,
            primaryKey: true,
            validate:{
                notEmpty: true
            }
        },
        supplier: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        totalPrice: {
            type: Sequelize.FLOAT,
            allowNull: false,
        },
    }, {
        freezeTableName: true
    });

    return Purchase;
};
