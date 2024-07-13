const saltGenerator = require("../../util/saltGenerator");
const tokenGenerator = require("../../util/tokenGenerator");
const User = require("./user.model");
const bcrypt = require("bcrypt");
const createUser = async (req, res) => {
    try {
        const isExist = await User.findOne({ email: req.body.email, username: req.body.username });
        if (isExist) {
            return res.status(400).send({
                message: "User already exist"
            });
        }
        if (req.body.reffer !== "") {
            const refferUser = await User.findOne({ username: req.body.reffer });
            if (!refferUser) {
                return res.status(404).send({
                    message: "Reffer user not found"
                });
            }
            req.body.reffer = refferUser._id;
        }
        else {
            delete req.body.reffer;
        }
        req.body.password = await saltGenerator(req.body.password);
        req.body.time = new Date(req.body.time);
        const user = new User(req.body);
        await user.save();
        const token = tokenGenerator(user);
        res.send({
            message: "User created successfully",
            token
        });
    } catch (error) {
        res.status(400).send(error.message);
    }
}
const loginUser = async (req, res) => {
    try {
        const user = await User.findOne({
            $or: [
                {
                    email: req.body.email
                },
                {
                    username: req.body.email
                }
            ]
        });
        if (!user) {
            return res.status(400).send({
                message: "User not found"
            });
        }
        const isSame = await bcrypt.compare(req.body.password, user.password);
        if (!isSame) {
            return res.status(400).send({
                message: "Password is incorrect"
            });
        }
        const token = tokenGenerator(user);
        res.send({
            message: "Login successful",
            token
        });
    } catch (error) {
        res.status(400).send({
            message: error.message
        });
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
        const token = tokenGenerator(req.user);
        res.send({
            users,
            total,
            page,
            pages: Math.ceil(total / limit),
            token
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
            return res.status(400).send({
                message: "User not found"
            });
        }
        const newPassword = await saltGenerator(req.body.new);

        const oldPassword = req.body.old;

        const isSame = await bcrypt.compare(oldPassword, user.password);
        if (!isSame) {
            return res.status(400).send({
                message: "Old password is incorrect"
            });
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

const getCurrentUser = async (req, res) => {
    res.send(req.user);
}
const checkUser = async (req, res) => {
    try {

        const user = await User.findOne({ username: req.params.id });
        if (!user) {
            res.send({
                message: "Username Available",
                status: true
            })
        }
        else {
            res.send({
                message: "Username Not Available",
                status: false
            })
        }
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
    updatePassword,
    loginUser,
    getCurrentUser,
    checkUser
}