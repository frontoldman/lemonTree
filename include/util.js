/**
 * Created by zhangran on 15/3/2.
 */
var moment = require('moment');
var crypto = require('crypto');

module.exports = {
    //格式化日期格式
    dateFormat: function (date, formater) {
        if (!formater) {
            formater = 'YYYY-MM-DD';
        }
        var result = moment(date).format(formater);
        return result;
    },
    //加密
    crypto: function (text) {
        var sha1 = crypto.createHash('sha1');
        sha1.update(text);
        return sha1.digest('hex');
    },
    //获取工作时长
    getWorkingHours: function (startDate, endDate) {

        startOfZero(startDate);
        startOfZero(endDate);

        var resetTime = endDate.getTime() - startDate.getTime();
        resetTime = resetTime < 0 ? 0 : resetTime;
        var result = resetTime / 1000 / 60 / 60 / 24 * 7;

        return Math.ceil(result);

        function startOfZero(time) {
            time.setHours(0);
            time.setMinutes(0);
            time.setSeconds(0);
        }
    }
};