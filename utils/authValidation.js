const jwt = require("jsonwebtoken");

const generateToken = (userId) => {
    const secret = process.env.JWT_SECRET || "dftyghujitrewssedrftgyhuj87654sdcvbt";
    return jwt.sign({ userId }, secret, { expiresIn: "1d" });
};

const verifyToken = (token) => {
    const secret = process.env.JWT_SECRET || "dftyghujitrewssedrftgyhuj87654sdcvbt";
    try {
        return jwt.verify(token, secret);
    } catch (err) {
        return null;
    }
};

const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ msg: "No token provided" });
    }
    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);
    if (!decoded) {
        return res.status(401).json({ msg: "Invalid token" });
    }
    req.user = decoded;
    next();
};

module.exports = { generateToken, verifyToken, authenticate };