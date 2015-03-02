/**
 * Created by zhangran on 15/2/27.
 */
var Q = require('q');
var User = require('../model/').User;

//新增一个用户
function addOne(params){
    return User.create(params)
}

//查找单个用户
function findOne(options){
    return User.findOne(options).exec();
}

//查找所有用户
function findAll(options,start,limit){
    return User.find(options)
        .skip(start*limit)
        .limit(limit)
        .exec();
}


module.exports.addOne = addOne;
module.exports.findOne = findOne;
module.exports.findAll = findAll;
