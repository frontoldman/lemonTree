/**
 * Created by zhangran on 15/3/20.
 */
var express = require('express');
var bug = require('../controller/').bug;

var router = express.Router();

router.get('/add',bug.add);



module.exports = router;