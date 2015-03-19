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
        log : [{
            operator:req.session.user._id,
            time:new Date(),
            operation:VARS.config.logOperation.create,
            note:''
        }],
        adder : req.session.user._id,
        addTime : new Date()
    });

    promise.then(function(){
        res.redirect('/task/');
    },function(){
        next();
    });

    project.findOne({_id:id})
        .then(function(projectItem){
            var log = projectItem.log;
            log.push({
                operator:req.session.user._id,
                time:new Date(),
                operation:VARS.config.projectOperation.addTask,
                note:'新增任务'
            })
            project.update({
                _id:id,
                log:log
            })
        })
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

    var condition = {
        assigner:req.session.user._id
    };

    var perpage = 10;
    var queryQ = Q.all([
        task.findAll(condition,page,perpage),
        task.count(condition)
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
    },function(){
        next();
    });

}

function edit(req,res,next){

    var id = req.param('id');

    task.findOne({_id:id})
        .then(function(taskItem){

            taskItem._startTime = util.dateFormat(taskItem.startTime);
            taskItem._endTime = util.dateFormat(taskItem.endTime);

            user.findOne({_id:taskItem.assigner})
                .then(function(user){
                    res.render('task/edit',{
                        task : taskItem,
                        assigner : user
                    });
                });

        })

}

function update(req,res,next){

    var id = req.param('id'),
        name = req.param('name'),
        level = req.param('level'),
        startTime = req.param('startTime'),
        endTime = req.param('endTime'),
        assignerId = req.param('assignerId'),
        description = req.param('description');

    task.update({
        _id:id,
        name:name,
        level:level,
        startTime:startTime,
        endTime:endTime,
        assigner:assignerId,
        description:description
    }).then(function(num){
        res.redirect('/task/');
    });

}

function remove(req,res,next){
    var id = req.param('id');
    task.remove({_id:id})
        .then(function(num){
            res.redirect('/task/');
        },function(){
            next();
        });
}

