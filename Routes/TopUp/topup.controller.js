const router = require('express').Router();
const { admin } = require('../User/user.role');
const workService = require('./topup.service')
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
        // const user = req.user
        // if (user.role !== admin) {
        //    return res.status(400).send({
        //         message: "You are not authorized to access this route"
        //     });
        // }
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

// Reject data

router.put('/accept/:id', async (req, res) => {
    try {
        const response = await workService.rejectWithdraw(req.params.id);
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