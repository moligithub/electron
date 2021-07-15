const { ipcRenderer } = require("electron");
const fs = require("fs");
const jschardet = require("jschardet");
const iconv = require("../tools/iconv-lite/lib/index");
const mammoth = require("../tools/mammoth/lib/index");
const { db, dbMap } = require("../datastore/workerIndex");
const fxp = require("fast-xml-parser");
const xlsx = require("node-xlsx");
const uuid = require("uuid");
const { isAutoLogout } = require("../utils/api");
function sendMessage(action, data) {
  ipcRenderer.send("message-from-worker", {
    action: action,
    res: data,
  });
}

function getXlsxContent(pathUrl) {
  return new Promise((resolve, reject) => {
    var list = xlsx.parse(pathUrl);
    resolve(list);
  });
}
function createJSONByXlsx(pathUrl) {
  return xlsx.parse(fs.readFileSync(pathUrl));
}
function openXlsxData(url, editTabs, params, key) {
  const json = createJSONByXlsx(url);
  const result = [];
  json.forEach((item) => {
    for (let i = 1; i < item.data.length; i++) {
      result.push([item.data[i][0], item.data[i][1]]);
    }
  });
  const content = [];
  result.forEach((item) => {
    content.push(item.join("\n"));
  });
  editTabs.push({
    title: params.name,
    path: url,
    key,
  });
  dbMap
    .add(key)
    .get(key)
    .set("data", {
      content: content.join("\n"),
      path: url,
    })
    .write();
  db.read()
    .set("transform.activeKey", key)
    .write();
  db.read()
    .set("transform.tabs", editTabs)
    .write();
  console.log(content.join("\n"));
  sendMessage("handle.openfile", {
    path: "/transformationedit/" + new Date().getTime(),
    _params: params,
  });
}

function openXmlData(xmlData, url, editTabs, params, format, key) {
  editTabs = editTabs || [];
  const json = fxp.parse(xmlData);
  console.log(json, format);
  const result = [];
  if (format === "tbx") {
    json.martif.text.body.termEntry.forEach((item) => {
      result.push([item.langSet.tig.term, item.descrip]);
    });
  }
  if (format === "xliff" || format === "sdlxliff") {
    console.log(json.xliff.file.body);
    json.xliff.file.body.group.forEach((item) => {
      let obj = item["trans-unit"];
      console.log(obj);
      // if (obj) {
      //   obj = obj["seg-source"];
      // }
      if (Array.isArray(obj.target && obj.target.g && obj.target.g.mrk)) {
        obj.target.g.mrk = obj.target.g.mrk.join("");
      }
      if (
        typeof obj.source &&
        obj.source.g &&
        obj.source &&
        obj.source.g["#text"]
      ) {
        obj.source.g = obj.source.g["#text"];
      }
      result.push([
        (obj.source && obj.source.g) || "",
        (obj.target && obj.target.g && obj.target.g.mrk) || "",
      ]);
    });
  }
  if (format === "tmx") {
    json.tmx.body.tu.forEach((item) => {
      if (item.tuv.length === 2) {
        let d = [];
        if (typeof item.tuv[1].seg === "string") {
          d.push(item.tuv[1].seg);
        } else {
          d.push(item.tuv[1] && item.tuv[1].seg["#text"]);
        }

        if (typeof item.tuv[0].seg === "string") {
          d.push(item.tuv[0].seg);
        } else {
          d.push(item.tuv[0] && item.tuv[0].seg["#text"]);
        }
        result.push(d);
      }
    });
  }
  const content = [];
  result.forEach((item) => {
    content.push(item.join("\n"));
  });
  editTabs.push({
    title: params.name,
    path: url,
    key,
  });
  dbMap
    .add(key)
    .get(key)
    .set("data", {
      content: content.join("\n"),
      path: url,
    })
    .write();
  db.read()
    .set("transform.activeKey", key)
    .write();
  db.read()
    .set("transform.tabs", editTabs)
    .write();
  console.log(content.join("\n"));
  sendMessage("handle.openfile", {
    path: "/transformationedit/" + new Date().getTime(),
    _params: params,
  });
}

