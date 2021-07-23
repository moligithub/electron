<template>
  <div class="container">
    <h1>修改密码</h1>

    <a-form-model ref="ruleForm" :model="ruleForm" :rules="rules" v-bind="layout">
      <a-form-model-item has-feedback label="原始密码" prop="oldPass">
        <a-input v-model="ruleForm.oldPass" type="password" autocomplete="off" />
      </a-form-model-item>
      <a-form-model-item has-feedback label="新密码" prop="pass">
        <a-input v-model="ruleForm.pass" type="password" autocomplete="off" />
      </a-form-model-item>
      <a-form-model-item has-feedback label="确认新密码" prop="checkPass">
        <a-input v-model="ruleForm.checkPass" type="password" autocomplete="off" />
      </a-form-model-item>
      <a-form-model-item :wrapper-col="{ span: 14, offset: 6 }">
        <a-button type="primary" @click="submitForm('ruleForm')">确认</a-button>
        <a-button style="margin-left: 10px" @click="resetForm('ruleForm')">取消</a-button>
      </a-form-model-item>
    </a-form-model>
  </div>
</template>
<script>
import { baseHref } from "../../utils/api.js";
export default {
  data() {
    let pwdReg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,15}$/; //8到16位数字与字母组合
    let validateOldPass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入原始密码"));
      } else {
        if (this.ruleForm.checkPass !== "") {
          this.$refs.ruleForm.validateField("oldPass");
        }
        callback();
      }
    };
    let validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入新密码"));
      } else if (pwdReg.test(value)) {
        callback();
      } else {
        callback(
          new Error("密码必须为8~15位非空字符，并包含大小写字母、数字!")
        );
      }
    };
    let validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入新密码"));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error("两次输入的新密码不匹配!"));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        pass: "",
        checkPass: "",
        oldPass: ""
      },
      rules: {
        pass: [{ validator: validatePass, trigger: "blur" }],
        checkPass: [{ validator: validatePass2, trigger: "blur" }],
        oldPass: [{ validator: validateOldPass, trigger: "change" }]
      },
      layout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 14 }
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const token = this.$db
            .read()
            .get("userId")
            .value();
          console.log(token);
          let param = {
            confirmPassword: this.ruleForm.checkPass,
            newPassword: this.ruleForm.pass,
            oldPassword: this.ruleForm.oldPass
          };
          if(this.ruleForm.pass==this.ruleForm.oldPass){
            this.$message.error("新密码和原始密码相同，请修改");
            return;
          }
          this.$axios
            .post(`${baseHref}/user/updatePassword`, param, {
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
            .catch(error => {
              console.log(error);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  margin-top: 50px;
  margin-left: 80px;
  h1 {
    text-align: center;
  }
  button {
    width: 110px;
    margin-right: 60px;
  }
}
</style>
