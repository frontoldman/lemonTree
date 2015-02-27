/**
 * Created by zhangran on 15/2/26.
 */

var mongoose = require('mongoose');
var User = require('./user');

function initDb(){
    //连接数据库
    mongoose.connect(VARS.config.db, function (err) {
        if (err) {
            console.log(err);
            //console.err('connect to s% error:', VARS.config.db, err.message);
            process.exit(1);
        }
        console.log('连接成功：' + VARS.config.db);
    });
}

module.exports = initDb;
module.exports.User = mongoose.model('User');