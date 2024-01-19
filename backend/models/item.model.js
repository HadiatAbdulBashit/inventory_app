const { Sequelize } = require('sequelize');

module.exports = (table) => {
    const Item = table.define("item", {
        id:{
            type: Sequelize.STRING,
            defaultValue: Sequelize.UUIDV4,
            allowNull: false,
            primaryKey: true,
            validate:{
                notEmpty: true
            }
        },
        name: {
            type: Sequelize.STRING
        },
        imageUrl: {
            type: Sequelize.STRING
        },
        category: {
            type: Sequelize.STRING
        },
        merk: {
            type: Sequelize.STRING
        },
        description: {
            type: Sequelize.TEXT
        },
    },{
        freezeTableName: true
    });

    return Item;
};