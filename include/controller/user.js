/**
 * Created by zhangran on 15/2/27.
 */

var user = require('../proxy/').user;

function addUser(req, res, next) {
    var email           = req.param('email'),
        password        = req.param('password'),
        passwordConfirm = req.param('confirm-password'),
        username        = req.param('username'),
        phone           = req.param('phone'),
        qq              = req.param('qq');

    var promise = user.addOne({
        email          :email,
        password       :password,
        passwordConfirm:passwordConfirm,
        username       :username,
        phone          :phone,
        qq             :qq
    });

    //console.log(result);

    promise.then(function(err){
        res.send('success');
    });
    //
    //promise.resolve(function(){
    //    console.log('resolve');
    //});

    //promise.reject(function(){
    //    console.log('reject');
    //});
    //
    //promise.fulfill(function(){
    //    console.log('fulfill');
    //});

    //console.log(promise.resolve);
    //console.log(promise.reject);
    //console.log(promise.fulfill);

}

module.exports.addUser = addUser;