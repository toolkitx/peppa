const fs = require('fs');
const path = require('path');

const iconFolder = path.join(__dirname, 'node_modules/@ant-design/icons-angular/src/inline-svg/outline');
const dirs = fs.readdirSync(iconFolder);
let iconNames = [];
const ext = '.svg';
if (dirs) {
    iconNames = dirs.filter((name) => {
        const filePath = path.join(iconFolder, name);
        const isFile = fs.statSync(filePath).isFile();
        if (!isFile) {
            return false;
        }
        if (ext && path.extname(name).toLowerCase() !== ext.toLowerCase()) {
            return false;
        }
        return true;
    });
}
let icons = [];
iconNames.map(x => icons.push({name: x.toString().replace(ext, '')}));
fs.writeFileSync(path.join(__dirname, 'src/assets/icons.json'), JSON.stringify({icons}));
