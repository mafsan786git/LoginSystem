const localStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const mysql = require('mysql');

const connection = require('./database');

module.exports = function (passport) {
    passport.use(
        new localStrategy(
            {usernameField:'email',
            passwordField:'password'
            },
            (email, password, done)=>{
                var sql = 'SELECT * FROM user WHERE email = ?';
                connection.query(sql,email,(error,results,fields)=>{
                    if(error) throw error;
                    //Match user
                    if(!results.length)
                        return done(null, false, {message:'That email is not register'});

                    //Match
                    bcrypt.compare(password,results[0].password,(err,isMatch)=>{
                        if(err) throw err;
                        if (isMatch) {
                            console.log(results[0]);
                            console.log('every thing is fine');
                            
                            //return done(null,results[0]);
                        }else{
                            return done(null, false, {message:'Password incorrect'});
                        }
                    });
                });
            })
    );

    //serializeuser
    passport.serializeUser(function (user,done) {
        console.log(user.id);
        done(null,user.id);
    });

    //deserializeuser
    passport.deserializeUser(function (id,done) {
        connection.query('SELECT * FROM user WHERE id = ?',id,(err,results,fields)=>{
            done(err,results[0]);
        });
    });

};
