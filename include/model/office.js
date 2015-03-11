/**
 * Created by zhangran on 15/3/11.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var OfficeSchema = new Schema({
    office     : { type : Number },
    officeRole : { type : String }
});

mongoose.model('Office', OfficeSchema);