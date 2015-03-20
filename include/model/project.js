/**
 * Created by zhangran on 15/3/4.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProjectSchema = new Schema({
    name: {type: String},
    code: {type: String},
    startTime: {type: Date},
    endTime: {type: Date},
    status: {type: Number},
    progress: {type: Number},
    projectMan: {type: Schema.Types.ObjectId},
    productMan: {type: Schema.Types.ObjectId},
    testMan: {type: Schema.Types.ObjectId},
    publishMan: {type: Schema.Types.ObjectId},
    description: {type: String},
    members: {type: Array, default: []},
    log: {type: Schema.Types.Mixed, default: []},
    createTime: {type: Date},
    editTime: {type: Date},
    createUser: {type: Schema.Types.ObjectId}
});

mongoose.model('Project', ProjectSchema);