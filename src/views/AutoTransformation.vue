<template>
  <div class="transformation-auto">
    <div v-if="!isStartTransformation" class="transformation-upload">
      <div class="header">
        <div class="breadcrumb">
          <a-breadcrumb>
            <a-breadcrumb-item>自动转换</a-breadcrumb-item>
          </a-breadcrumb>
        </div>
        <div class="handle-link">
          <a-button type="link" @click="goRecord()">查看转换记录</a-button>
        </div>
      </div>
      <button id="myFile" ref="myFile" @click="openSelectFile">UpdateFile</button>
      <div @click="clickButtonFile(0)" class="upload-container">
        <div class="icon">
          <img src="../assets/images/uploadSingle.svg" alt />
        </div>
        <div class="title">请选择打开单个文件</div>
        <!-- <div @click="changeUploadType" class="changeUploadType">
          <a>{{ type === 0 ? "批量转换" : "单文件转换" }}</a>
        </div> -->
      </div>
      <div @click="clickButtonFile(1)" class="upload-container">
        <div class="icon">
          <img src="../assets/images/uploadSingle.svg" alt />
        </div>
        <div class="title">请选择不多于5个文件打开</div>
        <!-- <div @click="changeUploadType" class="changeUploadType">
          <a>{{ type === 0 ? "批量转换" : "单文件转换" }}</a>
        </div> -->
      </div>
      <!-- <div class="footer">
        <a-button @click="startTransformation" type="primary"
          >开始解析</a-button
        >
      </div>-->
    </div>
    <div v-if="isStartTransformation && type === 0" class="transformation-start">
      <div class="transformation-title">{{ transformationFile.title }}</div>
      <div class="transformation-params">
        <div class="params-group">
          <span>导出格式：</span>
          <a-select v-model="exportConfig.suffix" style="width: 100%" placeholder="请选择文件保存格式">
            <a-select-option value="txt">TXT</a-select-option>
            <a-select-option value="tmx">TMX</a-select-option>
            <a-select-option value="tbx">TBX</a-select-option>
            <a-select-option value="xliff">XLIFF</a-select-option>
            <a-select-option value="docx">WORD</a-select-option>
            <a-select-option value="xlsx">EXCEL</a-select-option>
          </a-select>
        </div>
        <div class="params-group">
          <span>文件编码：</span>
          <a-select v-model="exportConfig.format" style="width: 100%" placeholder="请选择编码格式">
            <a-select-option value="utf8">utf-8</a-select-option>
            <a-select-option value="GBK">gbk</a-select-option>
          </a-select>
        </div>
        <div class="params-group">
          <span>设置分隔符：</span>
          <a-input
            placeholder="请输入分隔字符"
            style="width: 100%"
            v-model="exportConfig.separate.character"
          ></a-input>
        </div>
      </div>
      <div class="transformation-content">
        <template v-if="['txt', 'docx'].includes(exportConfig.suffix)">
          <div v-for="(item, index) in transformationFile.data" :key="index" class="p">
            <template
              v-if="exportConfig.separate.character"
            >{{ item[0] + exportConfig.separate.character + item[1] }}</template>
            <template v-else>
              <div>{{ item[0] }}</div>
              <div>{{ item[1] }}</div>
            </template>
          </div>
        </template>
        <template v-if="['xlsx', 'tmx', 'tbx', 'xliff'].includes(exportConfig.suffix)">
          <div class="table">
            <div class="tr t-header">
              <div class="td">source</div>
              <div class="td">target</div>
            </div>
            <div v-for="(item, index) in transformationFile.data" :key="index" class="tr">
              <div class="td">{{ item[0] }}</div>
              <div class="td">{{ item[1] }}</div>
            </div>
          </div>
        </template>
      </div>
      <div class="transformation-footer">
        <a-button type="primary" @click="exportClick">导出</a-button>
        <a-button type="dashed" style="margin-left: 20px" @click="resetFile">重新选择</a-button>
      </div>
    </div>
    <div v-if="isStartTransformation && type === 1" class="transformation-start-forder">
      <div class="header" style="margin-bottom: 15px">
        <div class="breadcrumb">
          <a-breadcrumb>
            <a-breadcrumb-item>自动转换</a-breadcrumb-item>
            <!-- <a-breadcrumb-item>
              {{
              type === 0 ? "单文件转换" : "批量转换"
              }}
            </a-breadcrumb-item> -->
          </a-breadcrumb>
        </div>
        <div class="handle-link">
          <a-button type="link">查看转换记录</a-button>
        </div>
      </div>
      <div class="title">支持tmx、tbx、ass、srt、xlsx、docx、xliff等文件的标准化批量转换</div>
      <div class="forder-body">
        <div class="forder-table table">
          <div class="tr t-header">
            <div class="td file-td">原始文档</div>
            <div class="td">目标格式文档</div>
          </div>
          <div v-for="item in transformationFiles" :key="item.path" class="tr">
            <div class="td file-td">
              {{ item.title }}
              <div @click="deleteFile(item)" class="handle-delete">
                <a>删除</a>
              </div>
            </div>
            <div class="td">
              <a-select
                v-model="item.exportConfig.suffix"
                style="width: 100%"
                placeholder="请选择文件保存格式"
              >
                <a-select-option value="txt">TXT</a-select-option>
                <a-select-option value="tmx">TMX</a-select-option>
                <a-select-option value="tbx">TBX</a-select-option>
                <a-select-option value="xliff">XLIFF</a-select-option>
                <a-select-option value="docx">WORD</a-select-option>
                <a-select-option value="xlsx">EXCEL</a-select-option>
              </a-select>
            </div>
          </div>
        </div>
      </div>
      <div class="transformation-footer">
        <a-button type="primary" @click="exportForderClick">导出</a-button>
        <a-button type="dashed" style="margin-left: 20px" @click="resetFile">重新选择</a-button>
      </div>
    </div>
    <a-modal
      v-model="modal.visible"
      title="导出"
      ok-text="确认"
      cancel-text="取消"
      @cancel="hideModal"
      wrapClassName="export-modal"
      @ok="exportOk"
    >
      <div class="input-group">
        <div class="input-title">导出格式</div>
        <div class="input-value">
          <a-select v-model="exportConfig.suffix" style="width: 320px" placeholder="请选择文件保存格式">
            <a-select-option value="txt">TXT</a-select-option>
            <a-select-option value="tmx">TMX</a-select-option>
            <a-select-option value="tbx">TBX</a-select-option>
            <a-select-option value="xliff">XLIFF</a-select-option>
            <a-select-option value="docx">WORD</a-select-option>
            <a-select-option value="xlsx">EXCEL</a-select-option>
          </a-select>
        </div>
      </div>
      <div class="input-group">
        <div class="input-title">编码格式</div>
        <div class="input-value">
          <a-select v-model="exportConfig.format" style="width: 320px" placeholder="请选择编码格式">
            <a-select-option value="utf8">utf-8</a-select-option>
            <a-select-option value="GBK">gbk</a-select-option>
          </a-select>
        </div>
      </div>
      <div class="input-group">
        <div class="input-title">原文语种</div>
        <div class="input-value">
          <!-- <a-input
            style="width: 320px"
            placeholder="请输入原文语种"
            v-model="exportConfig.langObj.source"
          ></a-input>-->
          <a-select
            v-model="exportConfig.langObj.source"
            style="width: 320px"
            placeholder="请选择原文语种"
          >
            <a-select-option value="zh-HK">中文- 中国香港</a-select-option>
            <a-select-option value="zh-MO">中文 - 中国澳门</a-select-option>
            <a-select-option value="zh-CN">中文 -中国</a-select-option>
            <a-select-option value="zh-TW">中文 -中国台湾</a-select-option>
            <a-select-option value="en-GB">英语 - 英国</a-select-option>
            <a-select-option value="en-US">英语 - 美国</a-select-option>
            <a-select-option value="fr-FR">法语 -法国</a-select-option>
            <a-select-option value="de-DE">德语 -德国</a-select-option>
            <a-select-option value="it-IT">意大利语 -意大利</a-select-option>
            <a-select-option value="ja-JP">日语 -日本</a-select-option>
            <a-select-option value="ko-KR">韩语 -韩国</a-select-option>
            <a-select-option value="ru-RU">俄语 -俄国</a-select-option>
            <a-select-option value="es-ES">西班牙语 -西班牙</a-select-option>
          </a-select>
        </div>
      </div>
      <div class="input-group">
        <div class="input-title">译文语种</div>
        <div class="input-value">
          <!-- <a-input
            style="width: 320px"
            placeholder="请输入译文语种"
            v-model="exportConfig.langObj.target"
          ></a-input>-->
          <a-select
            v-model="exportConfig.langObj.target"
            style="width: 320px"
            placeholder="请选择原文语种"
          >
            <a-select-option value="zh-HK">中文- 中国香港</a-select-option>
            <a-select-option value="zh-MO">中文 - 中国澳门</a-select-option>
            <a-select-option value="zh-CN">中文 -中国</a-select-option>
            <a-select-option value="zh-TW">中文 -中国台湾</a-select-option>
            <a-select-option value="en-GB">英语 - 英国</a-select-option>
            <a-select-option value="en-US">英语 - 美国</a-select-option>
            <a-select-option value="fr-FR">法语 -法国</a-select-option>
            <a-select-option value="de-DE">德语 -德国</a-select-option>
            <a-select-option value="it-IT">意大利语 -意大利</a-select-option>
            <a-select-option value="ja-JP">日语 -日本</a-select-option>
            <a-select-option value="ko-KR">韩语 -韩国</a-select-option>
            <a-select-option value="ru-RU">俄语 -俄国</a-select-option>
            <a-select-option value="es-ES">西班牙语 -西班牙</a-select-option>
          </a-select>
        </div>
      </div>

      <div class="input-group">
        <div class="input-title">保存路径</div>
        <div class="input-value">
          <a-input style="width: 320px" placeholder="请选择保存路径" :disabled="true" v-model="downUrl">
            <div @click="selectFolder" class="selectFolder" slot="addonAfter">选择</div>
          </a-input>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
