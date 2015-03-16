/**
 * Created by zhangran on 15/3/16.
 */
var express = require('express');
var office = require('../controller/').office;

var router = express.Router();

router.get('/add',office.addOffice);
router.post('/add',office.addAndSave);

module.exports = router;