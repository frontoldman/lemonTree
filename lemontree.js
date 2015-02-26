/**
 * Created by zhangran on 15/2/26.
 */
var cluster = require('cluster');
var numCPUs = require('os').cpus().length;

var app = require('./include/init');

app.set('port', VARS.config.port || 3000);

module.exports.start = function () {
    if (cluster.isMaster) {
        console.log("master start...");

        // Fork workers.
        for (var i = 0; i < numCPUs; i++) {
            cluster.fork();
        }

        cluster.on('listening', function (worker, address) {
            console.log('listening: worker ' + worker.process.pid + ', Address: ' + address.address + ":" + address.port);
        });

        cluster.on('exit', function (worker, code, signal) {
            console.log('worker ' + worker.process.pid + ' died');
        });

    } else {
        app.listen(app.get('port'), function () {
            console.info('worker:' + cluster.worker.id);
        });
    }
};