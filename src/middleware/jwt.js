const jwt = require('jsonwebtoken');
const { error } = require("./responseApi");

const verifyToken = (req, res, next) => {
    const token = req.header('auth-token')
    if (!token) {
        res
            .status(401)
            .json(error("Unauthenticated!", res.statusCode));
    }
    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET)
        req.user = verified
        next()
    } catch (err) {
        res
            .status(400)
            .json(error("Token not Valid!", err.message, res.statusCode));
    }
}

module.exports = verifyToken;
