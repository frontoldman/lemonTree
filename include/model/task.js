/**
 * Created by zhangran on 15/3/11.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TaskSchema = new Schema({
    name: {type: String},
    level: {type: String},
    startTime: {type: Date},
    endTime: {type: Date},
    description: {type: String},
    assigner: {type: Schema.Types.ObjectId},
    project: {type: Schema.Types.ObjectId},
    log: {type: Array, default: []},
    link: {type: Array, default: []},
    progress: {type: Number, default: 0},
    status: {type: Number, default: 1},
    adder: {type: Schema.Types.ObjectId},
    addTime: {type: Date}
});

mongoose.model('Task', TaskSchema);