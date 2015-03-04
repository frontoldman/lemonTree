/**
 * Created by zhangran on 15/3/4.
 */

var project = require('../proxy/').project;

function add(req,res,next){
    var name        = req.param('name'),
        code        = req.param('code'),
        startTime   = req.param('startTime'),
        endTime     = req.param('endTime'),
        description = req.param('description');

    var promise = project.addOne({
        name        : name,
        code        : code,
        startTime   : startTime,
        endTime     : endTime,
        description : description
    });

    promise.then(function(projectItem){
        res.send('添加成功');
    },function(){
        res.send('添加失败');
    });

};

module.exports.add = add;