/**
 * Created by zhangran on 15/3/20.
 */
var Q = require('q');
var bug = require('../proxy/').bug;
var user = require('../proxy/').user;
var util = require('../util');

function add(req, res, next) {
    res.render('bug/add',{
        bugType:VARS.config.bugType
    });
}

function addAndSave(req, res, next) {
    var name = req.param('name'),
        level = req.param('level'),
        type = req.param('type'),
        assignerId = req.param('assignerId'),
        description = req.param('description');

    bug.addOne({
        name: name,
        level: level,
        type: type,
        assigner: assignerId,
        description: description,
        log: [{
            operator: req.session.user._id,
            time: new Date(),
            operation: VARS.config.bugLogOperation.create,
            note: ''
        }],
        adder: req.session.user._id,
        addTime: new Date()
    }).then(function () {
        res.send('添加成功');
    }, function () {
        next();
    })
}

function list(req, res, next) {

    var page = req.param('page');
    var type = req.param('type');

    type = type ? type : 1;

    if (!page) {
        page = 0;
    } else {
        page--;
    }

    page = page < 0 ? 0 : page;

    var condition = {};

    var perpage = 10;
    var queryQ = Q.all([
        bug.findAll(condition, page, perpage),
        bug.count(condition)
    ]);

    queryQ.then(function (data) {

        var total = Math.ceil(data[1] / perpage);
        var bugList = data[0];

        var bugStatus = VARS.config.bugStatus;
        var bugType = VARS.config.bugType;

        if (Array.isArray(bugList)) {


            var queryNamesAry = [];

            bugList.forEach(function (item) {
                // item._status = taskStatus[item.status];
                item._addTime = util.dateFormat(item.addTime);
                item._status = bugStatus[item.status];
                item._type = bugType[item.type];

                queryNamesAry.push(user.findOne({_id: item.assigner}));
                queryNamesAry.push(user.findOne({_id: item.adder}));
            });

            Q.all(queryNamesAry)
                .then(function (users) {

                    console.log(users)

                    for (var i = 0; i < users.length; i += 2) {
                        bugList[i / 2]._assigner = users[i];
                        bugList[i / 2]._adder = users[i + 1];
                    }

                    res.render('bug/list', {
                        list: bugList,
                        pages: {
                            link: '/bug',
                            total: total,
                            current: page + 1 > total ? total : page
                        }
                    });

                });

        } else {
            res.render('bug/list', {
                list: [],
                pages: {
                    link: '/bug',
                    total: total,
                    current: page + 1 > total ? total : page
                }
            });
        }

    }, function () {
        next();
    })


}

function edit(req,res,next){

    var id = req.param('id');

    bug.findOne({_id: id})
        .then(getUser)
        .then(function (obj) {

            obj.bug._assigner = obj.user;

            res.render('bug/edit', {
                bug: obj.bug,
                bugType:VARS.config.bugType
            });

        });

    function getUser(bugItem){

        var deferred = Q.defer();

        user.findOne({_id: bugItem.assigner})
            .then(function(userItem){
                deferred.resolve({
                    bug:bugItem,
                    user:userItem
                });
            });

        return deferred.promise;
    }
}

function update(req,res,next){
    var id = req.param('id'),
        name = req.param('name'),
        level = req.param('level'),
        type = req.param('type'),
        assignerId = req.param('assignerId'),
        description = req.param('description');

    bug.update({
        _id: id,
        name: name,
        level: level,
        type:type,
        assigner: assignerId,
        description: description
    }).then(function (num) {
        res.redirect('/bug/');
    });
}

function remove(req, res, next) {

    var id = req.param('id');
    bug.remove({_id: id})
        .then(function (num) {
            res.redirect('/bug/');
        }, function () {
            next();
        });
}

