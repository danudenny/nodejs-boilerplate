const categoryController = require("../controller/category.controller");
const authGuard = require("../middleware/authGuard.js")

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // Category
  app.get( "/api/categories", authGuard, categoryController.list);
  app.post( "/api/categories/create", authGuard, categoryController.create);
  app.get( "/api/categories/:id", authGuard, categoryController.find);
  app.put( "/api/categories/:id/update", authGuard, categoryController.update);
  app.put( "/api/categories/:id/activate", authGuard, categoryController.activate);
  app.put( "/api/categories/:id/nonactivate", authGuard, categoryController.nonactivate);
  app.put( "/api/categories/:id/parent", authGuard, categoryController.parent);
  app.put( "/api/categories/:id/child", authGuard, categoryController.child);
  app.delete( "/api/categories/:id/delete", authGuard, categoryController.delete);

};
