const gulp = require('gulp');
const { exec } = require('node:child_process');

gulp.task('generate___package-json', (done) => {
    exec('bun src/scripts/js/generate___package-json.js', (err, stdout, stderr) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log(stdout);
        console.error(stderr);
        done();
    });
});

gulp.task('generate___icon-manifests', (done) => {
    exec('bun src/scripts/js/generate___icon-manifests.mjs', (err, stdout, stderr) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log(stdout);
        console.error(stderr);
        done();
    });
});


gulp.task('generate___preview-images', (done) => {
    exec('bun src/scripts/js/generate___preview-images.js', (err, stdout, stderr) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log(stdout);
        console.error(stderr);
        done();
    });
});


gulp.task('optimize___assets-icons', (done) => {
    exec('bun src/scripts/js/optimize___assets-icons.js', (err, stdout, stderr) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log(stdout);
        console.error(stderr);
        done();
    });
});

gulp.task('apex_optimize-generate-pack', gulp.series(
    'optimize___assets-icons',
    'generate___icon-manifests',
    'generate___package-json'
));

