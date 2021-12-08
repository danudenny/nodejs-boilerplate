const authController = require("../controller/auth.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    // AUTH
    app.post( "/api/signup", authController.signup);
    app.post( "/api/signin", authController.signin);
    app.get( "/confirmation/:token", authController.confirmation);
    app.post( "/api/forgot-password", authController.forgotPassword);
    app.post( "/reset-password/:token", authController.resetPassword);
};
