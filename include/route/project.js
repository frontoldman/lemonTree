/**
 * Created by zhangran on 15/3/4.
 */
var express = require('express');
var router = express.Router();

var project = require('../controller/').project;

router.get('/',project.list);

router.get('/add',function(req,res){
    res.render('project/add');
});

router.post('/add',project.add);

router.get('/edit/:id',project.edit);
router.post('/edit',project.update);

module.exports = router;