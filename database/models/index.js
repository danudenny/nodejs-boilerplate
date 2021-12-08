const Sequelize = require('sequelize');
const envConfigs =  require('../config/config');

const env = process.env.NODE_ENV || 'development';
const config = envConfigs[env];
const db = {};

let sequelize;
if (config.url) {
  sequelize = new Sequelize(config.url, config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.users = require("./User.js")(sequelize, Sequelize);
db.verification_tokens = require("./VerificationToken.js")(sequelize, Sequelize);
db.categories = require("./Category.js")(sequelize, Sequelize);
db.cities = require("./City.js")(sequelize, Sequelize);
db.districts = require("./District.js")(sequelize, Sequelize);
db.provinces = require("./Province.js")(sequelize, Sequelize);
db.taxes = require("./Tax.js")(sequelize, Sequelize);
db.products = require("./Product.js")(sequelize, Sequelize);
db.attributes = require("./Attribute.js")(sequelize, Sequelize);
db.product_attributes = require("./ProductAttribute.js")(sequelize, Sequelize);
db.documents = require("./Document.js")(sequelize, Sequelize);
db.user_documents = require("./UserDocument.js")(sequelize, Sequelize);
db.catalog_images = require("./CatalogImage.js")(sequelize, Sequelize);
db.product_images = require("./ProductImage.js")(sequelize, Sequelize);
db.dimensions = require("./Dimension.js")(sequelize, Sequelize);
db.partners = require("./Partner.js")(sequelize, Sequelize);
db.locations = require("./Location.js")(sequelize, Sequelize);

module.exports = db;
