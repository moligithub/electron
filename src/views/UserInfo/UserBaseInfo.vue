<template>
  <div class="container">
    <div class="content">
      <div v-if="isEdit">
        <a-form-model ref="ruleForm" :model="ruleForm" :rules="rules" v-bind="layout">
          <a-form-model-item has-feedback label="用户名" prop="name">
            <a-input v-model="ruleForm.name" autocomplete="off" />
          </a-form-model-item>
          <a-form-model-item has-feedback label="手机号" prop="tel">
            <a-input v-model="ruleForm.tel" autocomplete="off" />
          </a-form-model-item>
          <a-form-model-item has-feedback label="邮箱" prop="email">
            <a-input v-model="ruleForm.email" autocomplete="off" />
          </a-form-model-item>
          <a-form-model-item :wrapper-col="{ span: 14, offset: 6 }">
            <a-button type="primary" @click="submitForm('ruleForm')">保存</a-button>
            <a-button style="margin-left: 10px" @click="resetForm('ruleForm')">取消</a-button>
          </a-form-model-item>
        </a-form-model>
      </div>

      <div v-else class="base-info">
        <div class="center">
          <div class="title">基本信息</div>
          <!-- <div class="edit" @click="edit()">编辑</div> -->
          <div class="user-info">
            <span class="first">用户名:</span>
            <span class="second">{{userInfo.name}}</span>
          </div>
          <div class="user-info">
            <span class="first">手机号:</span>
            <span>{{userInfo.tel}}</span>
          </div>
          <div class="user-info">
            <span class="first">邮&nbsp;&nbsp;&nbsp;箱:</span>
            <span>{{userInfo.email}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { baseHref } from "../../utils/api.js";
import { error } from "../../tools/mammoth/lib/results";
export default {
  data() {
    const regTel = /^[1][3,4,5,7,8][0-9]{9}$/;
    const regEmail = /^([a-zA-Z0-9]+[-_\.]?)+@[a-zA-Z0-9]+\.[a-z]+$/;
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
    let validateTel = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入手机号"));
      } else if (regTel.test(value)) {
        callback();
      } else {
        callback(new Error("请输入正确的手机号!"));
      }
    };
    let validateEmail = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入邮箱地址"));
      } else if (regEmail.test(value)) {
        callback();
      } else {
        callback(new Error("请输入正确的邮箱地址!"));
      }
    };
    return {
      isEdit: false,
      userInfo: {
        name: "",
        tel: "",
        email: ""
      },
      ruleForm: {
        name: "",
        tel: "",
        email: ""
      },
      rules: {
        name: [{ validator: validateName, trigger: "change" }],
        tel: [{ validator: validateTel, trigger: "change" }],
        email: [{ validator: validateEmail, trigger: "change" }]
      },
      layout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 14 }
      }
    };
  },
  created() {
    // this.userInfo = {
    // };
    this.query();
  },
  methods: {
    edit() {
      this.isEdit = true;
      this.ruleForm = Object.assign({}, this.userInfo);
    },
    query() {
      const token = this.$db
        .read()
        .get("userId")
        .value();
      console.log(token);
      this.$axios
        .get(`${baseHref}/user/getInfo`, { headers: { token: token } })
        .then(result => {
          if (result.data.code == 1) {
            console.log(result);
            this.userInfo.name = result.data.data.userName;
            this.userInfo.tel = result.data.data.phone;
            this.userInfo.email = result.data.data.email;
            console.log(this.userInfo);
          } else {
            this.$message.error(result.data.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log(this.ruleForm);
          const token = this.$db
            .read()
            .get("userId")
            .value();
          let param = {
            email: this.ruleForm.email,
            name: this.ruleForm.name,
            phone: this.ruleForm.tel
          };
          this.$axios
            .post(`${baseHref}/user/updateInfo`, param, {
              headers: { token: token }
            })
            .then(res => {
              if (res.data.code == 1) {
                this.$message.success("修改成功");
                this.query();
              } else {
                this.$message.error(res.data.msg);
              }
            })
            .catch(error => {});
          this.$bus.emit("saveUserInfo", this.ruleForm);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.isEdit = false;
    }
  }
};
</script>
<style lang="scss" scoped>
.container {
  margin-top: 50px;
  margin-left: 80px;
  .base-info {
    margin: 0 auto;
    text-align: center;
    width: 100%;
    .center{
      margin: 0 auto;
      width: 100%;
    }
    .title {
      font-weight: 700;
      margin-right:150px;
      margin-bottom: 30px;
    }
    .edit {
      text-align: right;
      margin-right: 100px;
      font-size: 12px;
      color: #1890ff;
      cursor: pointer;
    }
    .user-info {
      text-align: left;
      width: 50%;
      margin: 0 auto;
      padding: 8px;
      .first {
        width: 100px;
        display: inline-block;
        text-align: right;
        margin-right: 50px;
        font-weight: 700;
      }
      .second{

      }
      // width: 200px;
    }
  }
  button {
    width: 110px;
    margin-right: 60px;
  }
}
</style>