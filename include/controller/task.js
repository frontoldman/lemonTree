/**
 * Created by zhangran on 15/3/11.
 */
var Q = require('Q');
var moment = require('moment');
var task = require('../proxy/').task;
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
        res.redirect('/task/list');
    },function(){
        next();
    });
}

function list(req,res,next){

    var page = req.param('page');
    var projectStatus = VARS.config.projectStatus;

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

        res.render('task/list',{
            list  : data[0],
            pages : {
                link:'/task',
                total:total,
                current:page+1 > total ? total : page
            }
        });
    });

}

module.exports.add = add;
module.exports.addAndSave = addAndSave;
module.exports.list = list;