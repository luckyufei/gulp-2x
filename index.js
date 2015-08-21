var path = require('path'),
    through = require('through2'),
    gutil = require('gulp-util'),
    lwip = require('node-lwip');

module.exports = function (options) {
    return through.obj(function (file, env, cb) {
        var ratio = (options && options.ratio) || 0.5;

        var basename = path.basename(file.path);

        if (basename.indexOf('@2x') < 0) {
            cb(null, file);
            return;
        }

        var dirname = path.dirname(file.path);
        var output = dirname + '\\' + basename.replace(/@2x/g, '');

        lwip.open(file.path, function (err, image) {
            image.batch()
                .scale(ratio)
                .writeFile(output, function (err) {
                    if (err) {
                        gutil.log(gutil.colors.red(err))
                    }
                });
            gutil.log(gutil.colors.green(basename + '---resize ratio ' + ratio + '---' + path.basename(output)));
            cb(null, file);
        });
    });
};