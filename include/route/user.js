/**
 * Created by zhangran on 15/2/27.
 */
var express = require('express');
var user = require('../controller/').user;

var router = express.Router();

/* GET home page. */
router.get('/register', function(req,res,next){
    res.render('user/register');
});

router.post('/register', user.addUser);

router.get('/login', user.loginGet);

router.post('/login',user.login);

router.get('/',user.userList);

router.get('/logout',user.logout);

router.get('/users',user.users);

router.get('/add',user.addGet);

router.post('/add',user.addFresh);

module.exports = router;