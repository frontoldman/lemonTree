/**
 * Created by zhangran on 15/3/11.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var OfficeSchema = new Schema({
    level : { type : Number , default : 3 },
    name  : { type : String }
});

mongoose.model('Office', OfficeSchema);