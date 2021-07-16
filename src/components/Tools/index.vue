<template>
  <div class="anticipatory-tools">
    <header v-show="false" class="handle-header">
      <Handle ref="handle" @load="loadFile" />
    </header>
    <div
      v-for="(item, index) in handles"
      :key="index"
      :class="{ disbaled: item.disabled }"
      @click="handleClick(item.func)"
      class="btn"
    >{{ item.title }}</div>
    <div @click="goToPage(1, '/help')" class="btn" :class="{active : active==1}">帮助</div>
    <div class="user" @click="goUserinfo()" v-if="islogin">
      <a-icon type="user" style="font-size: 19px;"/>
      <!-- <a-avatar size="small" icon="user" /> -->
      <span>{{ userInfo.name }}</span>
      <div class="quit" @click.stop="quitClick()">退出</div>
    </div>
    <div class="user" v-else>
      <div @click="login()">登录</div>
      <div @click="register()">注册</div>
    </div>

    <div v-if="isloadFile" class="loadding">
      <a-spin />正在打开...
    </div>

    <!-- 登录 -->
    <div class="login-info">
      <a-modal v-model="visible" title="登录" :footer="null" @cancel="close">
        <a-form-model ref="ruleForm" :model="ruleForm" :rules="rules" v-bind="layout">
          <a-form-model-item has-feedback label="用户名" prop="name">
            <a-input v-model="ruleForm.name" placeholder="请输入用户名" autocomplete="off" />
          </a-form-model-item>
          <a-form-model-item has-feedback label="密码" prop="pwd">
            <a-input v-model="ruleForm.pwd" placeholder="请输入密码" type="password" autocomplete="off" />
          </a-form-model-item>
          <div
            @click="forget()"
            style="
              margin-right: 20px;
              text-align: right;
              color: #1890ff;
              cursor: pointer;
              font-size: 12px;
            "
          >忘记密码</div>
          <a-form-model-item :wrapper-col="{ span: 14, offset: 6 }">
            <a-button style="margin-left: 10px; width: 100px" @click="resetForm('ruleForm')">注册</a-button>
            <a-button
              style="margin-left: 10px; width: 100px"
              type="primary"
              @click="submitForm('ruleForm')"
            >登录</a-button>
          </a-form-model-item>
        </a-form-model>
      </a-modal>
    </div>
    <!-- 找回密码 -->
    <forget-pwd ref="mychild" />

    <register ref="myRegister" />
  </div>
</template>

