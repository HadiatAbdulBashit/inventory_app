const { Sequelize } = require('sequelize');

module.exports = (table) => {
    const User = table.define("user", {
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
            type: Sequelize.STRING,
            allowNull: false,
        },
        username: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        role: {
            type: Sequelize.ENUM('Super Admin', 'Admin', 'Office', 'Warehouse'),
            allowNull: false,
        },
    },{
        freezeTableName: true
    });

    return User;
};