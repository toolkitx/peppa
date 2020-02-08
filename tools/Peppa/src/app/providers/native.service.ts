import { Injectable } from '@angular/core';
import { ElectronService } from './electron.service';

@Injectable()
export class NativeService {

    constructor(private electron: ElectronService) {
    }

    openFileDialog(title = 'Open', filters = [{
        name: 'JSON Files',
        extensions: ['json']
    }], property: 'openFile' | 'openDirectory' = 'openFile') {
        const {dialog} = this.electron.remote;
        const options = {
            title,
            filters,
            properties: [property]
        };
        return new Promise((resolve) => {
            dialog.showOpenDialog(<any> options, (file) => {
                resolve(file && file.length ? file[0] : null);
            });
        });
    }

    showSaveDialog(title = 'Save as', filters = [{
        name: 'JSON Files',
        extensions: ['json']
    }]) {
        const {dialog} = this.electron.remote;
        const options = {
            title,
            filters
        };
        return new Promise((resolve) => {
            dialog.showSaveDialog(null, <any> options, (path) => {
                resolve(path);
            });
        });
    }

    async readJson(filePath: string, encoding = 'utf8') {
        const readFile = this.electron.util.promisify(this.electron.fs.readFile);
        const data = await readFile(filePath, {encoding});
        return JSON.parse(data);
    }

    async saveJson(filePath: string, data: any, encoding = 'utf8') {
        const content = JSON.stringify(data, null, '\t');
        const writeFile = this.electron.util.promisify(this.electron.fs.writeFile);
        return await writeFile(filePath, content, {encoding});
    }

    async createFolder(path: string) {
        const mkdir = this.electron.util.promisify(this.electron.fs.mkdir);
        const isExist = await this.isFileExists(path);
        if (!isExist) {
            await mkdir(path);
        }
    }

    async getDirectories(dir: string) {
        const readdir = this.electron.util.promisify(this.electron.fs.readdir);
        const dirs: any[] = await readdir(dir);
        if (dirs) {
            return dirs.filter((name: any) => {
                const path = this.electron.path.join(dir, name);
                return this.electron.fs.statSync(path).isDirectory();
            });
        } else {
            return [];
        }
    }

    async emptyDirectory(dir: string, skipFiles?: RegExp) {
        const readdir = this.electron.util.promisify(this.electron.fs.readdir);
        const dirs: any[] = await readdir(dir);
        if (!dirs) {
            return;
        }
        await Promise.all(dirs.map(async (file) => {
            const path = this.electron.path.join(dir, file);
            const isDir = this.electron.fs.statSync(path).isDirectory();
            if (isDir) {
                await this.emptyDirectory(path, skipFiles);
                await this.electron.fs.rmdirSync(path);
            } else if (!new RegExp(skipFiles).test(file)) {
                this.electron.fs.unlinkSync(path);
            }
        }));
    }


    async getFiles(dir: string, ext = '.json') {
        const readdir = this.electron.util.promisify(this.electron.fs.readdir);
        const dirs: any[] = await readdir(dir);
        if (dirs) {
            return dirs.filter((name: any) => {
                const path = this.electron.path.join(dir, name);
                const isFile = this.electron.fs.statSync(path).isFile();
                if (!isFile) {
                    return false;
                }
                if (ext && this.electron.path.extname(name).toLowerCase() !== ext.toLowerCase()) {
                    return false;
                }
                return true;
            });
        } else {
            return [];
        }
    }

    async isFileExists(path: string) {
        const exists = this.electron.util.promisify(this.electron.fs.exists);
        return await exists(path);
    }
}
