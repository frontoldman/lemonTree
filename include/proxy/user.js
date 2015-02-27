/**
 * Created by zhangran on 15/2/27.
 */
var User = require('../model/').User;

function addOne(params){

    return User.create(params);

}

module.exports.addOne = addOne;