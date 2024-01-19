const { Sequelize } = require('sequelize');

module.exports = (table) => {
    const AppLog = table.define("appLog", {
        ipAddress:{
            type: Sequelize.STRING,
            allowNull: false,
        },
        message: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        stack: {
            type: Sequelize.TEXT,
            allowNull: true,
        },
        method: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        url: {
            type: Sequelize.STRING,
            allowNull: true,
        },
    },{
        freezeTableName: true
    });

    return AppLog;
};