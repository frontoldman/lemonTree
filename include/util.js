/**
 * Created by zhangran on 15/3/2.
 */
var moment = require('moment');
var crypto = require('crypto');

module.exports = {
    dateFormat:function(date){
        var result = moment(date).format('YYYY年MM月DD日hh:mm:ss dddd');
        return result;
    },
    crypto:function(text){
        var sha1 = crypto.createHash('sha1');
        sha1.update(text);
        return sha1.digest('hex');
    }
};