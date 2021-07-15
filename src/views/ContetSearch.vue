<template>
  <div class="main">
    <a-tabs default-active-key="1">
      <a-tab-pane key="1" tab="单语搜索">
        <div class="clearfix">
          <a-upload
            :file-list="fileList"
            :remove="handleRemove"
            :before-upload="beforeUpload"
            multiple
          >
            <a-button>
              <a-icon type="upload" />选择文件
            </a-button>
          </a-upload>
        </div>
        <div class="search">
          <a-input placeholder="请输入关键词开始搜索" v-model="searchContent" allow-clear />
          <a-button type="primary" @click="startSearcch()">开始检索</a-button>
        </div>
        <div style="height:580px;overflow: auto;">
          <a-table
            :columns="columns"
            :data-source="data"
            bordered
            :pagination="pagination"
            :loading="loading"
          >
            <template slot="filename" slot-scope="text">
              <div class="text-html">
                <p v-html="text"></p>
              </div>
            </template>
          </a-table>
        </div>
      </a-tab-pane>

      <a-tab-pane key="2" tab="双语搜索" force-render>
        <div class="clearfix">
          <a-upload
            :file-list="bothFileList"
            :remove="bothRemove"
            :before-upload="bothbeforeUpload"
            multiple
          >
            <a-button>
              <a-icon type="upload" />选择文件
            </a-button>
          </a-upload>
        </div>

        <div class="search">
          <div>原文：</div>
          <a-input placeholder="请输入关键词" v-model="originalContent" allow-clear />
          <div>译文：</div>
          <a-input placeholder="请输入关键词" v-model="translationContent" allow-clear />
          <a-button type="primary" @click="bothstartSearcch()">开始检索</a-button>
        </div>
        <div style="height:580px;overflow: auto;">
          <a-table
            :columns="bothcolumns"
            :data-source="bothdata"
            bordered
            :pagination="bothpagination"
            :loading="bothloading"
          >
            <template slot="filename" slot-scope="text">
              <div class="text-html">
                <p v-html="text"></p>
              </div>
            </template>
          </a-table>
        </div>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
<script>
import ExportService from "../tools/exportService.js";
import path from "path";
const exportService = new ExportService();
const columns = [
  {
    title: "来源",
    dataIndex: "filename"
  },
  {
    title: "语料内容",
    dataIndex: "content",
    scopedSlots: { customRender: "filename" }
  }
];
const bothcolumns = [
  {
    title: "来源",
    dataIndex: "filename"
  },
  {
    title: "原文内容",
    dataIndex: "orgcontent",
    scopedSlots: { customRender: "filename" }
  },
  {
    title: "译文内容",
    dataIndex: "trancontent",
    scopedSlots: { customRender: "filename" }
  }
];

