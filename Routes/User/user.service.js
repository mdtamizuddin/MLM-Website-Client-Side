const saltGenerator = require("../../util/saltGenerator");
const tokenGenerator = require("../../util/tokenGenerator");
const { createRefer } = require("../Refer/refer.service");
const getSetting = require("../Settings/getSetting");
const Setting = require("../Settings/setting.model");
const Withdraw = require("../WithDraw/withdraw.model");
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
            // add referer 1 account balance here
            await User.findByIdAndUpdate(refferUser._id, {
                balance: refferUser.balance + 1
            })
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
        res.status(400).send({
            message: error.message
        });
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
    const filters = {};
    if (req.query.status) {
        filters.status = req.query.status
    }
    if (req.query.search) {
        filters.$or = [
            {
                username: {
                    $regex: req.query.search,
                    $options: "i"
                }
            },
            {
                name: {
                    $regex: req.query.search,
                    $options: "i"
                }
            },
            {
                email: {
                    $regex: req.query.search,
                    $options: "i"
                }
            }
        ]
    }
    if (req.query.admin) {
        filters.role = "admin"
    }
    else {
        filters.role = "user"
    }
    try {
        const users = await User.find(filters)
            .select("-password")
            .populate("reffer", "-password")
            .skip(skip)
            .sort({ createdAt: req.query.reverse ? -1 : 1 })
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
        res.status(500).send({
            message: error.message
        });
    }
}
const getSingle = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .select("-password")
            .populate("reffer", "-password");
        if (!user) {
            res.status(400).send("User not found");
        }
        res.send(user);
    } catch (error) {
        res.status(400).send({
            message: error.message
        });
    }
}
const searchUser = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.id })
            .select("-password")
            .populate("reffer", "-password");
        const data = {
            user,
            success: false
        }
        if (user) {
            data.success = true
        }
        res.send(data);
    } catch (error) {
        res.status(400).send({
            message: error.message
        });
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
        res.status(500).send({
            message: error.message
        });
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
        res.status(500).send({
            message: error.message
        });
    }
}
const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        res.send({
            message: "User deleted successfully",
        });
    } catch (error) {
        res.status(500).send({
            message: error.message
        });
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
        res.status(500).send({
            message: error.message
        });
    }
}
const activeAnUser = async (req, res) => {
    try {
        const setting = await Setting.findById('66a4a094c8d1fd11daac6c28');
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(400).send({
                message: "User not found"
            });
        }
        user.status = "active";
        await user.save();
        if (user.reffer) {
            const inGen1 = await createRefer({ user: user._id, reffer: user.reffer, gen: 1, commition: setting.ref_comm.gen1 });
            const refferUser = await User.findById(user.reffer);
            refferUser.balance = refferUser.balance + setting.ref_comm.gen1;
            await refferUser.save();
            // check 2nd Generation is available ?
            if (refferUser.reffer) {
                const inGen2 = await createRefer({ user: user._id, reffer: refferUser.reffer, gen: 2, commition: setting.ref_comm.gen2 });
                const refferUser2 = await User.findById(refferUser.reffer);
                refferUser2.balance = refferUser2.balance + setting.ref_comm.gen2;
                await refferUser2.save();
                // check 3rd Generation is available ?
                if (refferUser2.reffer) {
                    const inGen3 = await createRefer({ user: user._id, reffer: refferUser2.reffer, gen: 3, commition: setting.ref_comm.gen3 });
                    const refferUser3 = await User.findById(refferUser2.reffer);
                    refferUser3.balance = refferUser3.balance + setting.ref_comm.gen3;
                    await refferUser3.save();
                    // check 4th Generation is available ?
                    if (refferUser3.reffer) {
                        const inGen4 = await createRefer({
                            user: user._id, reffer: refferUser3.reffer, gen: 4,
                            commition: setting.ref_comm.gen4
                        });
                        const refferUser4 = await User.findById(refferUser3.reffer);
                        refferUser4.balance = refferUser4.balance + setting.ref_comm.gen4;
                        await refferUser4.save();
                        // check 5th Generation is available ?
                        if (refferUser4.reffer) {
                            const inGen5 = await createRefer({
                                user: user._id,
                                reffer: refferUser4.reffer,
                                gen: 5,
                                commition: setting.ref_comm.gen5
                            });
                            const refferUser5 = await User.findById(refferUser4.reffer);
                            refferUser5.balance = refferUser5.balance + setting.ref_comm.gen5;
                            await refferUser5.save();
                            // check 6th Generation is available ?
                            if (refferUser5.reffer) {
                                const inGen6 = await createRefer({
                                    user: user._id,
                                    reffer: refferUser5.reffer, gen: 6,
                                    commition: setting.ref_comm.gen6
                                });
                                const refferUser6 = await User.findById(refferUser5.reffer);
                                refferUser6.balance = refferUser6.balance + setting.ref_comm.gen6;
                                await refferUser6.save();
                            }
                        }
                    }

                }
            }
        }
        res.send({
            message: "User activated successfully",
        });
    } catch (error) {
        res.status(500).send({
            message: error.message
        });
    }
}
const getStatistic = async (req, res) => {
    try {
        const total = User.countDocuments();
        const active = User.countDocuments({ status: "active" });
        const pending = User.countDocuments({ status: "pending" });
        const blocked = User.countDocuments({ lock: true });
        const total_withdraw = Withdraw.countDocuments({ status: "completed" });
        res.send({
            total,
            active,
            pending,
            blocked,
            total_withdraw
        });
    } catch (error) {
        res.status(500).send({
            message: error.message
        });
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
    checkUser,
    activeAnUser,
    searchUser,
    getStatistic
}