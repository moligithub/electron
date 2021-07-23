<template>
  <div class="file-handle">
    <div
      v-for="(item, index) in handles"
      @click="(e) => handleClick(e, item)"
      :key="index"
      v-show="item.status"
      :class="{ disbaled: item.disabled }"
      class="btn"
    >
      <div class="icon">
        <i class="iconfont" :class="item.icon"></i>
      </div>
      <div class="title">{{ item.title }}</div>
    </div>
    <div ref="wordRef" class="wordRef"></div>
  </div>
</template>

<script>
import { remote } from "electron";
import fxp from "fast-xml-parser";
import mammoth from "../../tools/mammoth/lib/index";
import iconv from "../../tools/iconv-lite/lib/index";
import { FindInPage } from "electron-find";
import jschardet from "jschardet";
import fs from "fs";
import path from "path";
import ExportService from "../../tools/exportService";
import { setTimeout, clearTimeout } from "timers";
const exportService = new ExportService();
const time = 0;
export default {
  watch: {
    $route: {
      handler (to) {
        if (to.name !== "transformationedit") {
          this.handles = this.handles.map((item) => {
            if (
              ["保存", "查找", "替换", "撤回", "重做", "导出"].includes(
                item.title
              )
            ) {
              item.disabled = true;
            }
            return item;
          });
        } else {
          this.handles = this.handles.map((item) => {
            if (["导出", "查找", "替换"].includes(item.title)) {
              item.disabled = false;
            }
            return item;
          });
        }
      },
      deep: true,
      immediate: true,
    },
  },
  data () {
    return {
      findInPage: null,
      isloadFile: false,
      handles: [
        {
          title: "打开",
          icon: "icon-dakaiopen127",
          func: "openFile",
          status: true,
        },
        {
          title: "保存",
          icon: "icon-baocun-tianchong",
          disabled: false,
          status: true,
          func: "saveFile",
        },
        {
          title: "新建",
          icon: "icon-xinjian",
          status: true,
          func: "addFile",
        },
        {
          title: "查找",
          func: "searchText",
          disabled: false,
          icon: "icon-chazhao",
        },
        {
          title: "替换",
          icon: "icon-tihuan",
          disabled: false,
          func: "replaceTxt",
        },
        {
          title: "撤回",
          func: "prevClick",
          disabled: false,
          icon: "icon--laststep",
        },
        {
          title: "重做",
          icon: "icon--nextstep",
          disabled: false,
          func: "nextClick",
        },
        {
          title: "导出",
          icon: "icon-export",
          disabled: false,
          func: "exportClick",
        },
      ],
    };
  },
  mounted () {
    const that = this;
    this.isloadFile = false;
    this.$bus.on("disabled", (items) => {
      this.handles = this.handles.map((d) => {
        const index = items.findIndex((f) => f.title === d.title);
        console.log(index, d, items[index]);
        if (index !== -1) {
          d.disabled = items[index].disabled;
        }
        return d;
      });
    });
    let timer = null;
    this.$bus.on("openfile", (items) => {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        const userId = this.$db
          .read()
          .get("userId")
          .value();
        if (userId) {
          this.$ipcRenderer.send('timer.refresh');
          this.openFile();
        } else {
          this.$notification.close('notification');
          this.$notification.error({
            key: 'notification',
            message: "提示",
            duration: 5,
            description: "请先登录后，进行操作",
          });
        }
      }, 200)

    });

    this.$ipcRenderer.on("handle.openfile", (res) => {
      if (res._params.isLast) {
        that.$emit("load", false);
        that.isloadFile = false;
        that.$router.push({
          path: res.path,
        });
      }
    });

    if (document && document.querySelector("#transformation-edit")) {
      this.findInPage = new FindInPage(remote.getCurrentWebContents(), {
        parentElement: document.querySelector("#transformation-edit"),
        offsetTop: 60,
        offsetRight: 10,
      });
    }
  },
  methods: {
    prevClick () {
      this.$bus.emit("exitPrve");
    },
    nextClick () {
      this.$bus.emit("exitNext");
    },
    saveFile () {
      this.$bus.emit("saveFile");
    },
    handleClick (e, item) {
      e.stopPropagation();
      const userId = this.$db
        .read()
        .get("userId")
        .value();
      if (userId) {
        this.$ipcRenderer.send('timer.refresh');
        if (item.disabled) {
          return false;
        }
        if (item.func && this[item.func]) {
          this[item.func](item);
        }
      } else {
        // this.$notification.destroy();
        this.$notification.close('notification');
        this.$notification.error({
          key: 'notification',
          message: "提示",
          duration: 5,
          description: "请先登录后，进行操作",
        });
      }
    },
    exportClick () {
      console.log('exportClick');
      this.$bus.emit("export");
    },
    replaceTxt () {
      this.$bus.emit("replaceTxt");
    },
    searchText () {
      // if (document.querySelector("#transformation-edit") && !this.findInPage) {
      //   this.findInPage = new FindInPage(remote.getCurrentWebContents(), {
      //     parentElement: document.querySelector("#transformation-edit"),
      //     offsetTop: 60,
      //     offsetRight: 10,
      //   });
      // }
      // this.findInPage.openFindWindow();
      this.$bus.emit("searchTxt");
    },
    addFile () {
      let editTabs = this.$db
        .read()
        .get("transform.tabs")
        .value();
      const key = new Date().getTime();
      const userName = this.$db.read().get('userInfo.name').value();
      if (editTabs) {
        editTabs.forEach((item) => {
          item.isCurrent = false;
        });
        editTabs.push({
          title: `Untitled-${editTabs.length + 1}.txt`,
          user: userName,
          key,
        });
      } else {
        editTabs = [
          {
            title: `Untitled-1.txt`,
            user: userName,
            key,
          },
        ];
      }
      this.$dbMap
        .add(key)
        .get(key)
        .set("data", {
          content: "",
        })
        .write();
      setTimeout(() => {
        this.$db.set("transform.activeKey", key).write();
        this.$db.set("transform.tabs", editTabs).write();
        this.$router.push({
          path: "/transformationedit/" + new Date().getTime(),
        });
      }, time);
    },
    sendToWorker (urls) {
      if (urls.length > 0) {
        const item = urls.shift();
        exportService.getFileSize(item).then(
          (res) => {
            const format = item.substring(item.lastIndexOf(".") + 1);
            const name = item.substring(item.lastIndexOf(path.sep) + 1);
            this.isloadFile = true;
            this.$emit("load", true);
            this.$ipcRenderer.send("handle.openfile", {
              url: item,
              format,
              name,
              isLast: urls.length === 0,
              func: "goToPage",
            });
            setTimeout(() => {
              this.sendToWorker(urls);
            }, 1000);
          },
          (err) => {
            console.log(err);
            this.$message.error(
              err.message || "文件选择失败。请重启应用后重试"
            );
          }
        );
      }
    },
    openFile () {
      this.$ipcRenderer.send('timer.refresh');
      if (this.isloadFile) {
        this.$message.warning("正在打开文件，请稍后...");
        return;
      }
      const url = remote.dialog.showOpenDialogSync({
        properties: ["openFile", "multiSelections"],
        filters: [
          {
            name: "text",
            extensions: [
              "txt",
              "docx",
              "srt",
              "ass",
              "tmx",
              "tbx",
              "xliff",
              "xlsx",
              "sdlxliff",
            ],
          },
        ],
      });
      if (url && url.length > 0) {
        if (url.length > 5) {
          this.$message.error("最多批量打开5个文件");
          return false;
        }
        this.sendToWorker(url);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.wordRef {
  width: 0;
  height: 0;
  overflow: hidden;
}
.file-handle {
  height: 70px;
  background: #ffffff;
  display: flex;
  padding: 0 16px;
  align-items: center;
  box-shadow: 0px 2px 8px 0px rgba(230, 230, 230, 0.35);
  .btn {
    padding: 0 10px;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .iconfont {
      font-size: 20px;
      color: #303845;
    }
    &:hover {
      color: #1890ff;
      .iconfont {
        color: #1890ff;
      }
    }
    &.disbaled {
      color: #eeeeee;
      cursor: not-allowed;
      .iconfont {
        color: #eeeeee;
      }
    }
  }
}
</style>
