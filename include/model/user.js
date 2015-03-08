/**
 * Created by zhangran on 15/2/27.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    username     : { type : String },
    password     : { type : String },
    name         : { type : String },
    office       : { type : Number },
    email        : { type : String },
    sex          : { type : Number },
    phone        : { type : String },
    qq           : { type : String },
    registerTime : { type : Date   },
    loginTime    : { type : Date   },
    loginTimes   : { type : Number }
});

mongoose.model('User', UserSchema);