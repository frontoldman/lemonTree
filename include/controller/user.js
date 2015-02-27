/**
 * Created by zhangran on 15/2/27.
 */

var user = require('../proxy/').user;

function addUser(req, res, next) {
    var result = user.addOne();
    res.send(result);
}


module.exports.addUser = addUser;