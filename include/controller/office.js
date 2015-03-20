/**
 * Created by zhangran on 15/3/16.
 */

var Q = require('q');
var office = require('../proxy/').office;

function addOffice(req, res, next) {
    var officeMessage = req.session.officeMessage;
    req.session.officeMessage = null;
    res.render('office/add', {
        message: officeMessage
    })
}

function addAndSave(req, res, next) {
    var name = req.param('name');

    office.addOne({
        name: name
    })
        .then(function () {
            req.session.officeMessage = '添加成功';
            res.redirect('/office/add');
        }, function () {
            next();
        });
}

function list(req, res, next) {
    var page = req.param('page');

    if (!page) {
        page = 0;
    } else {
        page--;
    }

    page = page < 0 ? 0 : page;

    var perpage = 10;
    var queryQ = Q.all([
        office.findAll({}, page, perpage),
        office.count({})
    ]);

    queryQ.then(function (data) {
        var total = Math.ceil(data[1] / perpage);
        var officeList = data[0];

        res.render('office/list', {
            list: officeList,
            pages: {
                link: '/office',
                total: total,
                current: page + 1 > total ? total : page
            }
        });
    });

}

function edit(req, res, next) {
    var id = req.param('id');

    office.findOne({_id: id})
        .then(function (officeItem) {
            res.render('office/edit', {
                office: officeItem
            });
        }, function () {
            next();
        });
}

function editAndSave(req, res, next) {
    var id = req.param('id'),
        name = req.param('name');

    office.update({
        _id: id,
        name: name
    }).then(function () {
        res.redirect('/office/');
    });
}

function remove(req, res, next) {
    var id = req.param('id');

    office.remove({_id: id})
        .then(function () {
            res.redirect('/office');
        }, function () {
            next()
        })
}

module.exports.addOffice = addOffice;
module.exports.addAndSave = addAndSave;
module.exports.list = list;
module.exports.edit = edit;
module.exports.editAndSave = editAndSave;
module.exports.remove = remove;