/**
 * Created by zhangran on 15/2/25.
 */

var config = {
    port           : 7788, //主程序监听的端口
    db             : 'mongodb://127.0.0.1:12345/lemontree',
    session_secret : 'lemontree',
    cookie_expires : 60*60*60*24*7,
    defaultPass    : '1'
};

config = Object.freeze(config);

module.exports = config;