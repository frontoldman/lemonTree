/**
 * Created by zhangran on 15/3/4.
 */
var express = require('express');
var router = express.Router();

var project = require('../controller/').project;

router.get('/', project.list);

router.get('/add', function (req, res) {
    res.render('project/add');
});

router.post('/add', project.add);

router.get('/edit/:id', project.edit);
router.post('/edit', project.update);

router.get('/detail/:id', project.detail);
router.post('/progress/:id', project.modifyProgress);
router.post('/start/:id', project.start);
router.post('/complete/:id', project.complete);
router.post('/close/:id', project.close);
router.post('/pause/:id', project.pause);

router.get('/delete/:id', project.remove);

router.get('/members/:id', project.getMembers);

router.get('/members/edit/:id', project.editMembers);
router.post('/members/edit/', project.updateMembers);

module.exports = router;