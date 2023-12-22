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
            type: Sequelize.STRING
        },
        username: {
            type: Sequelize.STRING
        },
        password: {
            type: Sequelize.STRING
        },
        role: {
            type: Sequelize.CHAR(1)
        }
    },{
        freezeTableName: true
    });

    return User;
};