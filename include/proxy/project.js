/**
 * Created by zhangran on 15/3/4.
 */
var Q = require('q');
var Project = require('../model/').Project;

//新增一个项目
function addOne(params){
    return Project.create(params)
}

module.exports.addOne = addOne;