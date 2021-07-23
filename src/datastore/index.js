import Datastore from 'lowdb'
import FileSync from 'lowdb/adapters/FileSync'
import path from 'path'
import fs from 'fs-extra'
import { app, remote } from 'electron'
function delDir (path) {
    let files = [];
    if (fs.existsSync(path)) {
        files = fs.readdirSync(path);
        files.forEach((file, index) => {
            let curPath = path + "/" + file;
            if (fs.statSync(curPath).isDirectory()) {
                delDir(curPath); //递归删除文件夹
            } else {
                fs.unlinkSync(curPath); //删除文件
            }
        });
        fs.rmdirSync(path);
    }
}
const APP = process.type === 'renderer' ? remote.app : app // 根据process.type来分辨在哪种模式使用哪种模块

const STORE_PATH = APP.getPath('userData') // 获取electron应用的用户目录
// 我的是C:\Users\wsl\AppData\Roaming\Electron
// 判断路径是否存在，若不存在，就创建
if (process.type !== 'renderer') {
    if (!fs.pathExistsSync(STORE_PATH)) {
        fs.mkdirpSync(STORE_PATH)
    }
}
fs.access(path.join(STORE_PATH, path.sep + 'tmp'), function (err) {
    if (err && err.code === 'ENOENT') {
        console.log('--->')
        fs.mkdirSync(path.join(STORE_PATH, path.sep + 'tmp'));
    }
});
// 初始化lowdb读写的json文件名以及存储路径
const adapter = new FileSync(path.join(STORE_PATH, path.sep + 'data.json'))

const db = Datastore(adapter) // lowdb接管该文件

export default db // 暴露出去 
class DbMap {
    constructor() {
        this.db = {};
        const userName = db.read().get("userInfo.name").value();
        if (userName) {
            const basePath = this.basePath = path.sep + 'tmp' + path.sep + userName + path.sep;
            fs.access(path.join(STORE_PATH, this.basePath), function (err) {
                if (err && err.code === 'ENOENT') {
                    console.log('--->')
                    fs.mkdirSync(path.join(STORE_PATH, basePath));
                }
            });
        }
    }
    initBasePath () {
        const userName = db.read().get("userInfo.name").value();
        if (userName) {
            this.basePath = path.sep + 'tmp' + path.sep + userName + path.sep;
        }
    }
    setBasePath (userName) {
        const basePath = this.basePath = path.sep + 'tmp' + path.sep + userName + path.sep;
        fs.access(path.join(STORE_PATH, this.basePath), function (err) {
            if (err && err.code === 'ENOENT') {
                console.log('--->')
                fs.mkdirSync(path.join(STORE_PATH, basePath));
            }
        });
    }
    removeDb () {
        // db.read().set("transform", {}).write();
        // delDir(path.join(STORE_PATH, path.sep + 'tmp'));
    }

    add (name) {
        this.initBasePath();
        const adapter = new FileSync(path.join(STORE_PATH, this.basePath + name + '.json'))
        const newDb = Datastore(adapter) // lowdb接管该文件
        this.db[name] = newDb;
        return this;
    }
    get (name) {
        this.initBasePath();
        const adapter = new FileSync(path.join(STORE_PATH, this.basePath + name + '.json'))
        const newDb = Datastore(adapter) // lowdb接管该文件
        return newDb;
    }
    delete (name) {
        this.initBasePath();
        delete this.db[name];
        fs.unlinkSync(path.join(STORE_PATH, this.basePath + name + '.json'));
    }
}
export const dbMap = new DbMap();