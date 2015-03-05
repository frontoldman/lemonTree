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
    return Project.find(options)
        .skip(start*limit)
        .limit(limit)
        .exec();
}


module.exports.addOne = addOne;
module.exports.findAll = findAll;