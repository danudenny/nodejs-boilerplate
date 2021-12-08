const cityController = require("../controller/city.controller");
const authGuard = require("../middleware/authGuard.js")

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // Provinces
  app.get( "/api/cities", authGuard, cityController.list);
  app.post( "/api/cities/create", authGuard, cityController.create);
  app.get( "/api/cities/:id", authGuard, cityController.find);
  app.put( "/api/cities/:id/update", authGuard, cityController.update);
  app.delete( "/api/cities/:id/delete", authGuard, cityController.delete);

};
