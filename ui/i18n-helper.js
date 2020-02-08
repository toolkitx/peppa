/*
* A simple function to convert Resource.resx file to json
* Default source file path is "D:/Resources.resx"
* How to use: node i18n-helper.js
*
* */

const fs = require('fs');
const path = require('path');
const regex = /<data name="(.*)" xml:space="preserve">[\s\S]*?<value>(.*)<\/value>[\s\S]*?<\/data>/mg;

const sourceFile = 'E:\\peppa\\backend\\Main\\S365.MainService\\ErrorMessages.resx';
const targetFile = path.join(__dirname, 'dist', `ErrorMessage.${Date.now()}.json`);

fs.readFile(sourceFile, 'utf8', function (err, contents) {
    if (!err) {
        matchItems(contents);
    } else {
        console.log(err);
    }
});

function matchItems(contents) {
    const matches = {};
    let m;
    do {
        m = regex.exec(contents);
        if (m) {
            matches[RegExp.$1.trim()] = RegExp.$2.trim();
        }
    } while (m);

    fs.writeFile(targetFile, JSON.stringify(matches,null, '\t'), function (err) {
        if (!err) {
            console.log('Done');
        } else {
            console.log(err);
        }
    })
}
