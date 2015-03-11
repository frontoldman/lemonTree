/**
 * Created by zhangran on 15/3/11.
 */

var Q = require('q');
var Task = require('../model/').Task;

function findOne(options){
    var deferred = Q.defer();

    Task.findOne(options,function(err,project){
        if(err){
            deferred.reject(err);
        }else{
            deferred.resolve(project);
        }
    });

    return deferred.promise;
}

//新增一个任务
function addOne(params){
    return Task.create(params);
}

//查找所有的任务
function findAll(options,start,limit){
    var deferred = Q.defer();

    var query = Task.find(options)
        .skip(start*limit)
        .limit(limit)
        .exec();

    query.then(function(projects){
        deferred.resolve(projects);
    },function(){
        deferred.reject();
    });

    return deferred.promise;
}

function count(options){
    var deferred = Q.defer();

    Task.where(options).count(function(err,count){
        if(err){
            deferred.reject();
            return;
        }
        deferred.resolve(count);
    });

    return deferred.promise;
}

module.exports.findOne = findOne ;
module.exports.addOne = addOne ;
module.exports.findAll = findAll ;
module.exports.count = count ;