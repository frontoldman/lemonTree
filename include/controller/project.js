/**
 * Created by zhangran on 15/3/4.
 */
var moment = require('moment');
var project = require('../proxy/').project;

function add(req,res,next){
    var name        = req.param('name'),
        code        = req.param('code'),
        startTime   = req.param('startTime'),
        endTime     = req.param('endTime'),
        description = req.param('description');

    if(!name || !startTime || !endTime){
        res.render('project/add',{
            message:'必填项不能不填啊'
        });
    }

    var promise = project.addOne({
        name        : name,
        code        : code,
        startTime   : moment(startTime),
        endTime     : moment(endTime),
        description : description
    });

    promise.then(function(projectItem){
        res.send('添加成功');
    },function(){
        res.send('添加失败');
    });

};

module.exports.add = add;