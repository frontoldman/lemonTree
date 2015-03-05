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
        status      : 1,
        progress    : 0,
        startTime   : moment(startTime),
        endTime     : moment(endTime),
        description : description,
        createTime  : new Date(),
        createUser  : req.session.user._id
    });

    promise.then(function(projectItem){
        res.redirect('/project/');
    },function(){
        res.send('添加失败');
    });

};

function list(req,res,next){

    project.findAll()
        .then(function(projects){
            if(Array.isArray(projects)){
                res.render('project/list',{
                    list:projects
                });
            }
        },function(){
            res.render('project/list',{
                list:[]
            });
        });


}

module.exports.add = add;
module.exports.list = list;