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
                        4 : '已关闭',
                        5 : '已结束'
                    },
    logOperation : {        //用户日志
        'create':1,         //新增任务
        'designation':2,     //指派
        'log':3,            //备注
        'progress':4,       //修改进度
        'upload':5          //上传附件
    },
    projectOperation : {     //项目日志
        'create':1,         //新增项目
        "addMember":2,       //新增成员
        "addTask":3,
        "progress":4,        //修改进度
        "start":5,           //启动项目
        "close":6,           //关闭项目
        "complete":7,        //完成项目
        "pause":8            //暂停项目
    },
    premission:{
        admin:0,            //超级管理员
        modify:1,           //创建修改者
        use:2               //使用者
    }
};

config = Object.freeze(config);

module.exports = config;