const { Sequelize } = require('sequelize');

module.exports = (table) => {
    const Transaction = table.define("transaction", {
        id: {
            type: Sequelize.STRING,
            defaultValue: Sequelize.UUIDV4,
            allowNull: false,
            primaryKey: true,
            validate:{
                notEmpty: true
            }
        },
        type: {
            type: Sequelize.ENUM('In', 'Out'),
            allowNull: false,
        },
        secondParty: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        totalPrice: {
            type: Sequelize.FLOAT,
            defaultValue: 0
        },
        status: {
            type: Sequelize.ENUM('Inisialization', 'Ready to Check' , 'On Check', 'Success', 'Success with Return', 'Canceled'),
            allowNull: false,
        },
    }, {
        freezeTableName: true
    });

    return Transaction;
};
