/**
 * Created by zhangran on 15/3/4.
 */
var moment = require('moment');
var Q = require('q');
var project = require('../proxy/').project;
var user = require('../proxy/').user;
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
        next();
    });

};

function list(req,res,next){

    var page = req.param('page');
    var projectStatus = VARS.config.taskStatus;

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
                project._status = projectStatus[project.status];
            });

            res.render('project/list',{
                list:projects,
                pages:{
                    link:'/project',
                    total:total,
                    current:page+1 > total ? total : page
                }
            });
        }else{
            res.render('project/list',{
                list : [],
                pages:{
                    link:'/project',
                    total:0,
                    current:1
                }
            })
        }
    });

    queryQ.fail(function(){
        res.render('project/list',{
            list:[],
            pages:{}
        });
    })


}

function edit(req,res,next){

    var id = req.param('id');

    var queryQ = project.findOne({_id:id});
    queryQ.then(getUserNames)
        .then(function(dataArray){
            res.render('project/edit',{
                project    : dataArray[0],
                projectMan : dataArray[1]||{},
                productMan : dataArray[2]||{},
                testMan    : dataArray[3]||{},
                publishMan : dataArray[4]||{}
            });
        });


}

function update(req,res,next){
    var id           = req.param('id'),
        name         = req.param('name'),
        code         = req.param('code'),
        startTime    = req.param('startTime'),
        endTime      = req.param('endTime'),
        projectManId = req.param('projectManId'),
        productManId = req.param('productManId'),
        testManId    = req.param('testManId'),
        publishManId = req.param('publishManId'),
        description  = req.param('description');

    if(!name || !startTime || !endTime){
        res.render('project/add',{
            message:'必填项不能不填啊'
        });
    }

    var promise = project.update({
        _id         : id,
        name        : name,
        code        : code,
        startTime   : moment(startTime),
        endTime     : moment(endTime),
        projectMan  : { id : projectManId , joinTime : new Date() },
        productMan  : { id : productManId , joinTime : new Date() },
        testMan     : { id : testManId    , joinTime : new Date() },
        publishMan  : { id : publishManId , joinTime : new Date() },
        description : description
    });

    promise.then(function(projectItem){
        res.redirect('/project/');
    },function(){
        next();
    });
}

function detail(req,res,next){
    var id = req.param('id');

    var queryQ = project.findOne({_id:id});
    queryQ.then(getUserNames)
        .then(function(dataArray){
            res.render('project/detail',{
                project    : dataArray[0],
                projectMan : dataArray[1]||{},
                productMan : dataArray[2]||{},
                testMan    : dataArray[3]||{},
                publishMan : dataArray[4]||{}
            });
        });
}

function remove(req,res,next){
    var id = req.param('id');

    project.remove({_id:id})
        .then(function(){
            res.redirect('/project/');
        },function(){
            next();
        });

}

function getMembers(req,res,next){

    var id = req.param('id');

    var queryQ = project.findOne({_id:id});
    queryQ.then(getUserNames)
        .then(function(dataArray){

            var projectItem = dataArray[0];

            projectItem.projectMan._joinTime = util.dateFormat(projectItem.projectMan.joinTime);
            projectItem.productMan._joinTime = util.dateFormat(projectItem.productMan.joinTime);
            projectItem.testMan._joinTime = util.dateFormat(projectItem.testMan.joinTime);
            projectItem.publishMan._joinTime = util.dateFormat(projectItem.publishMan.joinTime);

            var membersQAry = [];
            projectItem.members.forEach(function(member){
                membersQAry.push(user.findOne({_id:member.userId}))
            });

            Q.all(membersQAry)
                .then(function(members){

                    var _members = [];
                    members.forEach(function(member,index){
                        _members.push({
                            username:member.username,
                            joinTime:util.dateFormat(projectItem.members[index].joinTime),
                            role:projectItem.members[index].role
                        })
                    });


                    res.render('project/memberList',{
                        project    : projectItem,
                        projectMan : dataArray[1]||{},
                        productMan : dataArray[2]||{},
                        testMan    : dataArray[3]||{},
                        publishMan : dataArray[4]||{},
                        members    : _members
                    });
                });


        });

}

