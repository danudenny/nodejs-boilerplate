const express = require('express');
const bodyParser = require('body-parser');
const pino = require('pino')
const logger = pino({
    prettyPrint: true
})

const app = express();
require('dotenv').config()
const port = process.env.PORT || 3000

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

const db = require("./database/models");
db.sequelize.sync({ force: true})

// Routes
require('./src/routes/user.route')(app);
require('./src/routes/auth.route')(app);
require('./src/routes/category.route')(app);
require('./src/routes/tax.route')(app);
require('./src/routes/province.route')(app);
require('./src/routes/city.route')(app);
require('./src/routes/district.route')(app);

app.listen(port, () => logger.info(`App started on http://localhost:${port}`))
