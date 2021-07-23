import fs from "fs";
import path from "path";
import iconv from "./iconv-lite/lib/index";
import fxp from "fast-xml-parser";
import jschardet from "jschardet";
import officegen from "officegen";
import xlsx from "node-xlsx";
import db from "../datastore";
import WordEdit from "./office-edit/wordEdit";
const mammoth = require("./mammoth/lib/index");

export default class ExportService {
  constructor() {
    // 最大文件为10M
    this.maxLength = 10485760;
    this.xliffTemplate = {
      xliff: {
        _attrs: {
          "mlns:sdl": "http://sdl.com/FileTypes/SdlXliff/1.0",
          xmlns: "urn:oasis:names:tc:xliff:document:1.2",
          version: "1.2",
          "sdl:version": "1.0",
        },
        file: {
          body: {
            group: [],
          },
        },
      },
    };
    this.tmxTemplate = {
      tmx: {
        _attrs: {
          version: "1.4",
        },
        body: {
          tu: [],
        },
      },
    };
    this.tbxTemplate = {
      martif: {
        _attrs: {
          type: "TBX",
          "xml:lang": "en-US",
        },
        text: {
          body: {
            termEntry: [],
          },
        },
      },
    };
  }

  getFileSize (pathUrl, status) {
    return new Promise((resolve, reject) => {
      fs.stat(pathUrl, (err, data) => {
        if (err) {
          reject(err);
          return;
        }
        console.log(data.size);
        if (status) {
          resolve(data);
        } else if (data.size < this.maxLength) {
          resolve(data);
        } else {
          reject({
            message: "单个文件大小限定为10MB",
          });
        }
      });
    });
  }

  getDownPath () {
    return path.join(__dirname, "../../");
  }

  deleteFileByPath (path) {
    fs.unlinkSync(path);
  }

