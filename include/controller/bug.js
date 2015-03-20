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
        startTime = req.param('startTime'),
        endTime = req.param('endTime'),
        assignerId = req.param('assignerId'),
        description = req.param('description');

    bug.addOne({
        name: name,
        level: level,
        type: type,
        startTime: startTime,
        endTime: endTime,
        assigner: assignerId,
        description: description,
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

module.exports.add = add;
module.exports.addAndSave = addAndSave;
module.exports.list = list;
module.exports.edit = edit;
module.exports.update = update;