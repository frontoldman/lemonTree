
var user = require('./user');
var dashboard = require('./dashboard');
var project = require('./project');
var task = require('./task');
var office = require('./office');

module.exports = function(app){

  app.use('/dashboard',dashboard);

  app.use('/user', user);

  app.use('/project', project);

  app.use('/task', task);

  app.use('/office', office);

  // catch 404 and forward to error handler
  app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  // error handlers

  // development error handler
  // will print stacktrace
  if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: err
      });
    });
  }

  // production error handler
  // no stacktraces leaked to user
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: {}
    });
  });

};