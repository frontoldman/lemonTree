var express = require('express');
var path = require('path');

var setting = require('./setting/');
var middleware = require('./middleware/');
var route = require('./route/');

global.VARS = {
    DOCUMENT_ROOT:__dirname.replace('include',''),
    EXECUTE_ROOT:__dirname
}


var app = express();

//初始化设置
setting(app);
//初始化中间件
middleware(app);
//初始化路由
route(app);

module.exports = app;
