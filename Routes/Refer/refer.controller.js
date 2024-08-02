const router = require("express").Router();
const referService = require("./refer.service");
router.get("/user/:id", async (req, res) => {
    try {
        const response = await referService.getAllRefer(req.params.id);
        res.send(response);
    } catch (error) {
        res.status(500).send({
            message: error.message
        });
    }
})
router.get('/gen', async (req, res) => {
    try {
        const { gen, user } = req.query
        const response = await referService.getReferHintory(user, gen);
        res.send(response);
    } catch (error) {
        res.status(500).send({
            message: error.message
        });
    }
})
router.get('/statistic', async (req, res) => {
    try {
        const { _id } = req.user
        const response = await referService.statistic(_id);
        res.send(response);
    } catch (error) {
        res.status(500).send({
            message: error.message
        });
    }
})


module.exports = router