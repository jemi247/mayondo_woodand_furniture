const express = require('express');
const router = express.Router();
const passport = require('passport');
const {ensureAuthenticated, ensureManager, ensureSalesAgent} = require('../customMiddleware/auth');

const Registration = require('../models/Registration');

const furnitureStock = require("../models/Furniturestock");
const woodStock = require("../models/Woodstock");
const woodSale = require("../models/Woodsale");
const furnitureSale = require("../models/Furnituresale");

router.get('/register_user', ensureAuthenticated, ensureManager, (req, res) => { 
    res.render("register_user")
});

router.post("/register_user", async(req, res) => {
    try {
        const newUser = new Registration(req.body)
    console.log(newUser)
    let user = await Registration.findOne({
        email: req.body.email
    })
    if (user){
        return res.status(400).send('Not registered, that user already exists.')
        } else{
            await Registration.register(newUser, req.body.password, (error) => {
                if(error){
                    throw error;
                }
            })
        }
    } catch (error) {
        console.error(error.message);
        res.status(400).send('Sorry,something went wrong.')
    }
    res.redirect("/register_user")
});

router.get("/login", (req,res) => {
    res.render("login")
});

router.post("/login", passport.authenticate("local", {failureRedirect:"/login"}), (req, res) => {
    req.session.user = req.user
    console.log(req.user)
    if(req.user.role==="Manager"){
        res.redirect("/manager_dash")
    }else if(req.user.role==="Sales Agent"){
        res.redirect("/salesagent_dash")
    }else if(req.user.role==="Warehouse Attendant"){
        res.redirect("/attendant_dash")
    }else{
        res.render("nonuser")
    }
});

router.get("/logout",(req, res) => {
    if(req.session){
        req.session.destroy((error) =>{
            if(error){
                return res.status(500).send('Error logging out')
            }
            res.redirect('/')
        });
    }
});