function detail(req,res,next){

    var id = req.param('id');

    var bugStatus = VARS.config.bugStatus;
    var bygType = VARS.config.bugType;

    bug.findOne({_id: id})
        .then(getNamesByIds)
        .then(function (data) {
            var bugItem = data[0];
            bugItem._status = bugStatus[bugItem.status];
            bugItem._type = bygType[bugItem.type];
            bugItem._addTime = util.dateFormat(bugItem.addTime);
            res.render('bug/detail1', {
                bug: bugItem
            });
        }, function () {
            next();
        });

    function getNamesByIds(bugItem){
        return Q.all([
            getCreater(bugItem),
            analysisLog(bugItem)
        ]);
    }

    //获取创建者名单
    function getCreater(bugItem) {
        var deferred = Q.defer();

        user.findOne({_id: bugItem.assigner})
            .then(function (userItem) {
                bugItem._adder = userItem;
                deferred.resolve(bugItem);
            }, function () {
                deferred.reject();
            });

        return deferred.promise;
    }

    //解析log
    function analysisLog(bugItem) {

        var log = bugItem.log;

        var logAry = [];
        log.forEach(function (logItem) {
            logAry.push(logRules[logItem.operation](logItem));
        });

        return Q.all(logAry);
    }


    //解析log对应规则
    var logRules = {
        1: function (log) {
            var deferred = Q.defer();

            var title = '';

            user.findOne({_id: log.operator})
                .then(function (operator) {
                    title += operator.username + ' 于 ' + util.dateFormat(log.time, 'YYYY-MM-DD HH:mm') + ' 创建了bug';
                    log.title = title;
                    deferred.resolve(log);
                });

            return deferred.promise;
        },
        2: function (log) {
            var deferred = Q.defer();

            var title = '';

            user.findOne({_id: log.operator})
                .then(function (operator) {
                    title += operator.username + ' 于 ' + util.dateFormat(log.time, 'YYYY-MM-DD HH:mm') + ' 指派给了 ';
                    user.findOne({_id: log.assigner})
                        .then(function (assigner) {
                            title += assigner.username;
                            log.title = title;
                            deferred.resolve(log);
                        });
                });


            return deferred.promise;
        },
        3: function (log) {
            var deferred = Q.defer();
            var title = '';
            user.findOne({_id: log.operator})
                .then(function (operator) {
                    title += operator.username + ' 于 ' + util.dateFormat(log.time, 'YYYY-MM-DD HH:mm') + ' 关闭了此 bug ';
                    log.title = title;
                    deferred.resolve(log);
                });

            return deferred.promise;
        },
        4: function (log) {
            var deferred = Q.defer();
            var title = '';
            user.findOne({_id: log.operator})
                .then(function (operator) {
                    title += operator.username + ' 于 ' + util.dateFormat(log.time, 'YYYY-MM-DD HH:mm') + '  修改完成了bug ';
                    log.title = title;
                    deferred.resolve(log);
                });

            return deferred.promise;
        },
        5: function (log) {
            var deferred = Q.defer();
            var title = '';
            user.findOne({_id: log.operator})
                .then(function (operator) {

                    title += operator.username + ' 于 ' + util.dateFormat(log.time, 'YYYY-MM-DD HH:mm') + ' 添加了日志';
                    log.title = title;
                    deferred.resolve(log);
                });

            return deferred.promise;
        },
        6: function (log) {
            var deferred = Q.defer();
            var title = '';
            user.findOne({_id: log.operator})
                .then(function (operator) {
                    title += operator.username + ' 于 ' + util.dateFormat(log.time, 'YYYY-MM-DD HH:mm') + ' 打开了bug';
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

    bug.findOne({_id: id})
        .then(function (bugItem) {
            var log = bugItem.log;
            log.push({
                operator: req.session.user._id,
                time: new Date(),
                operation: VARS.config.bugLogOperation.designation,
                assigner: assigner,
                note: note
            });

            bug.update({
                _id: id,
                log: log,
                assigner: assigner
            }).then(function () {
                res.redirect('/bug/detail/' + id);
            }, function () {
                next();
            });
        });
}

function complete(req,res,next){
    var id = req.param('id'),
        note = req.param('note');

    bug.findOne({_id: id})
        .then(function (bugItem) {
            var log = bugItem.log;

            log.push({
                operator: req.session.user._id,
                time: new Date(),
                operation: VARS.config.bugLogOperation.complete,
                note: note
            });

            bug.update({
                _id: id,
                log: log,
                status: 2
            }).then(function () {
                res.redirect('/bug/detail/' + id);
            }, function () {
                next();
            });
        });
}

function close(req, res, next) {
    var id = req.param('id'),
        note = req.param('note');

    bug.findOne({_id: id})
        .then(function (bugItem) {
            var log = bugItem.log;

            log.push({
                operator: req.session.user._id,
                time: new Date(),
                operation: VARS.config.bugLogOperation.close,
                note: note
            });

            bug.update({
                _id: id,
                log: log,
                status: 3
            }).then(function () {
                res.redirect('/bug/detail/' + id);
            }, function () {
                next();
            });
        });
}

function addLog(req, res, next) {
    var id = req.param('id'),
        note = req.param('note');

    bug.findOne({_id: id})
        .then(function (bugItem) {
            var log = bugItem.log;

            log.push({
                operator: req.session.user._id,
                time: new Date(),
                operation: VARS.config.bugLogOperation.log,
                note: note
            });

            bug.update({
                _id: id,
                log: log
            }).then(function () {
                res.redirect('/bug/detail/' + id);
            }, function () {
                next();
            });
        });
}

function open(req, res, next) {
    var id = req.param('id'),
        note = req.param('note');

    bug.findOne({_id: id})
        .then(function (bugItem) {
            var log = bugItem.log;

            log.push({
                operator: req.session.user._id,
                time: new Date(),
                operation: VARS.config.bugLogOperation.open,
                note: note
            });

            bug.update({
                _id: id,
                log: log,
                status: 1
            }).then(function () {
                res.redirect('/bug/detail/' + id);
            }, function () {
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
module.exports.complete = complete;
module.exports.close = close;
module.exports.addLog = addLog;
module.exports.open = open;