function getFileContent(pathUrl, isBuffer) {
  return new Promise((resolve, reject) => {
    const format = pathUrl.substring(pathUrl.lastIndexOf(".") + 1);
    fs.readFile(pathUrl, (err, con) => {
      if (err) {
        reject(err);
        return;
      }
      const chart = jschardet.detect(con);
      let data = "";
      if (isBuffer) {
        resolve(con);
      } else if (["UTF-8"].includes(chart.encoding)) {
        // resolve(con.toString());
        data = con.toString();
      } else {
        data = iconv.decode(con, chart.encoding);
        // resolve(iconv.decode(con, chart.encoding));
      }
      if (format === "srt") {
        // data = data.replace(/^[0-9]+\s*$/gm, "");
        // data = data.replace(/^\d+:\d+\S*\s*-->\s*\S*\s*\d+/gm, "")
        data = data
          .replace(/\d+\s*(\d+:?){3},\d* --> (\d+:?){3},\d*/g, "")
          .replace(/{\\an.*}/g, "")
          .replace(/{\\pos.*}/g, "")
          .replace(/(\s*\n){3,}/g, "\n\n")
          .trim();
      } else if (format === "ass") {
        data = data
          .replace(/[^]*\[Events\]\s*/, "")
          .replace(/Format:.*\s*/, "")
          .replace(/Dialogue.*,,(.*p0})?/g, "\n")
          .replace(/{.*?}/g, "")
          .replace(/\\N/g, "\n")
          .replace(/(\s*\n){3,}/g, "\n\n")
          .trim();
      }
      resolve(data);
    });
  });
}
function getTxtContent(path, format) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (err, con) => {
      const chart = jschardet.detect(con);
      let data = "";
      if (["UTF-8"].includes(chart.encoding)) {
        // resolve(con.toString());
        data = con.toString();
      } else {
        data = iconv.decode(con, chart.encoding);
        // resolve(iconv.decode(con, chart.encoding));
      }
      if (format === "srt") {
        // data = data.replace(/^[0-9]+\s*$/gm, "");
        // data = data.replace(/^\d+:\d+\S*\s*-->\s*\S*\s*\d+/gm, "")
        data = data
          .replace(/\d+\s*(\d+:?){3},\d* --> (\d+:?){3},\d*/g, "")
          .replace(/{\\an.*}/g, "")
          .replace(/{\\pos.*}/g, "")
          .replace(/(\s*\n){3,}/g, "\n\n")
          .trim();
      } else if (format === "ass") {
        data = data
          .replace(/[^]*\[Events\]\s*/, "")
          .replace(/Format:.*\s*/, "")
          .replace(/Dialogue.*,,(.*p0})?/g, "\n")
          .replace(/{.*?}/g, "")
          .replace(/\\N/g, "\n")
          .replace(/(\s*\n){3,}/g, "\n\n")
          .trim();
      }
      resolve(data);
    });
  });
}