router.get("/manager_dash", ensureAuthenticated, ensureManager, async(req, res) => {
    try {
    // expenses for buying wood stock
    let totalHardWood = await woodStock.aggregate([
        {$match:{woodType:'hardwood'}},
        {$group:{_id:null,
            totalQuantity:{$sum:'$quantity'},
            totalCost:{$sum:{$multiply:['$unitPrice','$quantity']}} 
        }}
    ]);
    let totalSoftWood = await woodStock.aggregate([
        {$match:{woodType:'softwood'}},
        {$group:{_id:null,
            totalQuantity:{$sum:'$quantity'},
            totalCost:{$sum:{$multiply:['$unitPrice','$quantity']}} 
        }}
    ]);
    let totalTimber = await woodStock.aggregate([
        {$match:{woodType:'timber'}},
        {$group:{_id:null,
            totalQuantity:{$sum:'$quantity'},
            totalCost:{$sum:{$multiply:['$unitPrice','$quantity']}} 
        }}
    ]);
    let totalPoles = await woodStock.aggregate([
        {$match:{woodType:'poles'}},
        {$group:{_id:null,
            totalQuantity:{$sum:'$quantity'},
            totalCost:{$sum:{$multiply:['$unitPrice','$quantity']}} 
        }}
    ]);

    totalHardWood = totalHardWood[0]??{totalQuantity:0,totalCost:0};
    totalSoftWood = totalSoftWood[0]??{totalQuantity:0,totalCost:0};
    totalTimber = totalTimber[0]??{totalQuantity:0,totalCost:0};
    totalPoles = totalPoles[0]??{totalQuantity:0,totalCost:0};

    // total furniture quantity
    let totalChairs = await furnitureStock.aggregate([
        {$match:{furnitureType:'chair'}},
        {$group:{_id:null,
            totalQuantity:{$sum:'$quantity'},
        }}
    ]);
    let totalSofas = await furnitureStock.aggregate([
        {$match:{furnitureType:'sofa'}},
        {$group:{_id:null,
            totalQuantity:{$sum:'$quantity'},
        }}
    ]);
    let totalCupboards = await furnitureStock.aggregate([
        {$match:{furnitureType:'cupboard'}},
        {$group:{_id:null,
            totalQuantity:{$sum:'$quantity'},
        }}
    ]);
    let totalBeds = await furnitureStock.aggregate([
        {$match:{furnitureType:'bed'}},
        {$group:{_id:null,
            totalQuantity:{$sum:'$quantity'},
        }}
    ]);
    let totalWardrobes = await furnitureStock.aggregate([
        {$match:{furnitureType:'wardrobe'}},
        {$group:{_id:null,
            totalQuantity:{$sum:'$quantity'},
        }}
    ]);
    let totalTables = await furnitureStock.aggregate([
        {$match:{furnitureType:'table'}},
        {$group:{_id:null,
            totalQuantity:{$sum:'$quantity'},
        }}
    ]);
    let totalDressers = await furnitureStock.aggregate([
        {$match:{furnitureType:'dresser'}},
        {$group:{_id:null,
            totalQuantity:{$sum:'$quantity'},
        }}
    ]);
    let totalDiningSets = await furnitureStock.aggregate([
        {$match:{furnitureType:'dining set'}},
        {$group:{_id:null,
            totalQuantity:{$sum:'$quantity'},
        }}
    ]);
    let totalCabinets = await furnitureStock.aggregate([
        {$match:{furnitureType:'cabinet'}},
        {$group:{_id:null,
            totalQuantity:{$sum:'$quantity'},
        }}
    ]);

    totalChairs = totalChairs[0]??{totalQuantity:0};
    totalSofas = totalSofas[0]??{totalQuantity:0};
    totalCupboards = totalCupboards[0]??{totalQuantity:0};
    totalBeds = totalBeds[0]??{totalQuantity:0};
    totalWardrobes = totalWardrobes[0]??{totalQuantity:0};
    totalTables = totalTables[0]??{totalQuantity:0};
    totalDressers = totalDressers[0]??{totalQuantity:0};
    totalDiningSets = totalDiningSets[0]??{totalQuantity:0};
    totalCabinets = totalCabinets[0]??{totalQuantity:0};


    // get all sales
    const woodSales = await woodSale.find().populate('agentName','fullName');
    const furnitureSales = await furnitureSale.find().populate('agentName','fullName');
    const totalSales = woodSales.length + furnitureSales.length;

    // get all stock
    const woodStocks = await woodStock.find();
    const furnitureStocks = await furnitureStock.find();

    // calculate revenue
    const woodRevenue = woodSales.reduce((sum,sale) => sum + sale.totalPrice,0)
    const furnitureRevenue = furnitureSales.reduce((sum,sale) => sum + sale.totalPrice,0);
    const totalRevenue = woodRevenue + furnitureRevenue

    // calculate expenses(from purchase of woodstock)
    const woodExpenses = woodStocks.reduce((sum,stock) => sum + (stock.unitPrice * stock.quantity),0);

    // calculate profit
    const grossProfit = totalRevenue - woodExpenses;

    // low stock alerts
    const lowWoodStock = woodStocks.filter(stock => stock.quantity < 10);
    const lowFurnitureStock = furnitureStocks.filter(stock => stock.quantity < 5);
        
    res.render("manager_dash", {
        totalHardWood,
        totalSoftWood,
        totalTimber,
        totalPoles,
        totalSales,
        totalRevenue,
        woodExpenses,
        grossProfit,
        lowWoodStock,
        lowFurnitureStock,
        woodSales,
        furnitureSales,
        woodStocks,
        furnitureStocks,
        woodRevenue,
        furnitureRevenue,
        totalChairs,
        totalSofas,
        totalCupboards,
        totalBeds,
        totalSales,
        totalWardrobes,
        totalTables,
        totalDressers,
        totalDiningSets,
        totalCabinets,
    });     
    } catch (error) {
        console.error(error);
        res.status(500).send("Error loading dashboard data.");
    }     
});

router.get("/salesagent_dash",ensureAuthenticated, ensureSalesAgent, (req, res) => {
    res.render("salesagent_dash")
});

router.get("/attendant_dash", ensureAuthenticated, (req, res) => {
    res.render("attendant_dash")
});

// get registered users from the db
router.get('/users', async(req, res) => {
    try {
        const users = await Registration.find().sort({$natural:-1})
        res.render('users', {users});
    } catch (error) {
        console.error("Error getting user from the DB!")
        res.status(400).send("Unable to get users from the DB.")
    }   
}); 

// should always the last line
module.exports = router;