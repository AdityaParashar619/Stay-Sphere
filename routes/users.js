const express = require('express');
const router = express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const passport = require('passport');
const {saveRedirectUrl}= require('../middleware/middleware.js');

//require the user controller
const userController=require('../controllers/all_users.js');

//router.route for sign_up(get and post)
router.route('/sign_up')
    .get((req,res)=>{
        res.render('signUp.ejs');
    })
    .post(wrapAsync (userController.sign_up))

//router.route for sign_up(get and post)
router.route('/log_in')
    .get((req,res)=>{
        res.render('log_in.ejs');
    })
    .post(saveRedirectUrl,passport.authenticate('local',{
        failureRedirect:'/log_in',
        failureFlash:true
    }),wrapAsync (userController.login))

//for log out user
router.get('/logout',userController.logout)

module.exports = router;