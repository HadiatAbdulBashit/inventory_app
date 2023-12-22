const { Sequelize } = require('sequelize');

module.exports = (table) => {
    const PurchaseDetail = table.define("purchaseDetail", {
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
    }, {
        freezeTableName: true
    });

    return PurchaseDetail;
};
