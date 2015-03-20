/**
 * Created by zhangran on 15/3/20.
 */
var express = require('express');
var bug = require('../controller/').bug;

var router = express.Router();

router.get('/add', bug.add);
router.post('/add', bug.addAndSave);

router.get('/', bug.list);
router.get('/edit/:id',bug.edit);
router.post('/edit/',bug.update);

module.exports = router;