function getWordContent(path) {
  console.log(path);
  return new Promise((resolve, reject) => {
    try {
      mammoth
        .convertToHtml({ path })
        .then(
          (result) => {
            var text = result.value; // The raw text
            document.getElementById("wordId").innerHTML = text;
            resolve({
              text: document.getElementById("wordId").innerText,
              html: text,
              type: "docx",
            });
          },
          (e) => {
            resolve({
              text: "",
              html: "",
              type: "docx",
            });
          }
        )
        .done();
    } catch (e) {
      console.log(e);
    }
  });
}
let timer = null;
let timeout = 1000;
console.log(isAutoLogout);
module.exports = {
  /**
   * 登录时调用
   * this.$ipcRenderer.send("timer.listen", {
   *    timer: item,
   * });
   */
  "timer.listen": (params) => {
    if (isAutoLogout) {
      if (timer) {
        clearTimeout(timer);
      }
      timeout = params.timer || 1000;
      timer = setTimeout(() => {
        // TODO 退出登录
        sendMessage("timer.logout");
      }, timeout);
    }
  },
  /**
   * 操作时调用
   * this.$ipcRenderer.send("timer.refresh");
   */
  "timer.refresh": () => {
    if (isAutoLogout) {
      const userId = db
        .read()
        .get("userId")
        .value();
      if (userId) {
        if (timer) {
          clearTimeout(timer);
        }
        timer = setTimeout(() => {
          sendMessage("timer.logout");
        }, timeout);
      } else {
        clearTimeout(timer);
      }
    }
  },
  /**
   * 退出登录时调用
   * this.$ipcRenderer.send("timer.remove");
   */
  "timer.remove": () => {
    if (isAutoLogout) {
      if (timer) {
        clearTimeout(timer);
      }
    }
  },
  "auto.transformation.xlsx": (params) => {
    getXlsxContent(params.path).then((res) => {
      sendMessage("auto.transformation.xlsx", res);
    });
  },
  "transformation.changeByKey": (params) => {
    const data = dbMap
      .get(params.key)
      .read()
      .get("data")
      .value();
    dbMap
      .get(params.key)
      .set("data", Object.assign(data, params.data))
      .write();
  },
  "handle.openfile": (params) => {
    const { url, name, format } = params;
    let editTabs = db
      .read()
      .get("transform.tabs")
      .value();
    const key = uuid.v4();
    console.log(key);
    if (editTabs) {
      const index = editTabs.findIndex((d) => d.path === url);
      if (index === -1) {
        if (["docx"].includes(format)) {
          getWordContent(url).then((res) => {
            editTabs.push({
              title: name,
              path: url,
              key,
            });
            dbMap
              .add(key)
              .get(key)
              .set("data", {
                content: res.text,
                html: res.html,
                type: res.type,
                path: url,
              })
              .write();
            db.set("transform.activeKey", key).write();
            db.set("transform.tabs", editTabs).write();
            sendMessage("handle.openfile", {
              path: "/transformationedit/" + key,
              _params: params,
            });
          });
        } else if (["txt", "srt", "ass"].includes(format)) {
          getTxtContent(url, format).then((res) => {
            editTabs.push({
              title: name,
              path: url,
              key,
            });
            dbMap
              .add(key)
              .get(key)
              .set("data", {
                content: res,
                path: url,
              })
              .write();
            db.set("transform.activeKey", key).write();
            db.set("transform.tabs", editTabs).write();
            sendMessage("handle.openfile", {
              path: "/transformationedit/" + key,
              _params: params,
            });
          });
        } else if (["tmx", "tbx", "xliff", "sdlxliff"].includes(format)) {
          getTxtContent(url, format).then((res) => {
            openXmlData(res, url, editTabs, params, format, key);
          });
        } else if (["xlsx".includes(format)]) {
          openXlsxData(url, editTabs, params, key);
        }
      } else {
        db.set("transform.activeKey", editTabs[index].key).write();
        sendMessage("handle.openfile", {
          path: "/transformationedit/" + key,
          _params: params,
        });
      }
    } else {
      if (["docx"].includes(format)) {
        getWordContent(url).then((res) => {
          editTabs = [
            {
              title: name,
              key,
            },
          ];
          dbMap
            .add(key)
            .get(key)
            .set("data", {
              content: res.text,
              html: res.html,
              type: res.type,
              path: url,
            })
            .write();
          db.set("transform.activeKey", key).write();
          db.set("transform.tabs", editTabs).write();
          sendMessage("handle.openfile", {
            path: "/transformationedit/" + key,
            _params: params,
          });
        });
      } else if (["txt", "srt", "ass"].includes(format)) {
        getTxtContent(url, format).then((res) => {
          editTabs = [
            {
              title: name,
              key,
            },
          ];
          dbMap
            .add(key)
            .get(key)
            .set("data", {
              content: res,
              path: url,
            })
            .write();
          db.set("transform.activeKey", key).write();
          db.set("transform.tabs", editTabs).write();
          sendMessage("handle.openfile", {
            path: "/transformationedit/" + key,
            _params: params,
          });
        });
      } else if (["tmx", "tbx", "xliff", "sdlxliff"].includes(format)) {
        getTxtContent(url, format).then((res) => {
          // this.openXmlData(res);
          openXmlData(res, url, editTabs, params, format, key);
        });
      } else if (["xlsx".includes(format)]) {
        openXlsxData(url, editTabs, params, key);
      }
    }
  },
  "file.read": (params) => {
    const { path, isBuffer, func } = params;
    fs.readFile(path, (err, con) => {
      if (isBuffer) {
        sendMessage("file.read", {
          data: con,
          _params: params,
        });
      } else {
        const chart = jschardet.detect(con);
        if (["UTF-8"].includes(chart.encoding)) {
          sendMessage("file.read", {
            data: con.toString(),
            _params: params,
          });
        } else {
          sendMessage("file.read", {
            data: iconv.decode(con, chart.encoding),
            _params: params,
          });
        }
      }
    });
  },
  "mammoth.convertToHtml": (params) => {
    const { path, func, key } = params;
    mammoth
      .convertToHtml({ path })
      .then((result) => {
        var text = result.value; // The raw text
        this.$refs.wordRef.innerHTML = text;
        sendMessage("mammoth.convertToHtml", {
          text: this.$refs.wordRef.innerText,
          html: text,
          type: "docx",
          _params: params,
        });
      })
      .done();
  },
};
