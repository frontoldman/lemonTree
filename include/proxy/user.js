/**
 * Created by zhangran on 15/2/27.
 */
var Q = require('q');
var User = require('../model/').User;

//新增一个用户
function addOne(params){
    return User.create(params)
}

function findOne(options){
    return User.findOne(options).exec();
}

//function checkAndAdd(params){
//
//    var deferred = Q.defer();
//
//    findOne({email:params.email})
//        .then(function(user){
//            if(!user){
//                deferred.resolve(params);
//            }
//        });
//
//    return deferred.promise.done(addOne);
//}



module.exports.addOne = addOne;
module.exports.findOne = findOne;
