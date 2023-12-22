const { Sequelize } = require('sequelize');

module.exports = (table) => {
    const returnItem = table.define("returnItem", {
        id: {
            type: Sequelize.STRING,
            defaultValue: Sequelize.UUIDV4,
            allowNull: false,
            primaryKey: true,
            validate:{
                notEmpty: true
            }
        },
        totalItem: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        description: {
            type: Sequelize.STRING,
            allowNull: true,
        },
    }, {
        freezeTableName: true
    });

    return returnItem;
};
