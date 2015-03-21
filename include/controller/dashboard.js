/**
 * Created by zhangran on 15/3/21.
 */
var Q = require('q');
var bug = require('../proxy/').bug;
var task = require('../proxy/').task;
var project = require('../proxy/').project;
var util = require('../util');


function index(req,res,next){

    var bugStatus = VARS.config.bugStatus;

    Q.all([
        task.findAll({assigner:req.session.user._id},0,10),
        bug.findAll({assigner:req.session.user._id},0,10),
        project.findAll({
            $or: [
                {
                    "projectMan": req.session.user._id
                },
                {
                    "productMan": req.session.user._id
                },
                {
                    "testMan": req.session.user._id
                },
                {
                    "publishMan": req.session.user._id
                },
                {
                    "members.userId": req.session.user._id
                }
            ]
        },0,10)
    ]).then(function(data){

        var taskList = data[0];
        var bugList = data[1];
        var projectList = data[2];


        taskList.forEach(function(task){
            task._endTime = util.dateFormat(task.endTime);
        });

        bugList.forEach(function(bug){
            bug._status = bugStatus[bug.status];
        });

        projectList.forEach(function(project){
            project._endTime = util.dateFormat(project.endTime);
        });

        res.render('dashboard',{
            taskList:taskList,
            bugList:bugList,
            projectList:projectList
        });
    });
}

module.exports.index = index;