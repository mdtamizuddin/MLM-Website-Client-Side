const router = require("express").Router();


// user Router
router.use('/user', require('./User/user.controller'))
router.use('/work', require('./Works/work.controller'))
router.use('/withdraw', require('./WithDraw/withdraw.controller'))

module.exports = router