<script>
import Handle from "./Handle.vue";
import ForgetPwd from "../../../src/views/UserInfo/componets/ForgetPwd.vue";
import Register from "../../../src/views/UserInfo/componets/Register.vue";
import { baseHref, time } from "../../utils/api.js";
export default {
  components: { Handle, ForgetPwd, Register },
  watch: {
    $route: {
      handler(to) {
        if (to.name !== "transformationedit") {
          this.handles = this.handles.map(item => {
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
          this.handles = this.handles.map(item => {
            if (["导出", "查找", "替换"].includes(item.title)) {
              item.disabled = false;
            }
            return item;
          });
        }
      },
      deep: true,
      immediate: true
    }
  },
  data() {
    let validateName = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入用户名"));
      } else {
        if (this.ruleForm.name !== "") {
          this.$refs.ruleForm.validateField("name");
        }
        callback();
      }
    };
    let validatePwd = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.ruleForm.pwd !== "") {
          this.$refs.ruleForm.validateField("pwd");
        }
        callback();
      }
    };
    return {
      islogin: false,
      currentPage: 0,
      isloadFile: false,
      visible: false,
      isfindPwd: false,
      userInfo: {},
      active: 0,
      handles: [
        {
          title: "打开",
          icon: "icon-dakaiopen127",
          func: "openFile",
          status: true
        },
        {
          title: "新建",
          icon: "icon-xinjian",
          status: true,
          func: "addFile"
        },
        {
          title: "保存",
          icon: "icon-baocun-tianchong",
          disabled: false,
          status: true,
          func: "saveFile"
        },
        {
          title: "查找",
          func: "searchText",
          disabled: false,
          icon: "icon-chazhao"
        },
        {
          title: "替换",
          icon: "icon-tihuan",
          disabled: false,
          func: "replaceTxt"
        },
        {
          title: "撤回",
          func: "prevClick",
          disabled: false,
          icon: "icon--laststep"
        },
        {
          title: "重做",
          icon: "icon--nextstep",
          disabled: false,
          func: "nextClick"
        },
        {
          title: "导出",
          icon: "icon-export",
          disabled: false,
          func: "exportClick"
        }
      ],
      ruleForm: {
        name: "",
        pwd: ""
      },
      rules: {
        name: [{ validator: validateName, trigger: "change" }],
        pwd: [{ validator: validatePwd, trigger: "change" }]
      },
      layout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 14 }
      }
    };
  },
  mounted() {
    // this.$db.unset("userInfo").write();
    // this.$db.unset("userId").write();
    this.$ipcRenderer.on("timer.logout", () => {
      this.quitClick();
    });
    let user = this.$db
      .read()
      .get("userInfo")
      .value();
    if (user) {
      this.islogin = true;
      this.$ipcRenderer.send("timer.listen", {
        timer: 5000
      });
    }
    this.userInfo = user || {};
    this.$bus.on("disabled", items => {
      this.handles = this.handles.map(d => {
        const index = items.findIndex(f => f.title === d.title);
        console.log(index, d, items[index]);
        if (index !== -1) {
          d.disabled = items[index].disabled;
        }
        return d;
      });
    });
    this.$bus.on("saveUserInfo", item => {
      console.log(item);
      this.userInfo.name = item.name;
    });
    this.$bus.on("activehelp", () => {
      this.active = 0;
    });
  },
  methods: {
    loadFile(status) {
      this.isloadFile = status;
    },
    handleClick(func) {
      const userId = this.$db
        .read()
        .get("userId")
        .value();
      if (userId) {
        this.active = 0;
        this.$ipcRenderer.send("timer.refresh");
        this.$refs.handle[func]();
      } else {
        // this.$notification.destroy();
        this.$notification.error({
          message: "提示",
          duration: 5,
          description: "请先登录后，进行操作"
        });
      }
    },
    goToPage(tab, path) {
      this.currentPage = tab;
      this.$ipcRenderer.send("timer.refresh");
      if (path == "/help") {
        this.active = 1;
      } else {
        this.active = 0;
      }
      this.$router.push(path);
      // if (tab === 1) {
      //   this.$router.push(path);
      // }
    },
    goUserinfo() {
      this.active=0;
      this.$ipcRenderer.send("timer.refresh");
      this.$router.push("/userinfo");
    },
    login() {
      this.visible = true;
    },
    quitClick() {
      const token = this.$db
        .read()
        .get("userId")
        .value();
      this.$axios
        .post(
          `${baseHref}/user/logout`,
          {},
          {
            headers: { token: token }
          }
        )
        .then(result => {
          if (result.data.code == 1) {
            this.$message.destroy();
            this.$message.success("退出成功");
            this.$db.unset("userInfo").write();
            this.$db.unset("userId").write();
            this.$ipcRenderer.send("timer.remove");
            this.userInfo = {};
            this.islogin = false;
          } else {
            this.$message.error(result.data.msg);
          }
          console.log(result);
        });
    },
    register() {
      this.$refs.myRegister.show();
    },
    showLogin() {
      this.visible = true;
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log(this.ruleForm);
          // let param = new URLSearchParams();
          // param.append("name", this.ruleForm.name);
          // param.append("password", this.ruleForm.pwd);
          let param = { name: this.ruleForm.name, password: this.ruleForm.pwd };
          this.$axios.post(`${baseHref}/user/login`, param).then(result => {
            if (result.data.code == 1) {
              this.$message.success("登录成功");

              this.visible = false;
              this.$db.set("userInfo", this.ruleForm).write();
              this.$db.set("userId", result.data.data).write();
              this.$ipcRenderer.send("timer.listen", {
                timer: time
              });
              this.islogin = true;
              this.userInfo = { ...this.ruleForm };
              this.$refs.ruleForm.resetFields();
            } else {
              this.$message.error(result.data.msg);
            }
            console.log(result);
          });

          // this.$db.set("userId", "userId").write();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.visible = false;
      this.$refs.myRegister.show();
    },
    close() {
      this.$refs.ruleForm.resetFields();
    },
    forget() {
      this.visible = false;
      this.$refs.mychild.show();
      // this.isfindPwd=true;
    }
  }
};
</script>

<style lang="scss" scoped>
.anticipatory-tools {
  height: 45px;
  width: 100%;
  min-width: 800px;
  display: flex;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  box-shadow: 0px 2px 8px 0px rgba(230, 230, 230, 0.35);
  z-index: 999;
  background: #ffffff;
  padding: 0 16px;
  .active {
    color: #fd7522;
  }
  .login-info {
    background: red;
    .right {
      text-align: right;
      color: red;
    }
  }
  header {
    position: fixed;
    top: 44px;
    left: 0;
    background: #ffffff;
    width: 100%;
    z-index: 100;
    color: #303845;
    height: 0px;
    overflow: hidden;
    transition: all 0.2s;
  }
  .loadding {
    margin-left: 15px;
  }
  .file {
    &:hover {
      header {
        // height: 70px;
      }
    }
  }
  //   border-bottom: 1px solid #d8d8d8;
  .btn + .btn {
    margin-left: 15px;
  }
  .btn {
    color: #303845;
    padding: 0 10px;
    height: 100%;
    display: flex;
    align-items: center;
    cursor: pointer;
    &.disbaled {
      color: #eeeeee;
      cursor: not-allowed;
    }
    &.active,
    &:hover {
      color: #1890ff;
      //   border-bottom: 1px solid #4785ff;
    }
  }
  .user {
    position: absolute;
    right: 20px;
    color: #1890ff;
    cursor: pointer;
    display: flex;
    .quit {
      margin-left: 10px;
    }
    div:nth-child(1) {
      margin-right: 10px;
    }
    span {
      vertical-align: middle;
      margin-left: 5px;
    }
  }
}
</style>
