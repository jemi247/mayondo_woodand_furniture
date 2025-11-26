const express= require('express');
const router = express.Router();
const {ensureAuthenticated, ensureManager, ensureSalesAgent} = require('../customMiddleware/auth')
const woodsale = require("../models/Woodsale");
const furnituresale = require("../models/Furnituresale");

router.get("/furnituresales", (req,res) => {
    res.render("furnituresales")
});

router.post("/furnituresales", async(req,res) => {
    try {
        res.redirect("/#")
    } catch (error) {
      console.error(error)  
    } 
});

router.get("/woodsales", (req,res) => {
    res.render("woodsales")
});

router.post("/woodsales", async(req,res) => {
    try {
        const { customerName, woodType, quantity, saleDate, paymentType, agentname } = req.body;
        const stocks = await Woodstock.find({woodName:woodType})
        if(!stocks || stocks.length === 0)
            return res.status(400).send("Stock not found!")
        // calculate total available quantity across all stock entries
        const totalAvailable = stocks.reduce((sum,stock) => sum + stock.quantity, 0)
        if(totalAvailable < Number(quantity))
            return res.status(400).send("Insufficient stock!")
        // calculate total price
        let total = salePrice * Number(quantity)
        if(transportProvided)
            total *= 1.05;
        const sale = new woodsale({
            customerName, 
            woodType, 
            quantity, 
            saleDate, 
            paymentType, 
            agentname: req.user._id,
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
        res.redirect("/#");
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
   
});


module.exports = router;

// router.get('/registerUser', (req, res) => {
//     res.render('register_user', { title: 'Register User' });
// });