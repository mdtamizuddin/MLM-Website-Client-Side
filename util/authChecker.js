const User = require("../Routes/User/user.model");
const jwt = require("jsonwebtoken");

const authChecker = async (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(401).send({
            message: "Unauthorized"
        });
    }
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
        return res.status(401).send({
            message: "Unauthorized"
        });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
        return res.status(401).send({
            message: "Unauthorized"
        });
    }
    const user = await User.findOne({ _id: decoded.id })
        .populate("reffer")
        .select("-password");
    if (!user) {
        return res.status(401).send({
            message: "Unauthorized"
        });
    }
    req.user = user;
    next();
};

module.exports = authChecker;