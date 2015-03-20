/**
 * Created by zhangran on 15/3/11.
 */

var Q = require('q');
var Task = require('../model/').Task;

function findOne(options) {
    var deferred = Q.defer();

    Task.findOne(options, function (err, project) {
        if (err) {
            deferred.reject(err);
        } else {
            deferred.resolve(project);
        }
    });

    return deferred.promise;
}

//新增一个任务
function addOne(params) {
    return Task.create(params);
}

//查找所有的任务
function findAll(options, start, limit) {
    var deferred = Q.defer();

    var query = Task.find(options)
        .skip(start * limit)
        .limit(limit)
        .exec();

    query.then(function (tasks) {
        deferred.resolve(tasks);
    }, function () {
        deferred.reject();
    });

    return deferred.promise;
}

function count(options) {
    var deferred = Q.defer();

    Task.where(options).count(function (err, count) {
        if (err) {
            deferred.reject();
            return;
        }
        deferred.resolve(count);
    });

    return deferred.promise;
}

function update(options) {
    var deferred = Q.defer();

    Task.where({_id: options._id}).update(options, function (err, num) {
        if (err) {
            deferred.reject();
        } else {
            deferred.resolve(num);
        }
    });

    return deferred.promise;
}

function remove(options) {
    var deferred = Q.defer();

    Task.remove(options, function (err, num) {
        if (err) {
            deferred.reject();
        } else {
            deferred.resolve(num);
        }
    });

    return deferred.promise;
}

function findTotal(options) {
    var deferred = Q.defer();

    var query = Task.where(options).exec();

    query.then(function (tasks) {
        deferred.resolve(tasks);
    }, function () {
        deferred.reject();
    });

    return deferred.promise;
}


module.exports.findOne = findOne;
module.exports.addOne = addOne;
module.exports.findAll = findAll;
module.exports.count = count;
module.exports.update = update;
module.exports.remove = remove;
module.exports.findTotal = findTotal;
