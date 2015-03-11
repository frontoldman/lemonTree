/**
 * Created by zhangran on 15/3/11.
 */

var express = require('express');
var task = require('../controller/').task;

var router = express.Router();

router.get('/add/:id',task.add);

module.exports = router;