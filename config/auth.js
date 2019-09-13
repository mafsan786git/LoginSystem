
module.exports = {
    ensureAuthenticated: function (req,res,next) {
        if (req.isAuthenticated()) {
            return next();
        }   
        req.flash('error_msg','Please log in to view the Home page');
        res.redirect('/app/login');     
    },
    forwardAuthenticated: function (req,res,next) {
        if (!req.isAuthenticated()) {
            return next();
        }
        res.redirect('/dashboard');
        
    }
};