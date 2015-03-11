/**
 * Created by zhangran on 15/3/11.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TaskSchema = new Schema({
    name        : { type : String },
    level       : { type : String },
    startTime   : { type : Date },
    endTime     : { type : Date },
    description : { type : String },
    assigner    : { type : String },
    project     : { type : String },
    log         : { type : Array , default : [] },
    progress    : { type : Number , default : 0 },
    status      : { type : Number , default : 0 },
    adder       : { type : String },
    addTime     : { type : Date }
});

mongoose.model('Task', TaskSchema);