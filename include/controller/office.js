/**
 * Created by zhangran on 15/3/16.
 */

function addOffice(req,res,next){
    res.render('office/add',{})
}

function addAndSave(req,res,next){
    res.send('addSave');
}

module.exports.addOffice = addOffice;
module.exports.addAndSave = addAndSave;