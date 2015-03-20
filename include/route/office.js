/**
 * Created by zhangran on 15/3/16.
 */
var express = require('express');
var office = require('../controller/').office;

var router = express.Router();

router.get('/add', office.addOffice);
router.post('/add', office.addAndSave);

router.get('/', office.list);
router.get('/edit/:id', office.edit);
router.post('/edit', office.editAndSave);
router.get('/delete/:id', office.remove);

module.exports = router;