function detail(req,res,next){

    var id = req.param('id');
    var taskStatus = VARS.config.taskStatus;

    task.findOne({_id:id})
        .then(getNamesByIds)
        .then(function(data){
            var taskItem = data[0];
            taskItem._startTime = util.dateFormat(taskItem.startTime);
            taskItem._endTime = util.dateFormat(taskItem.endTime);
            taskItem._status = taskStatus[taskItem.status];
            res.render('task/detail',{
                task: taskItem
            });
        },function(){
            next();
        });

    //同时获取所有的name user or project
    function getNamesByIds(task){
        return Q.all([getAssigner(task),getCreater(task),getProject(task),analysisLog(task),getTasks(task)])
    }

    //获取指派人
    function getAssigner(taskItem){
        var deferred = Q.defer();

        user.findOne({_id:taskItem.assigner})
            .then(function(userItem){
                taskItem.assignerName = userItem.username;
                deferred.resolve(taskItem);
            },function(){
                deferred.reject();
            });

        return deferred.promise;
    }

    //获取创建者
    function getCreater(taskItem){
        var deferred = Q.defer();

        user.findOne({_id:taskItem.adder})
            .then(function(userItem){
                taskItem.adderName = userItem.username;
                deferred.resolve(taskItem);
            },function(){
                deferred.reject();
            });

        return deferred.promise;
    }

    //获取项目名称
    function getProject(taskItem){
        var deferred = Q.defer();

        project.findOne({_id:taskItem.project})
            .then(function(projectItem){
                taskItem.projectName = projectItem.name;
                deferred.resolve(taskItem);
            },function(){
                deferred.reject();
            });

        return deferred.promise;
    }

    //获取项目下面所有的任务
    function getTasks(taskItem){
        var deferred = Q.defer();

        task.findTotal({project:taskItem.project})
            .then(function(tasks){
                taskItem.projectItems = tasks;
                deferred.resolve(taskItem);
            },function(){
                deferred.reject();
            });

        return deferred.promise;
    }

    //解析log
    function analysisLog(taskItem){

        var log = taskItem.log;

        var logAry = [];
        log.forEach(function(logItem){
            logAry.push(logRules[logItem.operation](logItem));
        });

        return Q.all(logAry);
    }

    //解析log对应规则
    var logRules = {
        1:function(log){
            var deferred = Q.defer();

            var title = '';

            user.findOne({_id:log.operator})
                .then(function(operator){
                    title += operator.username + ' 于 ' + util.dateFormat(log.time,'YYYY-MM-DD HH:mm') + ' 创建了任务';
                    log.title = title;
                    deferred.resolve(log);
                });

            return deferred.promise;
        },
        2:function(log){
            var deferred = Q.defer();

            var title = '';

            user.findOne({_id:log.operator})
                .then(function(operator){
                    title += operator.username + ' 于 ' + util.dateFormat(log.time,'YYYY-MM-DD HH:mm') + ' 指派给了 ';
                    user.findOne({_id:log.assigner})
                        .then(function(assigner){
                            title += assigner.username;
                            log.title = title;
                            deferred.resolve(log);
                        });
                });

            return deferred.promise;
        },
        3:function(log){
            var deferred = Q.defer();
            var title = '';
            user.findOne({_id:log.operator})
                .then(function(operator){

                    title += operator.username + ' 于 ' + util.dateFormat(log.time,'YYYY-MM-DD HH:mm') + ' 添加了日志';
                    log.title = title;
                    deferred.resolve(log);
                });

            return deferred.promise;
        },
        4:function(log){
            var deferred = Q.defer();
            var title = '';
            user.findOne({_id:log.operator})
                .then(function(operator){
                    title += operator.username + ' 于 ' + util.dateFormat(log.time,'YYYY-MM-DD HH:mm') + ' 修改了进度为 ' + log.progress + '%';
                    log.title = title;
                    deferred.resolve(log);
                });

            return deferred.promise;
        },
        5:function(log){
            var deferred = Q.defer();
            var title = '';
            user.findOne({_id:log.operator})
                .then(function(operator){
                    title += operator.username + ' 于 ' + util.dateFormat(log.time,'YYYY-MM-DD HH:mm') + ' 上传了附件 ' + '<a href="/'+ log.appendix.name +'">'+ log.appendix.name +'</a>' ;
                    log.title = title;
                    deferred.resolve(log);
                });

            return deferred.promise;
        },
        6:function(log){
            var deferred = Q.defer();
            var title = '';
            user.findOne({_id:log.operator})
                .then(function(operator){
                    title += operator.username + ' 于 ' + util.dateFormat(log.time,'YYYY-MM-DD HH:mm') + ' 启动了任务 ' ;
                    log.title = title;
                    deferred.resolve(log);
                });

            return deferred.promise;
        },
        7:function(log){
            var deferred = Q.defer();
            var title = '';
            user.findOne({_id:log.operator})
                .then(function(operator){
                    title += operator.username + ' 于 ' + util.dateFormat(log.time,'YYYY-MM-DD HH:mm') + ' 暂停了任务 ' ;
                    log.title = title;
                    deferred.resolve(log);
                });

            return deferred.promise;
        },
        8:function(log){
            var deferred = Q.defer();
            var title = '';
            user.findOne({_id:log.operator})
                .then(function(operator){
                    title += operator.username + ' 于 ' + util.dateFormat(log.time,'YYYY-MM-DD HH:mm') + ' 终止了任务 ' ;
                    log.title = title;
                    deferred.resolve(log);
                });

            return deferred.promise;
        },
        9:function(log){
            var deferred = Q.defer();
            var title = '';
            user.findOne({_id:log.operator})
                .then(function(operator){
                    title += operator.username + ' 于 ' + util.dateFormat(log.time,'YYYY-MM-DD HH:mm') + ' 完成了任务 ' ;
                    log.title = title;
                    deferred.resolve(log);
                });

            return deferred.promise;
        }

    }
}

function designation(req,res,next){
    var id = req.param('id'),
        assigner = req.param('userId'),
        note = req.param('note');

    task.findOne({_id:id})
        .then(function(taskItem){
            var log = taskItem.log;
            log.push({
                operator:req.session.user._id,
                time:new Date(),
                operation:VARS.config.logOperation.designation,
                assigner:assigner,
                note:note
            });

            task.update({
                _id:id,
                log:log,
                assigner:assigner
            }).then(function(){
                res.redirect('/task/detail/' + id);
            },function(){
                next();
            });
        })
};

