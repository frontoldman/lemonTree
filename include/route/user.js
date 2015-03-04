/**
 * Created by zhangran on 15/2/27.
 */
var express = require('express');
var user = require('../controller/').user;

var router = express.Router();

/* GET home page. */
router.get('/register', function (req, res) {
    res.render('user/register',{message:''});
});

router.post('/register', user.addUser);

router.get('/login', function (req, res) {
    res.render('user/login',{message:''});
});

router.post('/login',user.login);

router.get('/list',user.userList);

router.get('/logout',user.logout);

module.exports = router;