const { Sequelize } = require('sequelize');

module.exports = (table) => {
    const Sale = table.define("sale", {
        id: {
            type: Sequelize.STRING,
            defaultValue: Sequelize.UUIDV4,
            allowNull: false,
            primaryKey: true,
            validate:{
                notEmpty: true
            }
        },
        customer: {
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

    return Sale;
};
