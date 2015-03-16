/**
 * Created by zhangran on 15/3/3.
 */

var user = require('../proxy/').user;
var office = require('../proxy/').office;

module.exports.checkLogin = function(req,res,next){

    //忽略一些路由 /user/login /user/register
    if('/user/login' === req.url  || req.url === '/user/register'){
        next();
        return;
    }

    checkLogStatus(req,res,next,1,function(){
        res.redirect('/user/login');
    });
};

module.exports.loginAuth = function(req,res,next){
    checkLogStatus(req,res,next,2,function(){
        res.redirect('/dashboard');
    });
};

function checkLogStatus(req,res,next,status,callback){

    if(req.session.user){   //有session next()
        res.locals.user = req.session.user;
        if(status == 1){
            next();
        }else{
            callback();
        }


    }else if(req.cookies.userId){   //没有session,有cookie，则查找此人
        var userId = req.cookies.userId;
        user.findOne({
            _id : userId
        }).then(function(userItem){     //找到则附在session上
            if(userItem){
                req.session.user = userItem;
                res.locals.user = userItem;

                if(status == 1){
                    next();
                }else{
                    callback();
                }
            }
        },function(data){   //否则跳转到登陆页

            if(status == 1){
                callback();
            }else{
                next();
            }

        });

    }else{

        if(status == 1){
            callback();
        }else{
            next();
        }

    }
}

module.exports.checkPermission = function(req,res,next){
    var user = req.session.user;


};