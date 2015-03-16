/**
 * Created by zhangran on 15/2/25.
 */

var config = {
    port           : 7788, //主程序监听的端口
    db             : 'mongodb://127.0.0.1:12345/lemontree',
    session_secret : 'lemontree',
    cookie_expires : 60*60*60*24*7,
    defaultPass    : '1',
    taskStatus  : {
                        1 : '未开始',
                        2 : '进行中',
                        3 : '已挂起',
                        4 : '已结束'
                    },
    logOperation : {        //用户日志
        'create':1,         //新增任务
        'designation':2,     //指派
        'log':3,            //备注
        'progress':4
    }
};

config = Object.freeze(config);

module.exports = config;