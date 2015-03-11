/**
 * Created by zhangran on 15/3/11.
 */
var Q = require('q');
var moment = require('moment');
var task = require('../proxy/').task;
var user = require('../proxy/').user;
var project = require('../proxy/').project;
var util = require('../util');

function add(req,res,next){
    var id = req.param('id');
    res.render('task/add',{
        id:id
    });
}

function addAndSave(req,res,next){
    var id = req.param('id'),
        name = req.param('name'),
        level = req.param('level'),
        startTime = req.param('startTime'),
        endTime = req.param('endTime'),
        assignerId = req.param('assignerId'),
        description = req.param('description');

    var promise = task.addOne({
        name : name ,
        level : level,
        startTime : moment(startTime) ,
        endTime : moment(endTime) ,
        description : description ,
        assigner : assignerId,
        project : id,
        adder : req.session.user._id,
        addTime : new Date()
    });

    promise.then(function(){
        res.redirect('/task/');
    },function(){
        next();
    });
}

function list(req,res,next){

    var page = req.param('page');
    var taskStatus = VARS.config.taskStatus;

    if(!page){
        page = 0;
    }else{
        page--;
    }

    page = page < 0 ? 0 : page;

    var perpage = 10;
    var queryQ = Q.all([
        task.findAll({},page,perpage),
        task.count({})
    ]);

    queryQ.then(function(data){

        var total = Math.ceil(data[1]/perpage);

        var taskList = data[0];

        if(Array.isArray(taskList)){

            var getNamesQAry = [];

            taskList.forEach(function(task){
                task._startTime = util.dateFormat(task.startTime);
                task._endTime = util.dateFormat(task.endTime);
                task._status = taskStatus[task.status];
                task._addTime = util.dateFormat(task.addTime);


                getNamesQAry.push(project.findOne({_id:task.project}));
                getNamesQAry.push(user.findOne({_id:task.assigner}));
                getNamesQAry.push(user.findOne({_id:task.adder}));


            });

            Q.all(getNamesQAry)
                .then(function(data){

                    for(var i = 0;i<data.length;i+=3){
                        taskList[i/3]._project = data[i];
                        taskList[i/3]._assigner = data[i+1];
                        taskList[i/3]._adder = data[i+2];
                    }

                    res.render('task/list',{
                        list  : taskList,
                        pages : {
                            link:'/task',
                            total:total,
                            current:page+1 > total ? total : page
                        }
                    });
                });




        }else{
            res.render('task/list',{
                list : [],
                pages:{
                    link:'/task',
                    total:0,
                    current:1
                }
            })
        }


    });

}

function edit(req,res,next){

    var id = req.param('id');

    res.render('task/edit',{
        id:id
    });
}

function update(req,res,next){

}

module.exports.add = add;
module.exports.addAndSave = addAndSave;
module.exports.list = list;
module.exports.edit = edit;
module.exports.update = update;