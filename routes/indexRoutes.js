const express = require('express');
const router = express.Router();

router.get("/", (req, res) => {
    res.render("landing", { title: 'Mayondo Wood and Furniture Ltd' });
});

// should always the last line
module.exports = router;

        // // expenses for buying wood stock
        // let totalHardWood = await Woodstock.aggregate([
        //     {$match:{woodType:'hardwood'}},
        //     {$group:{_id:null,
        //         totalQuantity:{$sum:'$quantity'},
        //         totalCost:{$sum:{$multiply:['$woodPrice','$quantity']}} 
        //     }}
        // ])
        // let totalSoftWood = await Woodstock.aggregate([
        //     {$match:{woodType:'softwood'}},
        //     {$group:{_id:null,
        //         totalQuantity:{$sum:'$quantity'},
        //         totalCost:{$sum:{$multiply:['$woodPrice','$quantity']}} 
        //     }}
        // ])
        // let totalTimber = await Woodstock.aggregate([
        //     {$match:{woodType:'timber'}},
        //     {$group:{_id:null,
        //         totalQuantity:{$sum:'$quantity'},
        //         totalCost:{$sum:{$multiply:['$woodPrice','$quantity']}} 
        //     }}
        // ])
        // let totalPoles = await Woodstock.aggregate([
        //     {$match:{woodType:'poles'}},
        //     {$group:{_id:null,
        //         totalQuantity:{$sum:'$quantity'},
        //         totalCost:{$sum:{$multiply:['$woodPrice','$quantity']}} 
        //     }}
        // ])
        // totalHardWood = totalHardWood[0]??{totalQuantity:0,totalCost:0}
        // totalSoftWood = totalSoftWood[0]??{totalQuantity:0,totalCost:0}
        // totalTimber = totalTimber[0]??{totalQuantity:0,totalCost:0}
        // totalPoles = totalPoles[0]??{totalQuantity:0,totalCost:0}

        // // get all sales
        // const woodSales = await Woodsale.find().populate('salesAgent','fullName')
        // const furnitureSales = await Furnituresale.find().populate('salesAgent','fullName')

        // // get all stock
        // const woodStocks = await Woodstock.find()
        // const furnitureStocks = await Furniturestock.find()

        // // calculate revenue
        // const woodRevenue = woodSales.reduce((sum,sale) => sum + sale.totalPrice,0)
        // const furnitureRevenue = fuurnitureSales.reduce((sum,sale) => sum + sale.totalPrice,0)
        // const totalRevenue = woodRevenue + furnitureRevenue

        // // calculate expenses(from purchase of woodstock)
        // const woodExpenses = woodStocks.reduce((sum,sale) => sum + (stock.woodPrice * stock.quantity),0)

        // // calculate profit
        // const grossProfit = totalRevenue - woodExpenses;

        // // low stock alerts
        // const lowWoodStock = woodStocks.filter(stock => stock.quantity < 10);
        
        // res.render("manager_dash", {
        //     totalHardWood,
        //     totalSoftWood,
        //     totalTimber,
        //     totalPoles
        // });