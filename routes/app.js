const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const bodyparser = require('body-parser');

//load mysql connection
const connection = require('../config/database');
const{ forwardAuthenticated } = require('../config/auth');

//login page
//GET
//PUBLIC
router.get('/login', forwardAuthenticated, (req,res)=>{
     res.render('login');
});

//Register
//GET
//PUBLIC
router.get('/register', forwardAuthenticated, (req,res)=>{
    res.render('signup');
});

//Register
//POST
router.post('/register',(req,res)=>{
    const {fname,lname,email,gender,password,password2} = req.body;
    let errors =[];

    if (password != password2) {
        errors.push({msg:'Password don not match'});        
    }

    if (password.length < 6) {
        errors.push({msg: 'Password must be at least 6 charachter'});        
    }

    if (errors.length > 0) {
        res.render('signup',{
            errors,
            fname,
            lname,
            email,
            gender,
            password,
            password2
        });      
    }else{
        var sql = 'SELECT COUNT(*) as cnt FROM user WHERE email = ?';
            connection.query(sql,email,(error,results,fields)=>{
                if(error) throw error;
                 //checking user
                 if(results[0].cnt){
                    errors.push({msg:'Email already exists'});
                    res.render('signup',{
                        errors,
                        fname,
                        lname,
                        email,
                        gender,
                        password,
                        password2
                    });
                 }else{
                    var users = {
                            "fname": req.body.firstname,
                            "lname": req.body.lastname,
                            "email": req.body.email,
                            "gender": req.body.gender,
                            "password": req.body.password
                        };
                    bcrypt.genSalt(10,(err, salt)=>{
                        if(err) throw err;
                        bcrypt.hash(users.password, salt, (err,hash)=>{
                            if(err) throw err;
                            users.password = hash;
                            connection.query('INSERT INTO user SET ?',users,(err,results,fields)=>{
                                if(err) throw err;
                                req.flash({msg:'You are now registered and can log in'});
                                res.redirect('/app/login');
                            });

                        });
                    });
                 }
            });
    }
     
});

//LOGIN
//POST
//private

router.post('/login',(req,res,next)=>{
    passport.authenticate('local',{
        successRedirect:'/dashboard',
        failureRedirect: '/app/login',
        failureFlash:true
    })(req,res,next);
});

router.get('/logout',(req,res,next)=>{
    req.logout();
    req.flash('success_msg','You are Logged out');
    res.redirect('/app/login');
});

module.exports = router;