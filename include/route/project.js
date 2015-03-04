/**
 * Created by zhangran on 15/3/4.
 */
var express = require('express');

var router = express.Router();

router.get('/',function(req,res){
    res.render('project/list',{
        user:req.session.user
    });
});

module.exports = router;