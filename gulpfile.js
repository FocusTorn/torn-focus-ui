
const gulp = require('gulp');
const { exec } = require('child_process');
var watch = require('gulp-watch');
var batch = require('gulp-batch');




// //- nodemon version generate-package.json------->>

// const nodemon = require('nodemon');

// gulp.task('generate-package.json', function (done) {
//     nodemon({
//         script: 'src/scripts/js/generate-package.js',
//         ext: 'js',

//     });
//     done();
// });

// //----------------------------------------------------------------<<

gulp.task('generate-package-json', function (done) {
    exec('node src/scripts/js/generate-package.js', (err, stdout, stderr) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log(stdout);
        console.error(stderr);
        done();
    });
});



gulp.task('create_base_manifest', function (done) {
    exec('node src/generator/js/create_base_manifest.js', (err, stdout, stderr) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log(stdout);
        console.error(stderr);
        done();
    });
});


gulp.task('Do__Icon-Preview-html', function (done) {
    exec('node src/generator/js/generate_file_icon_preview_html.js', (err, stdout, stderr) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log(stdout);
        console.error(stderr);
        done();
    });
});





// gulp.task('watch', function () {
//     watch('src/extension/commands/_commands.json', batch(function (events, done) {
//         gulp.start('generate-package-json', done);
//     }));
// });

// gulp.task('Watch_commands-json', gulp.series('generate-package-json', 'watch'));




