const provinceController = require("../controller/province.controller");
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
  app.get( "/api/provinces", authGuard, provinceController.list);
  app.post( "/api/provinces/create", authGuard, provinceController.create);
  app.get( "/api/provinces/:id", authGuard, provinceController.find);
  app.put( "/api/provinces/:id/update", authGuard, provinceController.update);
  app.delete( "/api/provinces/:id/delete", authGuard, provinceController.delete);

};
