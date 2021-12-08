const jwt = require('jsonwebtoken');
const { unauth } = require("../middleware/responseApi");

module.exports = (req, res, next) => {

    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userData = decoded;
        next();
    } catch (err) {
        res
            .status(401)
            .json(unauth("Auth Failed! No token provided"));
    }
}
