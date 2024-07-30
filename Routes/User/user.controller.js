const router = require("express").Router();
const authChecker = require("../../util/authChecker");
const userService = require('./user.service')


// create A New Data

router.post('/', userService.createUser)

// Login A User

router.post('/login',
    userService.loginUser)

// Get All Data
router.get('/',
    authChecker, userService.getAllData)

// Get Loged In User
router.get('/me',
    authChecker, userService.getCurrentUser)

// Get Single Data
router.get('/:id',
    authChecker, userService.getSingle)

// Search an user
router.get('/search/:id',
    authChecker, userService.searchUser)

// Get Single Data
router.get('/check/:id', userService.checkUser)

// Update Data
router.put('/:id',
    authChecker, userService.updateUser)

// Update Password
router.put('/password/:id',
    authChecker, userService.updatePassword)

// Delete Data
router.delete('/:id',
    authChecker, userService.deleteUser)

// Active An User
router.put('/active/:id',
    authChecker, userService.activeAnUser)
module.exports = router