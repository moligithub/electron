const Datastore = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const path = require("path");
const fs = require("fs-extra");
const { app, remote } = require("electron");
const APP = process.type === "renderer" ? remote.app : app; // 根据process.type来分辨在哪种模式使用哪种模块

const STORE_PATH = APP.getPath("userData"); // 获取electron应用的用户目录
// 我的是C:\Users\wsl\AppData\Roaming\Electron
// 判断路径是否存在，若不存在，就创建
if (process.type !== "renderer") {
  if (!fs.pathExistsSync(STORE_PATH)) {
    fs.mkdirpSync(STORE_PATH);
  }
}
// 初始化lowdb读写的json文件名以及存储路径
const adapter = new FileSync(path.join(STORE_PATH, path.sep+"data.json"));

const db = Datastore(adapter); // lowdb接管该文件

class DbMap {
  constructor() {
    this.db = {};
  }

  add(name) {
    const adapter = new FileSync(path.join(STORE_PATH, path.sep + name + ".json"));
    const newDb = Datastore(adapter); // lowdb接管该文件
    this.db[name] = newDb;
    return this;
  }
  get(name) {
    const adapter = new FileSync(path.join(STORE_PATH, path.sep + name + ".json"));
    const newDb = Datastore(adapter); // lowdb接管该文件
    return newDb;
  }
  delete(name) {
    delete this.db[name];
    fs.unlinkSync(path.join(STORE_PATH, path.sep + name + ".json"));
  }
}

module.exports = {
  db,
  dbMap: new DbMap(),
};
