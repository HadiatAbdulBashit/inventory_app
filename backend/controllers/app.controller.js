const { Sequelize } = require('sequelize');

const db = require("../models");

const Transaction = db.transaction;
const Item = db.item;
const ItemDetail = db.itemDetail
const AppLog = db.appLog;
const Op = Sequelize.Op;

// Retrieve necersery data from the database.
exports.dashboard = async (req, res) => {
    try {
        // Total Purchase This Month
        const totalPurchase = await Transaction.sum('totalPrice', {
            where: {
                type: 'In', // Assuming 'In' represents a purchase
                status: 'Success', // You might want to adjust the status based on your logic
                createdAt: {
                    [Op.gte]: new Date(new Date() - 30 * 24 * 60 * 60 * 1000), // Filter for the last 30 days
                },
            }
        });

        // Total Sale This Month
        const totalSale = await Transaction.sum('totalPrice', {
            where: {
                type: 'Out', // Assuming 'Out' represents a sale
                status: 'Success', // You might want to adjust the status based on your logic
                createdAt: {
                    [Op.gte]: new Date(new Date() - 30 * 24 * 60 * 60 * 1000), // Filter for the last 30 days
                },
            }
        });

        // Total Transaction This Month
        const totalTransaction = await Transaction.count({
            where: {
                status: 'Success', // You might want to adjust the status based on your logic
                createdAt: {
                    [Op.gte]: new Date(new Date() - 30 * 24 * 60 * 60 * 1000), // Filter for the last 30 days
                },
            }
        });

        // Item in Warehouse
        const itemsInWarehouse = await Item.count();

        const currentMonth = new Date().getMonth();
        const barChartMonths = Array.from({ length: 7 }, (_, i) => {
            const monthIndex = (currentMonth - i + 12) % 12;
            return new Date(0, monthIndex).toLocaleString('default', { month: 'long' });
        }).reverse();

        const barChartSaleData = [];
        const barChartPurchaseData = [];

        // Fetch data for the last 7 months
        for (const month of barChartMonths) {
            const saleData = await Transaction.sum('totalPrice', {
                where: {
                    type: 'Out', // Assuming 'Out' represents a sale
                    status: 'Success',
                    createdAt: {
                        [Op.between]: [
                            new Date(new Date().getFullYear(), barChartMonths.indexOf(month), 1),
                            new Date(new Date().getFullYear(), barChartMonths.indexOf(month) + 1, 0, 23, 59, 59, 999),
                        ],
                    },
                },
            });

            const purchaseData = await Transaction.sum('totalPrice', {
                where: {
                    type: 'In', // Assuming 'In' represents a purchase
                    status: 'Success',
                    createdAt: {
                        [Op.between]: [
                            new Date(new Date().getFullYear(), barChartMonths.indexOf(month), 1),
                            new Date(new Date().getFullYear(), barChartMonths.indexOf(month) + 1, 0, 23, 59, 59, 999),
                        ],
                    },
                },
            });

            barChartSaleData.push(saleData || 0);
            barChartPurchaseData.push(purchaseData || 0);
        }

        const totalPurchaseThisMonth = await Transaction.count({
            where: {
                type: 'In',
                status: 'Success',
                createdAt: {
                    [Op.gte]: new Date(new Date() - 30 * 24 * 60 * 60 * 1000), // Filter for the last 30 days
                },
            }
        });
        
        const totalSaleThisMonth = await Transaction.count({
            where: {
                type: 'Out',
                status: 'Success',
                createdAt: {
                    [Op.gte]: new Date(new Date() - 30 * 24 * 60 * 60 * 1000), // Filter for the last 30 days
                },
            }
        });
        
        const lastPurchase = await Transaction.findAll({
            where: {
                type: 'In',
            },
            attributes: ['secondParty', 'status'],
            limit: 5,
            order: [['createdAt', 'desc']],
        });

        const lastSale = await Transaction.findAll({
            where: {
                type: 'Out',
            },
            attributes: ['secondParty', 'status'],
            limit: 5,
            order: [['createdAt', 'desc']],
        });

        const newItem = await ItemDetail.findAll({
            attributes: ['unit', 'stock'],
            limit: 5,
            order: [['updatedAt', 'desc']],
            include: [{
                model: Item,
                attributes: ['name', 'merk'],
                as: 'item',
            }]
        });

        res.send({
            totalPurchase,
            totalSale,
            totalTransaction,
            itemsInWarehouse,
            barChartLabels: barChartMonths,
            barChartDataSale: barChartSaleData.reverse(),
            barChartDataPurchase: barChartPurchaseData.reverse(),
            totalPurchaseThisMonth,
            totalSaleThisMonth,
            lastPurchase,
            lastSale,
            newItem
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: error.message || "Some error occurred while retrieving dashboard data."
        });
    }
};

// Retrieve app log from the database.
exports.appLog = (req, res) => {
    const page = parseInt(req.query.page) - 1 || 0;
    const limit = parseInt(req.query.limit) || 10;
    let sort = req.query.sort || "createdAt";
    let total = null
    req.query.sort ? (sort = req.query.sort.split(",")) : (sort = [sort]);

    var condition = req.query.search ? { message: { [Op.iLike]: `%${req.query.search}%` } } : null;

    AppLog.count({
        where: condition
    })
        .then(totalData => total = totalData)
        .catch(err => {
            res.status(500).send({
                msg:
                    err.message || "Some error occurred while retrieving item."
            });
        });

    AppLog.findAll({
        where: condition,
        offset: page * limit,
        limit: limit,
        order: [sort]
    })
        .then(items => {
            res.send({
                page,
                limit,
                items,
                total,
            });
        })
        .catch(err => {
            res.status(500).send({
                msg:
                    err.message || "Some error occurred while retrieving users."
            });
        });
};
