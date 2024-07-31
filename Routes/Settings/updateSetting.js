const Setting = require("./setting.model");

const updateSetting = async (data) => {
    try {
        const setting = await Setting.findByIdAndUpdate('66a4a094c8d1fd11daac6c28', data, { new: true });
        if (!setting) {
            return {
                success: false,
                message: "Setting not found"
            }
        }
        return {
            success: true,
            setting
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}
module.exports = updateSetting