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
        // Total Price Purchase This Month
        const totalPurchase = await Transaction.sum('totalPrice', {
            where: {
                type: 'In',
                status: ['Success', 'Success with Return'],
                createdAt: {
                    [Op.gte]: new Date(new Date() - 30 * 24 * 60 * 60 * 1000),
                },
            }
        });

        // Total Purchase Sale This Month
        const totalSale = await Transaction.sum('totalPrice', {
            where: {
                type: 'Out',
                status: ['Success', 'Success with Return'],
                createdAt: {
                    [Op.gte]: new Date(new Date() - 30 * 24 * 60 * 60 * 1000),
                },
            }
        });

        // Total Transaction This Month
        const totalTransaction = await Transaction.count({
            where: {
                status: ['Success', 'Success with Return'],
                createdAt: {
                    [Op.gte]: new Date(new Date() - 30 * 24 * 60 * 60 * 1000),
                },
            }
        });

        // Item in Warehouse
        const itemsInWarehouse = await Item.count();

        // Create name of past 7 month from now
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
                    type: 'Out',
                    status: ['Success', 'Success with Return'],
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
                    type: 'In',
                    status: ['Success', 'Success with Return'],
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

        // Get total purchase this month
        const totalPurchaseThisMonth = await Transaction.count({
            where: {
                type: 'In',
                status: ['Success', 'Success with Return'],
                createdAt: {
                    [Op.gte]: new Date(new Date() - 30 * 24 * 60 * 60 * 1000),
                },
            }
        });

        // Get total sale this month
        const totalSaleThisMonth = await Transaction.count({
            where: {
                type: 'Out',
                status: ['Success', 'Success with Return'],
                createdAt: {
                    [Op.gte]: new Date(new Date() - 30 * 24 * 60 * 60 * 1000),
                },
            }
        });

        // Get 5 last purchase
        const lastPurchase = await Transaction.findAll({
            where: {
                type: 'In',
                status: ['Success', 'Success with Return', 'Canceled'],
            },
            attributes: ['secondParty', 'status', 'updatedAt'],
            limit: 5,
            order: [['createdAt', 'desc']],
        });

        // Get last sale
        const lastSale = await Transaction.findAll({
            where: {
                type: 'Out',
                status: ['Success', 'Success with Return', 'Canceled'],
            },
            attributes: ['secondParty', 'status', 'updatedAt'],
            limit: 5,
            order: [['createdAt', 'desc']],
        });

        // Get last updated item
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

    // filter search base on message
    var condition = req.query.search ? { message: { [Op.iLike]: `%${req.query.search}%` } } : null;

    // filter base on methode request
    let filterMethod = req.query.method || "All";
    const methodeOption = [
        "GET",
        "POST",
        "PUT",
        "DELETE",
    ];
    filterMethod === "All" ? filterMethod = [...methodeOption] : filterMethod = req.query.method.split(",");
    condition = req.query.method && condition ? { ...condition, method: { [Op.or]: filterMethod } } : condition ? condition : req.query.method ? { method: { [Op.or]: filterMethod } } : null;

    // filter date range base on transaction created
    if (req.query.startDate && req.query.endDate) {
        let startDate = new Date(req.query.startDate);
        startDate = startDate.toISOString().split('T')[0];

        let endDate = new Date(req.query.endDate);
        endDate = endDate.setDate(endDate.getDate() + 1)
        let newEndDate = new Date(endDate)
        newEndDate = newEndDate.toISOString().split('T')[0];

        condition = {
            ...condition,
            createdAt: {
                [Op.between]: [startDate, newEndDate],
            },
        };
    } else if (req.query.month && req.query.year) { // filter date by month base on transaction created
        const firstDayOfMonth = new Date(req.query.year, req.query.month - 1, 1);
        const lastDayOfMonth = new Date(req.query.year, req.query.month, 0);

        condition = {
            ...condition,
            createdAt: {
                [Op.gte]: firstDayOfMonth,
                [Op.lt]: lastDayOfMonth,
            },
        };
    }

    // count data form app log table with in condition
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

    // get data form app log table with in condition, limit, offset and order
    AppLog.findAll({
        where: condition,
        offset: page * limit,
        limit: limit,
        order: [sort]
    })
        .then(logs => {
            // send response
            res.send({
                page,
                limit,
                logs,
                total,
                method: methodeOption
            });
        })
        .catch(err => {
            res.status(500).send({
                msg:
                    err.message || "Some error occurred while retrieving users."
            });
        });
};
