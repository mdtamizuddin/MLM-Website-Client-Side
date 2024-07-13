const router = require("express").Router();
const userService = require('./user.service')


// create A New Data

router.post('/', userService.createUser)

// Get All Data
router.get('/', userService.getAllData)

// Get Single Data
router.get('/:id', userService.getSingle)

// Update Data
router.put('/:id', userService.updateUser)

// Update Password
router.put('/password/:id', userService.updatePassword)

// Delete Data
router.delete('/:id', userService.deleteUser)

module.exports = router