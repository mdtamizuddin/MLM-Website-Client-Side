const saltGenerator = require("../../util/saltGenerator");
const User = require("./user.model");

const createUser = async (req, res) => {
    try {
        const isExist = await User.findOne({ email: req.body.email, username: req.body.username });
        if (isExist) {
            res.status(400).send("User already exists");
        }
        if (req.body.reffer) {
            const refferUser = await User.findOne({ username: req.body.reffer });
            if (!refferUser) {
                res.status(400).send("Reffer user not found");
            }
            req.body.reffer = refferUser._id;
        }
        req.body.password = await saltGenerator(req.body.password);
        req.body.time = new Date(req.body.time);
        const user = new User(req.body);
        await user.save();
        res.sand({
            message: "User created successfully",
            user: user
        });
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const getAllData = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    try {
        const users = await User.find()
            .select("-password")
            .populate("reffer")
            .skip(skip)
            .limit(limit);
        const total = await User.countDocuments();
        res.send({
            users,
            total,
            page,
            pages: Math.ceil(total / limit)
        });
    } catch (error) {
        res.status(400).send(error.message);
    }
}
const getSingle = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .select("-password")
            .populate("reffer");
        if (!user) {
            res.status(400).send("User not found");
        }
        res.send(user);
    } catch (error) {
        res.status(400).send(error.message);
    }
}
const updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!user) {
            res.status(400).send("User not found");
        }
        res.send({
            message: "User updated successfully",
            user: user
        });
    } catch (error) {
        res.status(400).send(error.message);
    }
}
const updatePassword = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            res.status(400).send("User not found");
        }
        const newPassword = await saltGenerator(req.body.password);
        const oldPassword = req.body.password;
        const isSame = await bcrypt.compare(oldPassword, user.password);
        if (!isSame) {
            res.status(400).send("Old password is incorrect");
        }
        user.password = newPassword;
        await user.save();
        res.send({
            message: "Password updated successfully",
        });
    } catch (error) {
        res.status(400).send(error.message);
    }
}
const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        res.send({
            message: "User deleted successfully",
        });
    } catch (error) {
        res.status(400).send(error.message);
    }
}
module.exports = {
    createUser,
    getAllData,
    getSingle,
    updateUser,
    deleteUser,
    updatePassword
}