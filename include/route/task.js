/**
 * Created by zhangran on 15/3/11.
 */

var express = require('express');
var task = require('../controller/').task;

var router = express.Router();

router.get('/',task.list);

router.get('/add/:id',task.add);
router.post('/add',task.addAndSave);

router.get('/edit/:id',task.edit);
router.post('/edit/',task.update);

module.exports = router;