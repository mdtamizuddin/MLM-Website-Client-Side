const router = require('express').Router();
const workService = require('./withdraw.service')
router.post('/', async (req, res) => {
    try {
        const response = await workService.createWithDraw(req.body);
        res.send(response);
    } catch (error) {
        res.status(500).send({
            message: error.message
        });
    }
})
router.get('/', async (req, res) => {
    try {
        const response = await workService.getAllData(req.query);
        res.send(response);
    } catch (error) {
        res.status(500).send({
            message: error.message
        });
    }
})
// get Single 

router.get('/:id', async (req, res) => {
    try {
        const response = await workService.getSingle(req.params.id);
        res.send(response);
    } catch (error) {
        res.status(500).send({
            message: error.message
        });
    }
})

// update data

router.put('/:id', async (req, res) => {
    try {
        const response = await workService.updateData(req.params.id, req.body);
        res.send(response);
    } catch (error) {
        res.status(500).send({
            message: error.message
        });
    }
})
// delete data
router.delete('/:id', async (req, res) => {
    try {
        const response = await workService.deleteData(req.params.id);
        res.send(response);
    } catch (error) {
        res.status(500).send({
            message: error.message
        });
    }
})
module.exports = router