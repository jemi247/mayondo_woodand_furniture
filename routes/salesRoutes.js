const express= require('express');
const router = express.Router();
const {ensureAuthenticated, ensureManager, ensureSalesAgent} = require('../customMiddleware/auth')

const furnitureStock = require("../models/Furniturestock");
const woodStock = require("../models/Woodstock");
const woodSale = require("../models/Woodsale");
const furnitureSale = require("../models/Furnituresale");

router.get("/reg_furnituresale", (req,res) => {
    res.render("reg_furnituresale")
});

router.post("/reg_furnituresale", async(req,res) => {
    try {
        const { customerName, furnitureType, quantity, furniturePrice, saleDate, paymentType, transportProvided, agentName } = req.body;
        const stocks = await furnitureStock.find({furnitureType:furnitureType})
        if(!stocks || stocks.length === 0)
            return res.status(400).send("Stock not found!")
        // calculate total available quantity across all stock entries
        const totalAvailable = stocks.reduce((sum,stock) => sum + stock.quantity, 0)
        if(totalAvailable < Number(quantity))
            return res.status(400).send("Insufficient stock!")
        // calculate total price
        let total = furniturePrice * Number(quantity)
        if(transportProvided)
            total *= 1.05;
        const sale = new furnitureSale({
            customerName, 
            furnitureType, 
            quantity,
            furniturePrice, 
            saleDate, 
            paymentType, 
            agentName: req.user._id,
            transportProvided: !!transportProvided,
            totalPrice: total
        })
        await sale.save();
        // deduct quantity sold from the stock
        let remainingToDeduct = Number(quantity)
        for (const stock of stocks) {
            if (remainingToDeduct <= 0) break;
            const deductFromThis = Math.min(stock.quantity, remainingToDeduct)
            stock.quantity -= deductFromThis
            remainingToDeduct -= deductFromThis
            await stock.save();
        }
        res.redirect("/reg_furnituresale")
    } catch (error) {
      console.error(error) 
        res.status(500).send("Server error"); 
    } 
});

router.get("/reg_woodsale", (req,res) => {
    res.render("reg_woodsale")
});

router.post("/reg_woodsale", async(req,res) => {
    try {
        const { customerName, woodName, woodType, quantity, saleDate, woodPrice, paymentType, transportProvided, agentName} = req.body;
        const stocks = await woodStock.find({woodName:woodName, woodType:woodType})
        if(!stocks || stocks.length === 0)
            return res.status(400).send("Stock not found!")
        // calculate total available quantity across all stock entries
        const totalAvailable = stocks.reduce((sum,stock) => sum + stock.quantity, 0)
        if(totalAvailable < Number(quantity))
            return res.status(400).send("Insufficient stock!")
        // calculate total price
        let total = woodPrice * Number(quantity)
        if(transportProvided)
            total *= 1.05;
        const sale = new woodSale({
            customerName, 
            woodName,
            woodType, 
            quantity, 
            saleDate, 
            paymentType, 
            agentName: req.user._id,
            transportProvided: !!transportProvided,
            totalPrice: total
        })
        await sale.save();
        // deduct quantity sold from the stock
        let remainingToDeduct = Number(quantity)
        for (const stock of stocks) {
            if (remainingToDeduct <= 0) break;
            const deductFromThis = Math.min(stock.quantity, remainingToDeduct)
            stock.quantity -= deductFromThis
            remainingToDeduct -= deductFromThis
            await stock.save();
        }
        res.redirect("/reg_woodsale");
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }   
});

router.get('/salesrecords', async(req, res) => {
    try {
        const woodSales = await woodSale.find().populate('agentName');
        const furnitureSales = await furnitureSale.find().populate('agentName');
        res.render("salesrecords", { woodSales, furnitureSales });  
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
});

module.exports = router;

// router.get('/registerUser', (req, res) => {
//     res.render('register_user', { title: 'Register User' });
// });