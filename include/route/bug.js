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

router.get('/detail/:id',bug.detail);
router.get('/delete/:id',bug.remove);

router.post('/designation/:id',bug.designation);
router.post('/complete/:id',bug.complete);
router.post('/close/:id',bug.close);
router.post('/log/:id',bug.addLog);
router.post('/open/:id',bug.open);

module.exports = router;