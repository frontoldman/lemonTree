/**
 * Created by zhangran on 15/2/27.
 */

var crypto = require('crypto');
var _ = require('lodash');
var user = require('../proxy/').user;
var util = require('../util');

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

    var _pass = util.crypto(password);

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
            username        : username,
            phone           : phone,
            qq              : qq,
            sex             : sex,
            office          : 0,    //默认管理员，admin
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
        password        = req.param('password'),
        remember        = req.param('remember');

    var _pass = util.crypto(password);

    user.findOne({email:email,password:_pass})
        .then(function(user){
            if(user){
                req.session.user = user;

                if(remember){
                    res.cookie('userId',user._id,{
                        expires: new Date(Date.now() + VARS.config.cookie_expires),
                        httpOnly : true,
                        path     : '/'
                    });
                }
                res.redirect('/dashboard');
            }else{
                res.render('user/login',{
                    message : '用户名密码不正确'
                });
            }
        });
}

function userList(req,res){
    user.findAll(0,10)
        .then(function(users){
            if(users){

                users.forEach(function(user){
                    user._sex = (['女','男'])[user.sex];
                    user._loginTime = util.dateFormat(user.loginTime);
                    user._registerTime = util.dateFormat(user.registerTime);
                });

                res.render('user/list',{
                    userList:users
                });

            }else{
                res.send('查找失败');
            }
        });
}


function logout(req,res,next){

    req.session.user = null;
    res.cookie('userId',null,{
        expires: new Date(Date.now() - 100),
        httpOnly : true,
        path     : '/'
    });

    res.redirect('/user/login');

}

function users(req,res,next){

    var term = req.param('term');

    var termReg = new RegExp(term,'i');

    user.findAll({username:termReg})
        .then(function(users){

            var _users = [];
            users.forEach(function(userItem){
                _users.push({
                    id:userItem._id,
                    value:userItem.username
                })
            });

            res.json(_users);

        },function(){
            res.json([]);
        });


}

function addFresh(req,res,next){
    var email = req.param('email'),
        username = req.param('username');

    if(!email || !username){
        res.render('user/add',{
            message:'邮箱和用户名必须填！'
        });
        return;
    }

    user.findOne({email:email})
        .then(function(user){
            if(!user){
                addFreshUser();
            }else{
                res.render('user/add',{
                    message:'此用户已存在！'
                });
            }
        });

    function addFreshUser(){

        var promise = user.addOne({
            email        : email,
            password     : util.crypto(VARS.config.defaultPass),
            username     : username,
            sex          : 1,
            office       : 2,
            registerTime : new Date(),
            loginTime    : new Date(),
            loginTimes   : 0
        });

        promise.then(function(err){
            res.render('user/add',{
                message:'添加成功！'
            });
        });
    }
}

module.exports.addUser = addUser;
module.exports.login = login;
module.exports.userList = userList;
module.exports.logout = logout;
module.exports.users = users;
module.exports.addFresh = addFresh;