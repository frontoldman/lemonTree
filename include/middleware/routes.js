/**
 * Created by zhangran on 15/3/4.
 */
var routesList = [
    /^\/(dashboard)/,
    /^\/(project)/,
    /^\/(task)/,
    /^\/(bug)/,
    /^\/(office)/,
    /^\/(user)/
];

function routeStatus(req,res,next){
    res.locals.routes = {};
    var url = req.url;

    routesList.forEach(function(route){
        var result = route.exec(url);
        if(Array.isArray(result) && result.length >= 2){
            res.locals.routes[result[1]] = true;
        }
    });


    next();
}

module.exports.routeStatus = routeStatus;