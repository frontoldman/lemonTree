/**
 * Created by zhangran on 15/3/4.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProjectSchema = new Schema({
    name            : { type : String },
    code            : { type : String },
    startTime       : { type : Date },
    endTime         : { type : Date },
    status          : { type : Number },
    progress        : { type : Number },
    projectMan      : { type : String },
    productMan      : { type : String },
    testMan         : { type : String },
    publishMan      : { type : String },
    description     : { type : String },
    createTime      : { type : Date },
    createUser      : { type : String }
});

mongoose.model('Project', ProjectSchema);