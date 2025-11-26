const express = require('express');
const router = express.Router();
const passport = require('passport');
const {ensureAuthenticated, ensureManager, ensureSalesAgent} = require('../customMiddleware/auth')

const Registration = require('../models/Registration');

router.get('/register_user',(req, res) => { 
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

router.get("/manager_dash", ensureAuthenticated, ensureManager, (req, res) => {
        res.render("manager_dash") 
});

router.get("/salesagent_dash",ensureAuthenticated, ensureSalesAgent, (req, res) => {
    res.render("salesagent_dash")
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