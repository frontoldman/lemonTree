/**
 * Created by zhangran on 15/3/4.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProjectSchema = new Schema({
    name        : { type : String },
    code        : { type : String },
    startTime   : { type : Date   },
    endTime     : { type : Date   },
    status      : { type : Number },
    progress    : { type : Number },
    projectMan  : { type : Schema.Types.Mixed , default : {} },
    productMan  : { type : Schema.Types.Mixed , default : {} },
    testMan     : { type : Schema.Types.Mixed , default : {} },
    publishMan  : { type : Schema.Types.Mixed , default : {} },
    description : { type : String },
    members     : { type : Array              , default : [] },
    createTime  : { type : Date   },
    createUser  : { type : String }
});

mongoose.model('Project', ProjectSchema);