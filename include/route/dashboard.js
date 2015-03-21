/**
 * Created by zhangran on 15/3/3.
 */
var express = require('express');
var dashboard = require('../controller/').dashboard;

var router = express.Router();

router.get('/', dashboard.index);

module.exports = router;