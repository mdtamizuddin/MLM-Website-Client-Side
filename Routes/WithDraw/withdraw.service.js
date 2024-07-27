const User = require("../User/user.model");
const Withdraw = require("./withdraw.model");

const createWithDraw = async (data) => {
    try {
        const { amount, user } = data
        const userData = await User.findById(user);
        if (!userData) {
            throw new Error("User not found")
        }
        if (amount < 400) {
            throw new Error("Withdraw amount must be greater than 400")
        }
        if (amount > userData.balance) {
            throw new Error("Insufficient balance")
        }

        const withDraw = new Withdraw(data);
        await withDraw.save();
        // deduct amount from user balance
        userData.balance = userData.balance - amount;
        await userData.save();
        return withDraw
    } catch (error) {
        throw new Error(error)
    }
}
// get all data

const getAllData = async (query) => {
    try {
        const page = parseInt(query.page) || 1;
        const limit = parseInt(query.limit) || 50;
        const skip = (page - 1) * limit;
        const filters = {};
        if (query.status) {
            filters.status = query.status
        }
        const withDraws = await Withdraw.find(filters)
            .skip(skip)
            .limit(limit);
        const total = await Withdraw.countDocuments();
        return {
            data: withDraws,
            total,
            page,
            pages: Math.ceil(total / limit)
        }
    } catch (error) {
        throw new Error(error)
    }
}
// get single data

const getSingle = async (id) => {
    try {
        const withDraw = await Withdraw.findById(id);
        return withDraw
    } catch (error) {
        throw new Error(error)
    }
}
// update data
const updateData = async (id, data) => {
    try {
        const withDraw = await Withdraw.findByIdAndUpdate(id, data, { new: true });
        return withDraw
    } catch (error) {
        throw new Error(error)
    }
}
// delete data
const deleteData = async (id) => {
    try {
        const withDraw = await Withdraw.findByIdAndDelete(id);
        return withDraw
    } catch (error) {
        throw new Error(error)
    }
}

module.exports = {
    createWithDraw,
    getAllData,
    getSingle,
    updateData,
    deleteData
}