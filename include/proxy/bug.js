/**
 * Created by zhangran on 15/3/20.
 */
var Q = require('q');
var Bug = require('../model/').Bug;

function findOne(options) {
    var deferred = Q.defer();

    Bug.findOne(options, function (err, project) {
        if (err) {
            deferred.reject(err);
        } else {
            deferred.resolve(project);
        }
    });

    return deferred.promise;
}

function addOne(params) {
    return Bug.create(params);
}

function findAll(options, start, limit) {
    var deferred = Q.defer();

    var query = Bug.find(options)
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

    Bug.where(options).count(function (err, count) {
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

    Bug.where({_id: options._id}).update(options, function (err, num) {
        if (err) {
            deferred.reject();
        } else {
            deferred.resolve(num);
        }
    });

    return deferred.promise;
}


module.exports.findOne = findOne;
module.exports.addOne = addOne;
module.exports.findAll = findAll;
module.exports.count = count;
module.exports.update = update;