  getFileContent (pathUrl, isBuffer) {
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
  getCurrentDate () {
    var now = new Date();
    var year = now.getFullYear(); //得到年份
    var month = now.getMonth(); //得到月份
    var date = now.getDate(); //得到日期
    var day = now.getDay(); //得到周几
    var hour = now.getHours(); //得到小时
    var minu = now.getMinutes(); //得到分钟
    var sec = now.getSeconds(); //得到秒
    var MS = now.getMilliseconds(); //获取毫秒
    var week;
    month = month + 1;
    if (month < 10) month = "0" + month;
    if (date < 10) date = "0" + date;
    if (hour < 10) hour = "0" + hour;
    if (minu < 10) minu = "0" + minu;
    if (sec < 10) sec = "0" + sec;
    if (MS < 100) MS = "0" + MS;
    var arr_week = new Array(
      "星期日",
      "星期一",
      "星期二",
      "星期三",
      "星期四",
      "星期五",
      "星期六"
    );
    week = arr_week[day];
    var time = "";
    time =
      year + "-" + month + "-" + date + " " + hour + ":" + minu + ":" + sec;
    return time;
  }
  createXMlByJSON (obj, template) {
    return new fxp.j2xParser({
      format: true,
      attrNodeName: "_attrs",
    }).parse(obj);
  }

  createJSONByXML (xml) {
    console.log(xml);
    return fxp.parse(xml);
  }

  createJSONByXlsx (pathUrl) {
    return xlsx.parse(fs.readFileSync(pathUrl));
  }
  getWordContent (path) {
    return new Promise((resolve, reject) => {
      mammoth
        .convertToHtml({ path })
        .then(
          (result) => {
            // var text = result.value; // The raw text
            var text = result.value; // The raw text
            document.getElementById("wordId").innerHTML = text;
            resolve(document.getElementById("wordId").innerText);
          },
          (e) => {
            resolve("");
          }
        )
        .done();
    });
  }

  formatContentByTxt (config, content) {
    const ary = content.split(/\n|\r/);
    const aryRef = ary.filter((d) => d.trim());
    const result = {
      content: aryRef,
      source: [],
      target: [],
      length: 0,
      "source-lang": [],
      "target-lang": [],
    };
    result.content = aryRef.map((item, index) => {
      // 手动插入
      // if (["txt", "docx"].includes(config.suffix)) {
      //   if (config.insert.before) {
      //     item = config.insert.before + item;
      //   }
      //   if (config.insert.after) {
      //     item = item + config.insert.after;
      //   }
      // }
      if (index % 2 === 0) {
        result.source.push(item);
      } else {
        result.target.push(item);
      }
      return item;
    });

    console.log(result);
    result.length =
      result.source.length > result.target.length
        ? result.source.length
        : result.target.length;
    if (
      ["txt"].includes(config.suffix) &&
      config.separate.type === 1 &&
      config.separate.character
    ) {
      const resultTxt = [];
      let length =
        result.source.length > result.target.length
          ? result.source.length
          : result.target.length;
      for (let i = 0; i < length; i++) {
        if (result.source[i] && result.target[i]) {
          resultTxt.push(
            result.source[i] + config.separate.character + result.target[i]
          );
        } else if (result.source[i]) {
          resultTxt.push(result.source[i] + config.separate.character);
        } else if (result.target[i]) {
          resultTxt.push(config.separate.character + result.target[i]);
        }
      }
      return resultTxt;
    }
    console.log(result);
    return result;
  }
  exportXlsx (config, content, downUrl, status) {
    const contentJSON = this.formatContentByTxt(config, content);
    const result = Object.assign({}, this.tmxTemplate);
    const userId = db
      .read()
      .get("userId")
      .value();
    const nowDate = this.getCurrentDate();
    const jsonArrays = [];
    if (config.lang.isZh && config.lang.isEn) {
      jsonArrays.push([
        "source",
        "target",
        "source-lang",
        "target-lang",
        "creationdate",
        "creationid",
        "changedate",
        "changeid",
      ]);
    } else if (config.lang.isZh) {
      jsonArrays.push([
        "source",
        "source-lang",
        "creationdate",
        "creationid",
        "changedate",
        "changeid",
      ]);
    } else if (config.lang.isEn) {
      jsonArrays.push([
        "target",
        "target-lang",
        "creationdate",
        "creationid",
        "changedate",
        "changeid",
      ]);
    } else {
      jsonArrays.push([
        "source",
        "target",
        "source-lang",
        "target-lang",
        "creationdate",
        "creationid",
        "changedate",
        "changeid",
      ]);
    }
    for (let i = 0; i < contentJSON.length; i++) {
      if (config.lang.isZh && config.lang.isEn) {
        jsonArrays.push([
          contentJSON.source[i],
          contentJSON.target[i],
          config.langObj.source,
          config.langObj.target,
          nowDate,
          userId,
          nowDate,
          userId,
        ]);
        // jsonArray.push({
        //   source: contentJSON.source[i],
        //   target: contentJSON.target[i],
        //   "source-lang": config.langObj.source,
        //   "target-lang": config.langObj.target,
        // });
      } else if (config.lang.isZh) {
        jsonArrays.push([
          contentJSON.source[i],
          config.langObj.source,
          nowDate,
          userId,
          nowDate,
          userId,
        ]);
        // jsonArrays.push([contentJSON.source[i], config.langObj.source]);
      } else if (config.lang.isEn) {
        jsonArrays.push([
          contentJSON.target[i],
          config.langObj.target,
          nowDate,
          userId,
          nowDate,
          userId,
        ]);
      } else {
        jsonArrays.push([
          contentJSON.source[i],
          contentJSON.target[i],
          config.langObj.source,
          config.langObj.target,
          nowDate,
          userId,
          nowDate,
          userId,
        ]);
      }
    }
    var buffer = xlsx.build([{ name: "sheet1", data: jsonArrays }]);
    fs.writeFileSync(
      status ? downUrl : downUrl + path.sep + config.name + ".xlsx",
      buffer,
      {
        flag: "w",
      }
    );
    return Promise.resolve({
      name: config.name + ".xlsx",
      path: downUrl,
    });
  }
  exportTmx (config, content, downUrl, status) {
    const contentJSON = this.formatContentByTxt(config, content);
    const result = Object.assign({}, this.tmxTemplate);
    for (let i = 0; i < contentJSON.length; i++) {
      const { source, target } = contentJSON;
      result.tmx.body.tu.push({
        tuv: [
          {
            _attrs: {
              "xml:lang": config.langObj.target,
            },
            seg: target[i],
          },
          {
            _attrs: {
              "xml:lang": config.langObj.source,
            },
            seg: source[i],
          },
        ],
      });
    }
    fs.writeFileSync(
      status ? downUrl : downUrl + path.sep + config.name + ".tmx",
      `<?xml version="1.0" encoding="utf-8"?>
${this.createXMlByJSON(result).toString()}`
    );
    return Promise.resolve({
      name: config.name + ".tmx",
      path: downUrl,
    });
  }
  exportTxt (config, content, downUrl, status) {
    const contentJSON = this.formatContentByTxt(config, content);
    console.log(downUrl + path.sep + config.name + ".txt");
    if (Array.isArray(contentJSON)) {
      fs.writeFileSync(
        status ? downUrl : downUrl + path.sep + config.name + ".txt",
        contentJSON.join("\n")
      );
      return Promise.resolve({
        name: config.name + ".txt",
        path: downUrl,
      });
    } else {
      if (config.format !== "utf8") {
        if (config.lang.isZh || config.lang.isEn) {
          let resolve = null
          if (config.lang.isZh) {
            fs.writeFileSync(
              status ? downUrl : downUrl + path.sep + config.name + "-zh.txt",
              iconv.encode(contentJSON.source.join("\n"), config.format)
            );
            resolve = Promise.resolve({
              name: config.name + "-zh.txt",
              path: downUrl,
            });
          }
          if (config.lang.isEn) {
            fs.writeFileSync(
              status ? downUrl : downUrl + path.sep + config.name + "-en.txt",
              iconv.encode(contentJSON.target.join("\n"), config.format)
            );
            resolve = Promise.resolve({
              name: config.name + "-en.txt",
              path: downUrl,
            });
          }
          return resolve
        } else {
          fs.writeFileSync(
            status ? downUrl : downUrl + path.sep + config.name + ".txt",
            iconv.encode(contentJSON.content.join("\n"), config.format)
          );
          return Promise.resolve({
            name: config.name + ".txt",
            path: downUrl,
          });
        }
      } else {
        if (config.lang.isZh || config.lang.isEn) {
          let resolve = null
          if (config.lang.isZh) {
            fs.writeFileSync(
              status ? downUrl : downUrl + path.sep + config.name + "-zh.txt",
              contentJSON.source.join("\n")
            );
            resolve = Promise.resolve({
              name: config.name + "-zh.txt",
              path: downUrl,
            });
          }
          if (config.lang.isEn) {
            fs.writeFileSync(
              status ? downUrl : downUrl + path.sep + config.name + "-en.txt",
              contentJSON.target.join("\n")
            );
            resolve = Promise.resolve({
              name: config.name + "-en.txt",
              path: downUrl,
            });
          }
          return resolve
        } else {
          fs.writeFileSync(
            status ? downUrl : downUrl + path.sep + config.name + ".txt",
            contentJSON.content.join("\n")
          );
          return Promise.resolve({
            name: config.name + ".txt",
            path: downUrl,
          });
        }
      }
    }
  }
  exportDocx (config, content, downUrl, status) {
    const contentJSON = this.formatContentByTxt(config, content);
    const docx = officegen("docx");
    if (Array.isArray(contentJSON)) {
      contentJSON.forEach((item) => {
        const pObj = docx.createP();
        pObj.addText(item);
      });
    } else {

      if (config.lang.isZh || config.lang.isEn) {
        let resolve = null;

        if (config.lang.isZh) {
          contentJSON.source.forEach((item) => {
            const pObj = docx.createP();
            pObj.addText(item);
          });

          var out = fs.createWriteStream(
            status ? downUrl : downUrl + path.sep + config.name + "-zh.docx"
          );
          docx.generate(out);

          resolve = Promise.resolve({
            name: config.name + "-zh.docx",
            path: downUrl,
          });
        }

        if (config.lang.isEn) {
          contentJSON.target.forEach((item) => {
            const pObj = docx.createP();
            pObj.addText(item);
          });

          var out = fs.createWriteStream(
            status ? downUrl : downUrl + path.sep + config.name + "-en.docx"
          );
          docx.generate(out);

          resolve = Promise.resolve({
            name: config.name + "-en.docx",
            path: downUrl,
          });
        }

        // WordEdit.wordDelNoteFoot('D:\\data\\input.docx', 'D:\\data\\output.docx');

        return resolve

      } else {
        contentJSON.content.forEach((item) => {
          const pObj = docx.createP();
          pObj.addText(item);
        });

        var out = fs.createWriteStream(
          status ? downUrl : downUrl + path.sep + config.name + ".docx"
        );
        docx.generate(out);

        return Promise.resolve({
          name: config.name + ".docx",
          path: downUrl,
        });
      }
    }
  }
  exportTbx (config, content, downUrl, status) {
    const contentJSON = this.formatContentByTxt(config, content);
    const result = Object.assign({}, this.tbxTemplate);
    for (let i = 0; i < contentJSON.length; i++) {
      const { source, target } = contentJSON;
      result.martif.text.body.termEntry.push({
        _attrs: {
          "xml:lang": config.langObj.target,
        },
        descrip: target[i],
        langSet: {
          tig: {
            _attrs: {
              "xml:lang": config.langObj.source,
            },
            term: source[i],
          },
        },
      });
    }
    fs.writeFileSync(
      status ? downUrl : downUrl + path.sep + config.name + ".tbx",
      `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE martif PUBLIC "ISO 12200:1999A//DTD MARTIF core (DXFcdV04)//EN" "TBXcdv04.dtd">
${this.createXMlByJSON(result).toString()}
      `
    );
    return Promise.resolve({
      name: config.name + ".tbx",
      path: downUrl,
    });
  }
  exportXliff (config, content, downUrl, status) {
    const contentJSON = this.formatContentByTxt(config, content);
    const result = Object.assign({}, this.xliffTemplate);
    for (let i = 0; i < contentJSON.length; i++) {
      const { source, target } = contentJSON;
      result.xliff.file.body.group.push({
        "trans-unit": {
          "seg-source": {
            g: {
              _attrs: {
                "xml:lang": config.langObj.source,
              },
              mrk: source[i],
            },
          },
          source: {
            g: source[i],
          },
          target: {
            g: {
              _attrs: {
                "xml:lang": config.langObj.target,
              },
              mrk: target[i],
            },
          },
        },
      });
    }
    fs.writeFileSync(
      status ? downUrl : downUrl + path.sep + config.name + ".xliff",
      `<?xml version="1.0" encoding="utf-8"?>
${this.createXMlByJSON(result).toString()}
      `
    );
    return Promise.resolve({
      name: config.name + ".xliff",
      path: downUrl,
    });
  }
}
