const packager = require('electron-packager');
const chalk = require('chalk');
const moveFile = require('move-file');
const path = require('path');

let options = {
    dir: path.resolve('./'),
    out: path.resolve('./builds'),
    overwrite: true,
}

packager(options).then( appPaths => {
    console.log(); console.log();

    console.log(chalk.green("Success"));

    console.log(); console.log()

    console.log("Application outputed to : " + chalk.blue(appPaths));

    console.log(); console.log();
})