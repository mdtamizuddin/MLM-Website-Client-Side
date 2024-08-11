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
        await User.findByIdAndUpdate(user, {
            $inc: { balance: -amount }
        })
        // userData.balance = userData.balance - amount;
        // await userData.save();
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
        if (query.user) {
            filters.user = query.user
        }
        const start = new Date(query.search);
        if (query.search) {
            filters.createdAt = {
                $gte: start,
                $lt: new Date(start.getTime() + 24 * 60 * 60 * 1000)
            }
        }
        const withDraws = await Withdraw.find(filters)
            .populate("user", "-password")
            .sort({ createdAt: query.reverse ? -1 : 1 })
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
        const withDraw = await Withdraw.findById(id)
            .populate("user", "-password")
            .exec();
        return withDraw
    } catch (error) {
        throw new Error(error)
    }
}
// update data
const updateData = async (id, data) => {
    try {
        await Withdraw.findByIdAndUpdate(id, data, { new: true });
        return {
            message: "Data updated successfully",
        }
    } catch (error) {
        throw new Error(error)
    }
}
// Reject data
const rejectWithdraw = async (id) => {
    try {
        const data = await Withdraw.findById(id);
        if (!data) {
            throw new Error("Data not found")
        }
        data.status = "rejected"
        await data.save();
        await User.findByIdAndUpdate(data.user, {
            $inc: { balance: data.amount }
        })
        return data
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
    deleteData,
    rejectWithdraw
}