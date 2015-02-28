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

    if(password != passwordConfirm){
        res.render('user/register',{
            message : '两次密码不一致'
        });
        return;
    }

    var sha1 = crypto.createHash('sha1');
    sha1.update(password);
    var _pass = sha1.digest('hex');

    user.findOne({email:email})
        .then(function(user){
            if(!user){
                addUser();
            }else{
                res.render('user/register',{
                    message : '此用户已存在'
                });
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
            office          : 1,    //默认管理员，admin
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
                res.render('user/login',{
                    message : '用户名密码不正确'
                });
            }
        });
}

function userList(req,res){

}

module.exports.addUser = addUser;
module.exports.login = login;
module.exports.userList = userList;