export default {
  data() {
    return {
      fileList: [],
      bothFileList: [],
      loading: false,
      bothloading: false,
      pagination: {
        total: 0,
        pageSize: 10, //每页中显示10条数据
        showSizeChanger: true,
        pageSizeOptions: ["10", "20", "50", "100"], //每页中显示的数据
        showTotal: total => `共有 ${total} 条数据` //分页中显示总的数据
      },
      bothpagination: {
        total: 0,
        pageSize: 10, //每页中显示10条数据
        showSizeChanger: true,
        pageSizeOptions: ["10", "20", "50", "100"], //每页中显示的数据
        showTotal: total => `共有 ${total} 条数据` //分页中显示总的数据
      },
      data: [],
      bothdata: [],
      columns,
      bothcolumns,
      searchContent: "",
      originalContent: "",
      translationContent: ""
    };
  },
  methods: {
    handleRemove(file) {
      const index = this.fileList.indexOf(file);
      const newFileList = this.fileList.slice();
      newFileList.splice(index, 1);
      this.fileList = newFileList;
    },
    beforeUpload(file) {
      const userId = this.$db
        .read()
        .get("userId")
        .value();
      if (userId) {
        this.$ipcRenderer.send("timer.refresh");
        let isHave = this.fileList.some(item => {
          return item.path == file.path;
        });
        if (isHave) {
          console.log("该文件列表已有该文件");
        } else {
          this.fileList = [...this.fileList, file];
        }
        return false;
      } else {
        this.$notification.error({
          message: "提示",
          duration: 5,
          description: "请先登录后，进行操作"
        });
      }
    },
    bothRemove(file) {
      const index = this.bothFileList.indexOf(file);
      const newFileList = this.bothFileList.slice();
      newFileList.splice(index, 1);
      this.bothFileList = newFileList;
    },
    bothbeforeUpload(file) {
      const userId = this.$db
        .read()
        .get("userId")
        .value();
      if (userId) {
        this.$ipcRenderer.send("timer.refresh");
        let isHave = this.bothFileList.some(item => {
          return item.path == file.path;
        });
        if (isHave) {
        } else {
          this.bothFileList = [...this.bothFileList, file];
        }
        return false;
      } else {
        this.$notification.error({
          message: "提示",
          duration: 5,
          description: "请先登录后，进行操作"
        });
      }
    },
    keywordscolorful(str, key) {
      var reg = new RegExp("(" + key + ")", "g");
      var newstr = str.replace(reg, "<font style='background:#ff0;'>$1</font>");
      return newstr;
    },
    async startSearcch() {
      const userId = this.$db
        .read()
        .get("userId")
        .value();
      if (userId) {
        this.$ipcRenderer.send("timer.refresh");
        let searchData = [];
        let type = 1; //1.默认关键字2.代表正则表达式查询
        if (this.fileList.length > 0) {
          if (this.searchContent != "") {
            this.loading = true;
            for (var i = 0; i < this.fileList.length; i++) {
              let url = this.fileList[i].path;
              let filename = this.fileList[i].name;
              let result = await this.analysisFile(url);
              console.log(this.searchContent);
              let pattern = new RegExp("(" + this.searchContent + ")", "g");
              // console.log(result)
              if (result.length > 0) {
                result.forEach((item, index) => {
                  if (pattern.exec(item[0].toString())) {
                    let replace = item[0]
                      .toString()
                      .replace(
                        pattern,
                        '<span style="background: yellow;">$1</span>'
                      );
                    replace = `<p>${replace}</p>`;
                    searchData.push({ key: index, filename, content: replace });
                  }
                });
              }
              this.data = searchData;
              this.pagination.total = this.data.length || 0;
              this.loading = false;
            }
          } else {
            this.$notification.warning({
              message: "警告提示",
              description: "请输入要检索的内容！"
            });
          }
          console.log(this.fileList);
        } else {
          this.$notification.warning({
            message: "警告提示",
            description: "请先选择要检索的文件！"
          });
        }
      } else {
        this.$notification.error({
          message: "提示",
          duration: 5,
          description: "请先登录后，进行操作"
        });
      }
    },
    async bothstartSearcch() {
      const userId = this.$db
        .read()
        .get("userId")
        .value();
      console.log(userId);
      if (userId) {
        this.$ipcRenderer.send("timer.refresh");
        let searchData = [];
        if (this.bothFileList.length > 0) {
          console.log(this.bothFileList);
          if (this.originalContent != "" || this.translationContent != "") {
            this.bothloading = true;
            for (var i = 0; i < this.bothFileList.length; i++) {
              let url = this.bothFileList[i].path;
              let filename = this.bothFileList[i].name;
              let result = await this.analysisFile(url);

              if (result.length > 0) {
                result.forEach((item, index) => {
                  let object = null;
                  if (this.originalContent != "") {
                    let pattern = new RegExp(
                      "(" + this.originalContent + ")",
                      "g"
                    );
                    if (pattern.exec(item[0].toString())) {
                      let replace = item[0]
                        .toString()
                        .replace(
                          pattern,
                          '<span style="background: yellow;">$1</span>'
                        );
                      replace = `<p>${replace}</p>`;
                      object = {
                        key: index,
                        filename,
                        orgcontent: replace,
                        trancontent: item[1]
                      };
                    }
                  }
                  if (this.translationContent != "") {
                    let pattern = new RegExp(
                      "(" + this.translationContent + ")",
                      "g"
                    );
                    if (pattern.exec(item[1].toString())) {
                      let replace = item[1]
                        .toString()
                        .replace(
                          pattern,
                          '<span style="background: yellow;">$1</span>'
                        );
                      replace = `<p>${replace}</p>`;
                      if (object != null) {
                        object.trancontent = replace;
                      } else {
                        object = {
                          key: index,
                          filename,
                          orgcontent: item[0],
                          trancontent: replace
                        };
                      }
                    }
                  }
                  if (object != null) {
                    searchData.push(object);
                  }
                });
              }
            }
            this.bothdata = searchData;
            this.bothpagination.total = this.bothdata.length || 0;
            this.bothloading = false;
          } else {
            this.$notification.warning({
              message: "警告提示",
              description: "请输入要检索的内容！"
            });
          }
        } else {
          this.$notification.warning({
            message: "警告提示",
            description: "请先选择要检索的文件！"
          });
        }
      } else {
        this.$notification.error({
          message: "提示",
          duration: 5,
          description: "请先登录后，进行操作"
        });
      }
    },
    async analysisFile(url) {
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
                      d.push(item.tuv[0].seg["#text"]);
                    }

                    if (typeof item.tuv[1].seg === "string") {
                      d.push(item.tuv[1].seg);
                    } else {
                      d.push(item.tuv[1].seg["#text"]);
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
    }
  }
};
</script>
<style lang="scss" scoped>
.main {
  padding: 50px;
  padding-top: 10px;
  .clearfix {
    margin-top: 20px;
  }
  .search {
    display: flex;
    margin-top: 20px;
    margin-bottom: 15px;
    div {
      white-space: nowrap;
      height: 32px;
      line-height: 32px;
      margin-left: 20px;
      margin-right: 20px;
    }
    button {
      margin-left: 10px;
    }
  }
  /* 设置滚动条的样式 */
  ::-webkit-scrollbar {
    width: 5px;
  }
  //或者
  // /deep/ .ant-table-body{
  //   height: 250px;
  // }
}
</style>