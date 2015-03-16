/**
 * Created by zhangran on 15/3/16.
 */

var Q = require('q');
var Office = require('../model/').Office;

function findOne(options){
    var deferred = Q.defer();

    Office.findOne(options,function(err,project){
        if(err){
            deferred.reject(err);
        }else{
            deferred.resolve(project);
        }
    });

    return deferred.promise;
}

function addOne(params){
    return Office.create(params);
}

function findAll(options,start,limit){
    return Office.find(options)
        .skip(start*limit)
        .limit(limit)
        .exec();
}

function count(options){
    var deferred = Q.defer();

    Office.where(options).count(function(err,count){
        if(err){
            deferred.reject();
            return;
        }
        deferred.resolve(count);
    });

    return deferred.promise;
}

function update(options){
    var deferred = Q.defer();

    Office.where({ _id: options._id }).update(options,function(err,num){
        if(err){
            deferred.reject();
        }else{
            deferred.resolve(num);
        }
    });

    return deferred.promise;
}

function remove(options){
    var deferred = Q.defer();

    Office.remove(options, function(err,num){
        if(err){
            deferred.reject();
        }else{
            deferred.resolve(num);
        }
    });

    return deferred.promise;
}

module.exports.addOne = addOne;
module.exports.findAll = findAll;
module.exports.count = count;
module.exports.findOne = findOne;
module.exports.update = update;
module.exports.remove = remove;