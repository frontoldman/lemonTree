/**
 * Created by zhangran on 15/2/27.
 */

var crypto = require('crypto');
var _ = require('lodash');
var Q = require('Q');
var user = require('../proxy/').user;
var office = require('../proxy/').office;
var project = require('../proxy/').project;
var util = require('../util');

function addUser(req, res, next) {

    var email = req.param('email'),
        password = req.param('password'),
        passwordConfirm = req.param('confirm-password'),
        username = req.param('username'),
        phone = req.param('phone'),
        qq = req.param('qq'),
        sex = req.param('sex');

    if (password != passwordConfirm) {
        res.render('user/register', {
            message: '两次密码不一致'
        });
        return;
    }

    var _pass = util.crypto(password);

    user.findOne({email: email})
        .then(function (user) {
            if (!user) {
                addUser();
            } else {
                res.render('user/register', {
                    message: '此用户已存在'
                });
            }
        });

    Q.all([
        user.findOne({email: email}),
        office.findOne({name: 'admin'})
    ]).then(function (data) {
        if (data[0]) {
            res.render('user/register', {
                message: '此用户已存在'
            });
            return;
        }

        addUser(data[1]);
    });


    function addUser(office) {

        var promise = user.addOne({
            email: email,
            password: _pass,
            username: username,
            phone: phone,
            qq: qq,
            sex: sex,
            office: office._id,
            level: VARS.config.premission.admin, //默认超级权限
            registerTime: new Date(),
            loginTime: new Date(),
            loginTimes: 1
        });

        promise.then(function () {
            req.session.message1 = '注册管理员成功';
            res.redirect('/user/login');
        });
    }

}

function loginGet(req, res, next) {
    var message = req.session.message1;
    req.session.message = null;
    res.render('user/login', {
        message: message
    });
}

function login(req, res) {
    var email = req.param('email'),
        password = req.param('password'),
        remember = req.param('remember');

    var _pass = util.crypto(password);

    user.findOne({email: email, password: _pass})
        .then(function (user) {
            if (user) {
                req.session.user = user;

                if (remember) {
                    res.cookie('userId', user._id, {
                        expires: new Date(Date.now() + VARS.config.cookie_expires),
                        httpOnly: true,
                        path: '/'
                    });
                }
                res.redirect('/dashboard');
            } else {
                res.render('user/login', {
                    message: '用户名密码不正确'
                });
            }
        });
}

function userList(req, res) {
    var page = req.param('page');

    if (!page) {
        page = 0;
    } else {
        page--;
    }

    page = page < 0 ? 0 : page;

    var perpage = 10;
    var queryQ = Q.all([
        user.findAll({}, page, perpage),
        user.count({})
    ]);

    queryQ.then(function (data) {
        var total = Math.ceil(data[1] / perpage);
        var userList = data[0];

        var queryAry = [];
        userList.forEach(function (user) {
            user._sex = (['女', '男'])[user.sex];
            user._loginTime = util.dateFormat(user.loginTime);
            user._registerTime = util.dateFormat(user.registerTime);

            queryAry.push(office.findOne({_id:user.office}));
        });

        Q.all(queryAry)
            .then(function(officeList){

                officeList.forEach(function(office,index){
                    userList[index]._office = office.name;
                });

                res.render('user/list', {
                    userList: userList,
                    pages: {
                        link: '/user/',
                        total: total,
                        current: page + 1 > total ? total : page
                    }
                });
            });

    });


}

function logout(req, res, next) {

    req.session.user = null;
    res.cookie('userId', null, {
        expires: new Date(Date.now() - 100),
        httpOnly: true,
        path: '/'
    });

    res.redirect('/user/login');

}

function users(req, res, next) {

    var term = req.param('term');
    var projectId = req.param('projectId');

    var termReg = new RegExp(term, 'i');

    user.findAll({username: termReg})
        .then(function (users) {

            var _users = [];
            users.forEach(function (userItem) {
                _users.push({
                    id: userItem._id,
                    value: userItem.username
                })
            });

            res.json(_users);

        }, function () {
            res.json([]);
        });
}

function getProjectUsers(req,res,next){
    var term = req.param('term');
    var projectId = req.param('projectId');

    var termReg = new RegExp(term, 'i');

    Q.all([
        user.findAll({username: termReg}),
        project.findOne({_id:projectId})
    ]).then(function(data){
        var users = data[0];
        var projectItem = data[1];
        var _users = [];

        if(projectItem){
            var projectMembers = {};
            projectMembers[projectItem.projectMan] = true;
            projectMembers[projectItem.productMan] = true;
            projectMembers[projectItem.testMan] = true;
            projectMembers[projectItem.publishMan] = true;

            projectItem.members.forEach(function(member){
                projectMembers[member] = true;
            });
        }

        users.forEach(function(userItem){
            if(projectMembers[userItem._id]){
                _users.push({
                    id: userItem._id,
                    value: userItem.username
                })
            }
        });

        res.json(_users);
    })
}

function addGet(req, res, next) {

    var message = req.session.message;
    req.session.message = null;

    office.findAll()
        .then(function(officeList){
            res.render('user/add',{
                officeList : officeList,
                levels : VARS.config.premission,
                message : message
            });
        });
}

function addFresh(req, res, next) {
    var email = req.param('email'),
        username = req.param('username'),
        office = req.param('office'),
        level = req.param('level');

    if (!email || !username) {
        req.session.message = '邮箱和用户名必须填';
        res.redirect('/user/add');
        return;
    }

    user.findOne({email: email})
        .then(function (user) {
            if (!user) {
                addFreshUser();
            } else {
                req.session.message = '添加失败，用户名重复';
                res.redirect('/user/add')
            }
        });

    function addFreshUser() {

        var promise = user.addOne({
            email: email,
            password: util.crypto(VARS.config.defaultPass),
            username: username,
            sex: 1,
            office: office,
            level:level,
            registerTime: new Date()
        });

        promise.then(function (err) {
            req.session.message = '添加新用户成功';
            res.redirect('/user/add')
        });
    }
}

module.exports.loginGet = loginGet;
module.exports.addUser = addUser;
module.exports.login = login;
module.exports.userList = userList;
module.exports.logout = logout;
module.exports.users = users;
module.exports.getProjectUsers = getProjectUsers;
module.exports.addGet = addGet;
module.exports.addFresh = addFresh;
