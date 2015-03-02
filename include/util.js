/**
 * Created by zhangran on 15/3/2.
 */
var moment = require('moment');


module.exports = {
    dateFormat:function(date){
        var result = moment(date).format('YYYY年MM月DD日hh:mm:ss dddd');
        return result;
    }
};