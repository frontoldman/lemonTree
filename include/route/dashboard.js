/**
 * Created by zhangran on 15/3/3.
 */
var express = require('express');
var user = require('../controller/').user;

var router = express.Router();

router.get('/',function(req,res){
    res.render('dashboard');
});

module.exports = router;