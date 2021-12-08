const districtController = require("../controller/district.controller");
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
  app.get( "/api/districts", authGuard, districtController.list);
  app.post( "/api/districts/create", authGuard, districtController.create);
  app.get( "/api/districts/:id", authGuard, districtController.find);
  app.put( "/api/districts/:id/update", authGuard, districtController.update);
  app.delete( "/api/districts/:id/delete", authGuard, districtController.delete);

};
