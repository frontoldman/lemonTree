/**
 * Created by zhangran on 15/3/4.
 */
var Q = require('q');
var Project = require('../model/').Project;

//新增一个项目
function addOne(params){
    return Project.create(params)
}

function findAll(options,start,limit){
    var deferred = Q.defer();

    var query = Project.find(options)
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

    Project.where(options).count(function(err,count){
        if(err){
            deferred.reject();
            return;
        }
        deferred.resolve(count);
    });

    return deferred.promise;
}


module.exports.addOne = addOne;
module.exports.findAll = findAll;
module.exports.count = count;