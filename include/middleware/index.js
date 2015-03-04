/**
 * Created by zhangran on 15/2/25.
 */
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');

var auth = require('./auth');
var routes = require('./routes');

module.exports = function (app) {
    // uncomment after placing your favicon in /public
    //app.use(favicon(__dirname + '/public/favicon.ico'));
    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(cookieParser());
    app.use(session({
        secret: VARS.config.session_secret,
        key: 'sid',
//    store: new MongoStore({
//        db: config.db_name
//    }),
        resave: true,
        saveUninitialized: true
    }));
    app.use(express.static(path.join(VARS.DOCUMENT_ROOT, 'public')));

    //中间件执行
    app.use(routes.routeStatus);

    //检查登陆状态
    app.use(auth.checkLogin);
    app.get('/user/login',auth.loginAuth);
    app.get('/user/register',auth.loginAuth);


};