import ExportService from "../tools/exportService.js";
const exportService = new ExportService();
import electron from "electron";
import fs from "fs";
import { Files } from "../tools/mammoth/lib/docx/files.js";
import { baseHref } from "../utils/api.js";
import path from "path";
export default {
  data() {
    const downUrl = this.$db
      .read()
      .get("export.defaultUrl")
      .value();
    return {
      type: 0, // 0-单文件上传 1-批量上传
      isStartTransformation: false,
      transformationFile: {},
      transformationFiles: [],
      downUrl: downUrl || exportService.getDownPath(),
      modal: {
        visible: false
      },
      exportConfig: {
        suffix: "txt",
        format: "utf8",
        separate: {
          character: "||",
          type: 0
        },
        langObj: {
          source: "zh-CN",
          target: "en-US"
        },
        lang: {
          isEn: true,
          isZh: true
        },
        insert: {
          before: "",
          after: ""
        }
      }
    };
  },
  methods: {
    goRecord() {
      const userId = this.$db
        .read()
        .get("userId")
        .value();
      if (userId) {
        this.$ipcRenderer.send("timer.refresh");
        this.$router.push("/changerecord");
      } else {
        this.$notification.error({
          message: "提示",
          duration: 5,
          description: "请先登录后，进行操作"
        });
      }
    },
    hideModal() {
      this.$ipcRenderer.send("timer.refresh");
      this.modal.visible = false;
    },
    selectFolder() {
      this.$ipcRenderer.send("timer.refresh");
      const url = electron.remote.dialog.showOpenDialogSync({
        properties: ["openDirectory"]
      });
      if (url && url.length > 0) {
        this.downUrl = url[0];
        this.$db.set("export.defaultUrl", url[0]).write();
      }
    },
    exportAddLog(name, path, exportConfig, file) {
      this.$ipcRenderer.send("timer.refresh");
      const formData = {
        dstFileName: exportConfig.name + "." + exportConfig.suffix,
        dstFileType: exportConfig.suffix,
        srcFileName: file.title,
        srcFileType: file.title.substring(file.title.lastIndexOf(".") + 1),
        transStatus: 1
      };
      console.log(formData);
      // TODO 添加到转换记录
      const token = this.$db
        .read()
        .get("userId")
        .value();
      console.log(token);
      this.$axios
        .post(`${baseHref}/trans-records`, formData, {
          headers: { token: token }
        })
        .then(result => {
          if (result.data.code == 1) {
            this.$notification.success({
              message: "导出成功",
              duration: 5,
              description: name + "文件已导出文件夹:[ " + path + " ]"
            });
          } else {
            this.$message.error(result.data.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
      // this.$notification.success({
      //   message: "导出成功",
      //   duration: 5,
      //   description: name + "文件已导出文件夹:[ " + path + " ]",
      // });
    },
    exportFunc(exportConfig, content, file) {
      this.$ipcRenderer.send("timer.refresh");
      switch (exportConfig.suffix) {
        case "tmx":
          exportService
            .exportTmx(exportConfig, content, this.downUrl)
            .then(({ name, path }) => {
              this.exportAddLog(name, path, exportConfig, file);
            });
          break;
        case "tbx":
          exportService
            .exportTbx(exportConfig, content, this.downUrl)
            .then(({ name, path }) => {
              this.exportAddLog(name, path, exportConfig, file);
            });
          break;
        case "txt":
          exportService
            .exportTxt(exportConfig, content, this.downUrl)
            .then(({ name, path }) => {
              this.exportAddLog(name, path, exportConfig, file);
            });
          break;
        case "docx":
          exportService
            .exportDocx(exportConfig, content, this.downUrl)
            .then(({ name, path }) => {
              this.exportAddLog(name, path, exportConfig, file);
            });
          break;
        case "xliff":
          exportService
            .exportXliff(exportConfig, content, this.downUrl)
            .then(({ name, path }) => {
              this.exportAddLog(name, path, exportConfig, file);
            });
          break;
        case "xlsx":
          exportService
            .exportXlsx(exportConfig, content, this.downUrl)
            .then(({ name, path }) => {
              this.exportAddLog(name, path, exportConfig, file);
            });
          break;
      }
    },
    exportOk() {
      this.$ipcRenderer.send("timer.refresh");
      this.exportConfig.name = this.transformationFile.title.substring(
        0,
        this.transformationFile.title.lastIndexOf(".")
      );
      this.exportFunc(
        this.exportConfig,
        this.transformationFile.content,
        this.transformationFile
      );
      this.modal.visible = false;
    },
    clickButtonFile(type) {
      this.type = type;
      const userId = this.$db
        .read()
        .get("userId")
        .value();
      if (userId) {
        this.$ipcRenderer.send("timer.refresh");
        this.$refs.myFile.click();
      } else {
        this.$notification.error({
          message: "提示",
          duration: 5,
          description: "请先登录后，进行操作"
        });
      }
    },
    changeUploadType(e) {
      e.preventDefault();
      e.stopPropagation();
      const userId = this.$db
        .read()
        .get("userId")
        .value();
      if (userId) {
        this.$ipcRenderer.send("timer.refresh");
        this.type = this.type === 0 ? 1 : 0;
        this.$message.success(
          this.type === 0 ? "已切换为单文件转换" : "已切换为批量文件转换"
        );
      } else {
        this.$notification.error({
          message: "提示",
          duration: 5,
          description: "请先登录后，进行操作"
        });
      }
    },
    drop(e) {
      e.preventDefault();
      e.stopPropagation();
      for (const f of e.dataTransfer.files) {
        const format = f.path.substring(f.path.lastIndexOf(".") + 1);
        this.$ipcRenderer.send("auto.transformation.xlsx");
      }
    },
    dragover(e) {
      e.preventDefault();
      e.stopPropagation();
    },
    deleteFile(item) {
      this.$ipcRenderer.send("timer.refresh");
      this.transformationFiles = this.transformationFiles.filter(
        d => d.path !== item.path
      );
      if (this.transformationFiles.length === 0) {
        this.resetFile();
      }
    },
    startTransformation() {
      this.isStartTransformation = true;
    },
    resetFile() {
      this.$ipcRenderer.send("timer.refresh");
      this.isStartTransformation = false;
      this.transformationFile = {};
      this.transformationFiles = [];
    },
    exportForderClick() {
      this.$ipcRenderer.send("timer.refresh");
      this.transformationFiles.forEach(item => {
        setTimeout(() => {
          this.analysisFile(item.path).then(result => {
            item.data = result;
            let content = result.map(item => {
              return item.join("\n");
            });
            content = content.join("\n");
            this.exportFunc(item.exportConfig, content, item);
          });
        }, 500);
      });
    },
    exportClick() {
      // this.exportOk();
      this.$ipcRenderer.send("timer.refresh");
      if (this.exportConfig.separate.character) {
        const result = this.transformationFile.data.map(item => {
          return item.join(this.exportConfig.separate.character);
        });
        this.transformationFile.content = result.join("\n");
      } else {
        const result = this.transformationFile.data.map(item => {
          return item.join("\n");
        });
        this.transformationFile.content = result.join("\n");
      }
      this.modal.visible = true;
    },
    analysisFile(url) {
      const format = url.substring(url.lastIndexOf(".") + 1);
      const name = url.substring(url.lastIndexOf(path.sep) + 1);
      return new Promise((resolve, reject) => {
        if (
          ["tmx", "tbx", "xlff", "sdlxliff", "txt", "ass", "srt"].includes(
            format
          )
        ) {
          exportService.getFileContent(url).then(xmlData => {
            if (["tmx", "tbx", "xlff", "sdlxliff"].includes(format)) {
              const json = exportService.createJSONByXML(xmlData);
              const result = [];
              if (format === "tbx") {
                json.martif.text.body.termEntry.forEach(item => {
                  result.push([item.langSet.tig.term, item.descrip]);
                });
              }
              if (format === "xlff" || format === "sdlxliff") {
                json.xliff.file.body.group.forEach(item => {
                  let obj = item["trans-unit"];
                  // if (obj) {
                  //   obj = obj["seg-source"];
                  // }
                  if (
                    Array.isArray(
                      obj.target && obj.target.g && obj.target.g.mrk
                    )
                  ) {
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
                    (obj.target && obj.target.g && obj.target.g.mrk) || ""
                  ]);
                });
              }
              if (format === "tmx") {
                json.tmx.body.tu.forEach(item => {
                  if (item.tuv.length === 2) {
                    let d = [];
                    if (typeof item.tuv[0].seg === "string") {
                      d.push(item.tuv[0].seg);
                    } else {
                      d.push(item.tuv[0].seg && item.tuv[0].seg["#text"]);
                    }
                    if (typeof item.tuv[1].seg === "string") {
                      d.push(item.tuv[1].seg);
                    } else {
                      d.push(item.tuv[1].seg && item.tuv[1].seg["#text"]);
                    }
                    result.push(d);
                  }
                });
              }
              resolve(result);
              // this.transformationFile.path = url;
              // this.transformationFile.data = result;
              // this.exportConfig.suffix = "txt";
              // this.exportConfig.separate.character = "||";
              // this.startTransformation();
            } else if (["txt", "ass", "srt"].includes(format)) {
              const result = [];
              let aryRef = exportService.formatContentByTxt(
                {
                  insert: {}
                },
                xmlData
              );
              for (let i = 0; i < aryRef.length; i++) {
                result.push([aryRef.source[i] || "", aryRef.target[i]] || "");
              }
              resolve(result);
              // this.transformationFile.path = url;
              // this.transformationFile.data = result;
              // this.exportConfig.suffix = "txt";
              // this.exportConfig.separate.character = "||";
              // this.startTransformation();
            }
          });
        } else if (["xlsx"].includes(format)) {
          const json = exportService.createJSONByXlsx(url);
          const result = [];
          json.forEach(item => {
            for (let i = 1; i < item.data.length; i++) {
              result.push([item.data[i][0], item.data[i][1]]);
            }
          });
          resolve(result);
          // this.transformationFile.path = url;
          // this.transformationFile.data = result;
          // this.exportConfig.suffix = "txt";
          // this.exportConfig.separate.character = "||";
          // this.startTransformation();
        } else if (["docx"].includes(format)) {
          exportService.getWordContent(url).then(text => {
            console.log(text);
            const result = [];
            let aryRef = exportService.formatContentByTxt(
              {
                insert: {}
              },
              text
            );
            for (let i = 0; i < aryRef.length; i++) {
              result.push([aryRef.source[i] || "", aryRef.target[i]] || "");
            }
            resolve(result);
          });
        }
      });
    },
    openSelectFile() {
      this.$ipcRenderer.send("timer.refresh");
      const properties =
        this.type === 0 ? ["openFile"] : ["openFile", "multiSelections"];
      const url = electron.remote.dialog.showOpenDialogSync({
        properties,
        filters: [
          {
            name: "text",
            extensions: [
              "txt",
              "docx",
              "tmx",
              "tbx",
              "srt",
              "ass",
              "xlff",
              "xlsx",
              "sdlxliff"
            ]
          }
        ]
      });
      if (url && url.length > 0) {
        if (this.type === 0) {
          const format = url[0].substring(url[0].lastIndexOf(".") + 1);
          const name = url[0].substring(
            url[0].lastIndexOf(path.sep) + 1,
            url[0].lastIndexOf(".")
          );
          this.transformationFile.title = name + "." + format;
          this.analysisFile(url[0]).then(result => {
            this.transformationFile.path = url[0];
            this.transformationFile.data = result;
            this.exportConfig.name = name;
            this.exportConfig.suffix = "txt";
            this.exportConfig.separate.character = "||";
            this.startTransformation();
          });
        } else {
          if (url.length > 5) {
            this.$message.error("最多批量打开5个文件");
            return false;
          }
          let files = url;
          files = files.filter(d => {
            const format = d.substring(d.lastIndexOf(".") + 1);
            return [
              "txt",
              "docx",
              "tmx",
              "tbx",
              "srt",
              "ass",
              "xlff",
              "xlsx"
            ].includes(format);
          });
          console.log(files);
          this.transformationFiles = [];
          files.forEach(item => {
            const format = item.substring(item.lastIndexOf(".") + 1);
            const name = item.substring(item.lastIndexOf(path.sep) + 1);
            this.transformationFiles.push({
              path: item,
              name: item.substring(
                item.lastIndexOf(path.sep) + 1,
                item.lastIndexOf(".")
              ),
              title: name,
              format: format,
              exportConfig: {
                suffix: "txt",
                format: "utf8",
                name: item.substring(
                  item.lastIndexOf(path.sep) + 1,
                  item.lastIndexOf(".")
                ),
                separate: {
                  character: "",
                  type: 0
                },
                langObj: {
                  source: "zh-CN",
                  target: "en-US"
                },
                lang: {
                  isEn: true,
                  isZh: true
                },
                insert: {
                  before: "",
                  after: ""
                }
              }
            });
          });
          this.startTransformation();
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.transformation-auto {
  height: 100%;
  overflow: hidden;
  overflow-y: auto;
  .table {
    display: flex;
    flex-direction: column;
    width: 100%;
    .tr {
      height: 40px;
      display: flex;
      width: 100%;
      overflow: hidden;
      &.t-header {
        color: #1890ff;
        font-weight: 600;
      }
      .td {
        flex: 1;
        padding: 0 10px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        height: 100%;
        display: flex;
        align-items: center;
        border: 1px solid #d4d4d4;
      }
    }
  }
  .transformation-start-forder {
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    .title {
      height: 60px;
      display: flex;
      align-items: center;
      padding: 0 20px;
      box-shadow: 0px 2px 8px 0px rgba(230, 230, 230, 0.35);
      background: #ffffff;
      margin-bottom: 10px;
    }
    .forder-body {
      flex: 1;
      overflow: hidden;
      overflow-y: auto;
      box-shadow: 0px 2px 8px 0px rgba(230, 230, 230, 0.35);
      background: #ffffff;
      padding: 20px;
    }
    .forder-table {
      .td {
        position: relative;
        height: 40px;
        &.file-td {
          padding-right: 50px;
          .handle-delete {
            position: absolute;
            right: 10px;
          }
        }
      }
    }
    .transformation-footer {
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 15px;
      box-shadow: 0px 2px 8px 0px rgba(230, 230, 230, 0.35);
      background: #ffffff;
    }
  }
  .transformation-start {
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    .transformation-title {
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0px 2px 8px 0px rgba(230, 230, 230, 0.35);
      background: #ffffff;
      margin-bottom: 10px;
    }
    .transformation-params {
      padding: 10px 0px;
      display: flex;
      align-items: center;
      box-shadow: 0px 2px 8px 0px rgba(230, 230, 230, 0.35);
      background: #ffffff;
      margin-bottom: 10px;
      .params-group {
        flex: 1;
        padding: 0 10px;
        span {
          padding: 5px 0px;
          display: block;
        }
      }
    }
    .transformation-content {
      flex: 1;
      overflow-x: hidden;
      overflow-y: auto;
      margin-bottom: 10px;
      box-shadow: 0px 2px 8px 0px rgba(230, 230, 230, 0.35);
      background: #ffffff;
      padding: 20px;
    }
    .transformation-footer {
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0px 2px 8px 0px rgba(230, 230, 230, 0.35);
      background: #ffffff;
    }
  }
  #myFile {
    display: none;
  }
  .header {
    width: 100%;
    height: 60px;
    background: #ffffff;
    display: flex;
    align-items: center;
    padding: 0 16px;
    box-shadow: 0px 2px 8px 0px rgba(230, 230, 230, 0.35);
    .breadcrumb {
      flex: 1;
    }
  }
  .footer {
    width: 100%;
    height: 60px;
    background: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
    padding: 0 16px;
    box-shadow: 0px 2px 8px 0px rgba(230, 230, 230, 0.35);
  }
  .upload-container {
    height: 300px;
    width: 100%;
    background: #ffffff;
    box-shadow: 0px 2px 8px 0px rgba(230, 230, 230, 0.35);
    margin-top: 20px;
    display: flex;
    cursor: pointer;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    position: relative;
    .changeUploadType {
      position: absolute;
      right: 20px;
      bottom: 20px;
    }
    .icon {
      img {
        width: 80px;
      }
    }
    .title {
      color: #303845;
    }
  }
}
</style>
