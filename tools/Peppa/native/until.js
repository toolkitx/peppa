const util = require('util');
const path = require('path');
const fs = require('fs');

const isFileExists = async (filePath) => {
    const exists = util.promisify(fs.exists);
    return await exists(filePath);
};

const readJson = async (filePath, encoding = 'utf8') => {
    const data = await readRawFile(filePath, encoding);
    return JSON.parse(data);
};

const readRawFile= async (filePath, encoding = 'utf8') => {
    const readFile = util.promisify(fs.readFile);
    return await readFile(filePath, {encoding});
};

const getFiles = async (dir, ext = '.json') => {
    const readdir = util.promisify(fs.readdir);
    const dirs = await readdir(dir);
    if (dirs) {
        return dirs.filter((name) => {
            const path = path.join(dir, name);
            const isFile = fs.statSync(path).isFile();
            if (!isFile) {
                return false;
            }
            if (ext && path.extname(name).toLowerCase() !== ext.toLowerCase()) {
                return false;
            }
            return true;
        });
    } else {
        return [];
    }
};

const newRequestId = () => {
    return `req-${new Date().getTime() + Math.floor((Math.random() * 100) + 1)}`;
}

exports.isFileExists = isFileExists;
exports.readJson = readJson;
exports.readRawFile = readRawFile;
exports.getFiles = getFiles;
exports.newRequestId = newRequestId;
