/**
 * Created by zhangran on 15/2/27.
 */

var crypto = require('crypto');
var user = require('../proxy/').user;

function addUser(req, res, next) {

    var email           = req.param('email'),
        password        = req.param('password'),
        passwordConfirm = req.param('confirm-password'),
        username        = req.param('username'),
        phone           = req.param('phone'),
        qq              = req.param('qq'),
        sex             = req.param('sex'),
        remember        = req.param('remember');

    var sha1 = crypto.createHash('sha1');
    sha1.update(password);
    var _pass = sha1.digest('hex');

    user.findOne({email:email})
        .then(function(user){
            if(!user){
                addUser();
            }else{
                res.send('此用户已存在');
            }
        });


    function addUser(){

        var promise = user.addOne({
            email           : email,
            password        : _pass,
            passwordConfirm : passwordConfirm,
            username        : username,
            phone           : phone,
            qq              : qq,
            sex             : sex
        });

        promise.then(function(err){
            res.send('success');
        });
    }



}

module.exports.addUser = addUser;