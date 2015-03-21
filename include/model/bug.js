/**
 * Created by zhangran on 15/3/20.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BugSchema = new Schema({
    name: {type: String},
    level: {type: Number},
    type: {type: Number},
    description: {type: String},
    assigner: {type: Schema.Types.ObjectId},
    log: {type: Array, default: []},
    status: {type: Number, default: 1},
    adder: {type: Schema.Types.ObjectId},
    addTime: {type: Date}
});

mongoose.model('Bug', BugSchema);