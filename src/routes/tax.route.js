const taxController = require("../controller/tax.controller");
const authGuard = require("../middleware/authGuard.js")

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // Taxes
  app.get( "/api/taxes", authGuard, taxController.list);
  app.post( "/api/taxes/create", authGuard, taxController.create);
  app.get( "/api/taxes/:id", authGuard, taxController.find);
  app.put( "/api/taxes/:id/update", authGuard, taxController.update);
  app.delete( "/api/taxes/:id/delete", authGuard, taxController.delete);

};
