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
        sex             = req.param('sex');

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
            sex             : sex,
            registerTime    : new Date(),
            loginTime       : new Date(),
            loginTimes      : 1
        });

        promise.then(function(err){
            res.send('success');
        });
    }

}

function login(req,res){
    var email           = req.param('email'),
        password        = req.param('password');

    var sha1 = crypto.createHash('sha1');
    sha1.update(password);
    var _pass = sha1.digest('hex');

    user.findOne({email:email,password:_pass})
        .then(function(user){
            if(user){
                res.send('登陆成功');
            }else{
                res.send('登陆失败');
            }
        });
}

module.exports.addUser = addUser;
module.exports.login = login;