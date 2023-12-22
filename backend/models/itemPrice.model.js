const { Sequelize } = require('sequelize');

module.exports = (table) => {
    const ItemPrice = table.define("itemPrice", {
        id:{
            type: Sequelize.STRING,
            defaultValue: Sequelize.UUIDV4,
            allowNull: false,
            primaryKey: true,
            validate:{
                notEmpty: true
            }
        },
        price: {
            type: Sequelize.INTEGER
        },
        date: {
            type: Sequelize.DATE
        },
    },{
        freezeTableName: true
    });

    return ItemPrice;
};