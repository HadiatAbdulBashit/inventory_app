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
    },{
        freezeTableName: true
    });

    return Item;
};