
const gulp = require('gulp');
const { exec } = require('child_process');



gulp.task('Generate_package.json', function (done) {
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



gulp.task('Create_Base_Icon_Manifest', function (done) {
    exec('node src/scripts/js/create_icon_manifests.js', (err, stdout, stderr) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log(stdout);
        console.error(stderr);
        done();
    });
});


gulp.task('Generate_Preview_Images', function (done) {
    exec('node src/generator/js/generate_preview_images.js', (err, stdout, stderr) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log(stdout);
        console.error(stderr);
        done();
    });
});




// gulp.task('WebPack_Watch', (cb) => {
//     exec('npx webpack --mode development --watch', (err, stdout, stderr) => {
//         console.log(stdout);
//         console.error(stderr);
//         cb(err);
//     });
// });



// gulp.task('wp_watch', (cb) => {
//     const webpackProcess = exec('npx webpack --mode development --watch');

//     // Pipe stdout and stderr to the main process's output
//     webpackProcess.stdout.pipe(process.stdout);
//     webpackProcess.stderr.pipe(process.stderr);

//     webpackProcess.on('exit', (code) => {
//         if (code !== 0) {
//             console.error(`Webpack process exited with code ${code}`);
//             cb(new Error(`Webpack process exited with code ${code}`));
//         } else {
//             cb();
//         }
//     });
// });
