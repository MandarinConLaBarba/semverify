var gutil = require('gulp-util'),
    through2 = require('through2'),
    semverify = require('./semverify')

module.exports = function (options) {

    this.filesToCheck = [];

    var thisPlugin = this;

    return through2.obj(function (file, enc, cb) {

        this.push(file);
        thisPlugin.filesToCheck.push(file);
        cb();

    }, function (cb) {

        var throughStream = this;

        try {
            var endCnt = 0;
            thisPlugin.filesToCheck.forEach(function(f) {
                var readStream = semverify.process(f.path, options.policy);
                var errors = false;
                readStream.on('data', function(data) {
                    errors = true;
                    var problem = JSON.parse(data);
                    gutil.log("Violation found in dependency: " + problem.package + " - " + problem.message);
                });

                readStream.on('end', function() {
                    endCnt++;
                    if (endCnt === thisPlugin.filesToCheck.length) {
                        if (errors) {
                            throughStream.emit('error', new gutil.PluginError('gulp-semverify', "There were policy violations with one or more of your dependencies."));
                        }
                        cb();
                    }
                });
            });

        } catch (err) {
            this.emit('error', new gutil.PluginError('gulp-semverify', err));
            cb();
        }
    });
};