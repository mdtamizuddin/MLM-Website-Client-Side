const Refer = require("./refer.model");

const createRefer = async (data) => {
    try {
        const refer = new Refer(data);
        await refer.save();
        return refer
    } catch (error) {
        throw new Error(error)
    }
}
const getReferHintory = async (user, gen) => {
    try {
        const refer = await Refer.find({ reffer: user, gen: gen })
        .sort({ createdAt: -1 })
        .populate("user", "-password");
        return refer
    } catch (error) {
        throw new Error(error)
    }
}
const getAll = async (user, gen) => {
    try {
        const refer = await Refer.find()
        .sort({ createdAt: -1 })
        .populate("user", "-password");
        return refer
    } catch (error) {
        throw new Error(error)
    }
}
const getAllRefer = async (user) => {
    try {
        const refer = await Refer.find({ reffer: user })
        .sort({ createdAt: -1 })
        .populate("user", "name email phone")
        .populate("reffer", "name email phone");
        return refer
    } catch (error) {
        throw new Error(error)
    }
}
const statistic = async (user) => {
    try {
        const gen1 = await Refer.countDocuments({ reffer: user, gen: 1 });
        const gen2 = await Refer.countDocuments({ reffer: user, gen: 2 });
        const gen3 = await Refer.countDocuments({ reffer: user, gen: 3 });
        const gen4 = await Refer.countDocuments({ reffer: user, gen: 4 });
        const gen5 = await Refer.countDocuments({ reffer: user, gen: 5 });
        const gen6 = await Refer.countDocuments({ reffer: user, gen: 6 });
        return { gen1, gen2, gen3, gen4, gen5, gen6 }
    } catch (error) {
        throw new Error(error) 
    }
}
module.exports = {
    createRefer,
    getReferHintory,
    getAllRefer,
    statistic,
    getAll
}