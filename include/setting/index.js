/**
 * Created by zhangran on 15/2/26.
 */
var path = require('path');

module.exports = function(app){
    // view engine setup
    app.set('views', path.join(VARS.EXECUTE_ROOT, 'views'));
    app.set('view engine', 'ejs');
};