const { Sequelize } = require('sequelize');

module.exports = (table) => {
    const User = table.define("user", {
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