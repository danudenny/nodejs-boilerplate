const userController = require("../controller/user.controller");
const authGuard = require("../middleware/authGuard.js")

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // Users
  app.get( "/api/users", authGuard, userController.list);
  app.get( "/api/users/:id", authGuard, userController.find);
  app.put( "/api/users/:id/update", authGuard, userController.update);
  app.delete( "/api/users/:id/delete", authGuard, userController.delete);
  app.delete( "/api/users/delete-all", authGuard, userController.deleteAll);
};
