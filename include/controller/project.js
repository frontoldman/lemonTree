/**
 * Created by zhangran on 15/3/4.
 */
var moment = require('moment');
var Q = require('q');
var project = require('../proxy/').project;
var util = require('../util');

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

    var page = req.param('page');

    if(!page){
        page = 0;
    }else{
        page--;
    }

    page = page < 0 ? 0 : page;

    var perpage = 10;
    var queryQ = Q.all([
        project.findAll({},page,perpage),
        project.count({})
    ]);

    queryQ.done(function(dataList){
        var projects = dataList[0],
            count = dataList[1];

        var total = Math.ceil(count/perpage);

        if(Array.isArray(projects)){

            projects.forEach(function(project){
                project._startTime = util.dateFormat(project.startTime);
                project._endTime = util.dateFormat(project.endTime);
                project.total = util.getWorkingHours(project.startTime,project.endTime);

                var now = new Date();
                project.used = util.getWorkingHours(project.startTime,now);
                var start = now.getTime() < project.startTime.getTime() ? project.startTime : now;
                project.reset = util.getWorkingHours(start,project.endTime);

            });

            res.render('project/list',{
                list:projects,
                pages:{
                    link:'/project',
                    total:total,
                    current:page
                }
            });
        }
    });

    queryQ.fail(function(){
        res.render('project/list',{
            list:[],
            pages:{}
        });
    })


}

module.exports.add = add;
module.exports.list = list;