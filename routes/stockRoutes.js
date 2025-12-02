const express= require('express');
const router = express.Router();
// const connectEnsureLogin = require('connect-ensure-login');
const multer = require('multer');
const {ensureAuthenticated, ensureManager, ensureSalesAgent} = require('../customMiddleware/auth')

const furnitureStock = require("../models/Furniturestock");
const woodStock = require("../models/Woodstock");

// Image upload configs
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/images/uploads')
    },
    filename:  (req, file, cb) => {
      cb(null, file.originalname)
    }
});
var upload = multer({ storage: storage });

// connectEnsureLogin.ensureLoggedIn(),
router.get('/register_wood', ensureAuthenticated, ensureManager, (req, res) => {
    res.render("register_wood") 
});

router.post('/register_wood', async(req, res) => {
    try {
        const wood = new woodStock(req.body)
    console.log(wood);
    await wood.save()
    res.redirect("/register_wood")
    } catch (error) {
        console.error(error)
        res.status(500).send("Error registering wood stock.");
    }  
});

router.get('/register_furniture', ensureAuthenticated, ensureManager, (req, res) => {
    res.render("register_furniture")
});

router.post('/register_furniture', upload.single('furnitureImage'), async(req, res) => {
    try {
        const furniture = new furnitureStock(req.body)
        furniture.furnitureImage = req.file.path
        console.log(furniture)
        await furniture.save()
        res.redirect("/register_furniture")
    } catch (error) {
        console.error(error)
        res.redirect("/register_furniture")
    }
});

// registered stock
router.get('/wood_list', async(req, res) => {
    try {
        const woodStocks = await woodStock.find();
        res.render("wood_list", { woodStocks });  
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving wood stock from the database.");
    }
});

router.get('/furniture_list', async(req, res) => {
    try {
        const furnitureStocks = await furnitureStock.find();
        res.render("furniture_list", { furnitureStocks });  
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving furniture stock from the database.");
    }
});



// update furniture stock
router.get('/furniture/:id', async(req, res) => {
    try {
    const furnitures = await furnitureStock.findOne({_id:req.params.id});
    res.render("update_furniture", {item:furnitures})
    } catch (error) {
        res.status(400).send("Unable to find item in the DB!")
        console.log(error);
    }
}); 

router.post('/furniture', async(req, res) => {
    try {
    await furnitureStock.findByIdAndUpdate({_id:req.query.id},req.body);
    res.redirect("/furniture_list")
    } catch (error) {
        res.status(400).send("Unable to find item in the DB!")
        console.log(error);
    }
});

// delete furniture
router.delete('/furniture/:id', async(req, res) => {
    try {
    await furnitureStock.findByIdAndDelete(req.params.id);
    res.send({ message: "Furniture item deleted successfully." });
    } catch (error) {
        res.status(400).send({message: "Error deleting furniture item."});
        console.log(error);
    }
});

// update wood stock
router.get('/wood/:id', async(req, res) => {
    try {
    const woods = await woodStock.findOne({_id:req.params.id});
    res.render("update_wood", {item:woods})
    } catch (error) {
        res.status(400).send("Unable to find item in the DB!")
        console.log(error);
    }
}); 

router.post('/wood', async(req, res) => {
    try {
    await woodStock.findByIdAndUpdate({_id:req.query.id},req.body);
    res.redirect("/wood_list")
    } catch (error) {
        res.status(400).send("Unable to find item in the DB!")
        console.log(error);
    }
});

// delete wood
router.delete('/wood/:id', async(req, res) => {
    try {
    await woodStock.findByIdAndDelete(req.params.id);
    res.send({ message: "Wood item deleted successfully." });
    } catch (error) {
        res.status(400).send({message: "Error deleting wood item."});
        console.log(error);
    }
});




module.exports = router;

// router.get('/registerUser', (req, res) => {
//     res.render('register_user', { title: 'Register User' });
// });