/**
 * Created by zhangran on 15/2/27.
 */
var express = require('express');
var user = require('../controller/').user;

var router = express.Router();

/* GET home page. */
router.get('/register', function (req, res) {
    res.render('register');
});

router.post('/register', user.addUser);

module.exports = router;