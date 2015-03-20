/**
 * Created by zhangran on 15/3/11.
 */

var express = require('express');
var task = require('../controller/').task;

var router = express.Router();

router.get('/', task.list);

router.get('/add/:id', task.add);
router.post('/add', task.addAndSave);

router.get('/edit/:id', task.edit);
router.post('/edit/', task.update);

router.get('/delete/:id', task.remove);

router.get('/detail/:id', task.detail);
router.post('/designation/:id', task.designation);
router.post('/log/:id', task.addLog);
router.post('/progress/:id', task.modifyProgress);
router.post('/upload/:id', task.upload);
router.post('/start/:id', task.start);
router.post('/pause/:id', task.pause);
router.post('/stop/:id', task.stop);
router.post('/complete/:id', task.complete);
router.post('/link/:id', task.link);

module.exports = router;