function editMembers(req,res,next){
    var id = req.param('id');

    var memberError = req.session.memberError
    req.session.memberError = null;

    var queryQ = project.findOne({_id:id});
    queryQ.then(getUserNames)
        .then(function(dataArray){

            var projectItem = dataArray[0];

            projectItem.projectMan._joinTime = util.dateFormat(projectItem.projectMan.joinTime);
            projectItem.productMan._joinTime = util.dateFormat(projectItem.productMan.joinTime);
            projectItem.testMan._joinTime = util.dateFormat(projectItem.testMan.joinTime);
            projectItem.publishMan._joinTime = util.dateFormat(projectItem.publishMan.joinTime);

            var membersQAry = [];
            projectItem.members.forEach(function(member){
                membersQAry.push(user.findOne({_id:member.userId}))
            });


            Q.all(membersQAry)
                .then(function(members){

                    var _members = [];
                    members.forEach(function(member,index){
                        _members.push({
                            id:member._id,
                            username:member.username,
                            joinTime:util.dateFormat(projectItem.members[index].joinTime),
                            role:projectItem.members[index].role
                        })
                    });

                    res.render('project/memberEdit',{
                        project     : projectItem,
                        projectMan  : dataArray[1]||{},
                        productMan  : dataArray[2]||{},
                        testMan     : dataArray[3]||{},
                        publishMan  : dataArray[4]||{},
                        members     : _members,
                        memberError : memberError
                    });
                });
        });
}

function updateMembers(req,res,next){

    var id = req.param('id'),
        memberIds = req.param('memberId'),
        memberNames = req.param('memberName'),
        roles = req.param('role'),
        joinTimes = req.param('joinTime');

    var projectManId = req.param('projectManId'),
        productManId = req.param('productManId'),
        testManId = req.param('testManId'),
        publishManId = req.param('publishManId');


    var hasError = false;
    var hash = {};
    var members = [];
    hash[projectManId] = true;
    hash[productManId] = true;
    hash[testManId] = true;
    hash[publishManId] = true;

    if(memberIds){

        if(!Array.isArray(memberIds)){
            memberIds = [memberIds];
            memberNames = [memberNames];
            roles = [roles];
            joinTimes = [joinTimes];
        }

        memberIds.forEach(function(id){

            if(hash[id]){
                hasError = true;
                return true;
            }else{
                hash[id] = true;
            }
        });

        function updateErrorHandler(){
            req.session.memberError = '不能添加重复成员';
            res.redirect('/project/members/edit/' + id);
        }

        if(hasError){
            updateErrorHandler();
            return;
        }

        memberIds.forEach(function(id,index){
            if(id){
                members.push({
                    userId:id,
                    role:roles[index],
                    joinTime:joinTimes[index] || new Date()
                });
            }

        });
    }

    var updateQ = project.update({
        _id:id,
        members:members
    });

    updateQ.done(function(){
        res.redirect('/project/members/' + id);
    });

    updateQ.fail(function(){
        next();
    });

}

//根据project获取用户详细信息
function getUserNames(project){

    project._startTime = util.dateFormat(project.startTime);
    project._endTime = util.dateFormat(project.endTime);

    return Q.all([
        project,
        user.findOne({_id:project.projectMan.id}),
        user.findOne({_id:project.productMan.id}),
        user.findOne({_id:project.testMan.id}),
        user.findOne({_id:project.publishMan.id})]);

}

module.exports.add = add;
module.exports.list = list;
module.exports.edit = edit;
module.exports.update = update;
module.exports.detail = detail;
module.exports.remove = remove;
module.exports.getMembers = getMembers;
module.exports.editMembers = editMembers;
module.exports.updateMembers = updateMembers;