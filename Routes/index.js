const router = require("express").Router();


// user Router
router.use('/user', require('./User/user.controller'))

module.exports = router