function addLog(req,res,next){
    var id = req.param('id'),
        note = req.param('note');

    task.findOne({_id:id})
        .then(function(taskItem){
            var log = taskItem.log;

            log.push({
                operator:req.session.user._id,
                time:new Date(),
                operation:VARS.config.logOperation.log,
                note:note
            });

            task.update({
                _id:id,
                log:log
            }).then(function(){
                res.redirect('/task/detail/' + id);
            },function(){
                next();
            });
        });

}

function modifyProgress(req,res,next){
    var id = req.param('id'),
        progress = req.param('progress'),
        note = req.param('note');

    task.findOne({_id:id})
        .then(function(taskItem){
            var log = taskItem.log;

            log.push({
                operator:req.session.user._id,
                time:new Date(),
                operation:VARS.config.logOperation.progress,
                progress:progress,
                note:note
            });

            task.update({
                _id:id,
                progress:progress,
                log:log
            }).then(function(){
                res.redirect('/task/detail/' + id);
            },function(){
                next();
            });
        });
}

function upload(req,res,next){
    var id = req.param('id'),
        appendix = req.files.appendix,
        note = req.param('note');

    task.findOne({_id:id})
        .then(function(taskItem){
            var log = taskItem.log;

            log.push({
                operator:req.session.user._id,
                time:new Date(),
                operation:VARS.config.logOperation.upload,
                appendix:appendix,
                note:note
            });

            task.update({
                _id:id,
                log:log
            }).then(function(){
                res.redirect('/task/detail/' + id);
            },function(){
                next();
            });
        });
}

function start(req,res,next){
    var id = req.param('id'),
        note = req.param('note');

    task.findOne({_id:id})
        .then(function(taskItem){
            var log = taskItem.log;

            log.push({
                operator:req.session.user._id,
                time:new Date(),
                operation:VARS.config.logOperation.start,
                note:note
            });

            task.update({
                _id:id,
                log:log,
                status:2
            }).then(function(){
                res.redirect('/task/detail/' + id);
            },function(){
                next();
            });
        });
}

function pause(req,res,next){
    var id = req.param('id'),
        note = req.param('note');

    task.findOne({_id:id})
        .then(function(taskItem){
            var log = taskItem.log;

            log.push({
                operator:req.session.user._id,
                time:new Date(),
                operation:VARS.config.logOperation.pause,
                note:note
            });

            task.update({
                _id:id,
                log:log,
                status:3
            }).then(function(){
                res.redirect('/task/detail/' + id);
            },function(){
                next();
            });
        });
}

function stop(req,res,next){
    var id = req.param('id'),
        note = req.param('note');

    task.findOne({_id:id})
        .then(function(taskItem){
            var log = taskItem.log;

            log.push({
                operator:req.session.user._id,
                time:new Date(),
                operation:VARS.config.logOperation.stop,
                note:note
            });

            task.update({
                _id:id,
                log:log,
                status:4
            }).then(function(){
                res.redirect('/task/detail/' + id);
            },function(){
                next();
            });
        });
}

function complete(req,res,next){
    var id = req.param('id'),
        note = req.param('note');

    task.findOne({_id:id})
        .then(function(taskItem){
            var log = taskItem.log;

            log.push({
                operator:req.session.user._id,
                time:new Date(),
                operation:VARS.config.logOperation.complete,
                note:note
            });

            task.update({
                _id:id,
                log:log,
                status:5
            }).then(function(){
                res.redirect('/task/detail/' + id);
            },function(){
                next();
            });
        });
}

function link(req,res,next){
    var id = req.param('id'),
        note = req.param('note');

    task.findOne({_id:id})
        .then(function(taskItem){
            var log = taskItem.log;

            log.push({
                operator:req.session.user._id,
                time:new Date(),
                operation:VARS.config.logOperation.link,
                note:note
            });

            task.update({
                _id:id,
                log:log
            }).then(function(){
                res.redirect('/task/detail/' + id);
            },function(){
                next();
            });
        });
}

module.exports.add = add;
module.exports.addAndSave = addAndSave;
module.exports.list = list;
module.exports.edit = edit;
module.exports.update = update;
module.exports.remove = remove;
module.exports.detail = detail;
module.exports.designation = designation;
module.exports.addLog = addLog;
module.exports.modifyProgress = modifyProgress;
module.exports.upload = upload;
module.exports.start = start;
module.exports.pause = pause;
module.exports.stop = stop;
module.exports.complete = complete;
module.exports.link = link;