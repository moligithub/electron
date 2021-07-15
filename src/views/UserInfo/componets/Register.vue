<template>
  <a-modal v-model="visible" title="注册" :footer="null" @cancel="close">
    <a-form-model ref="ruleForm" :model="ruleForm" :rules="rules" v-bind="layout">
      <a-form-model-item has-feedback label="用户名" prop="name">
        <a-input v-model="ruleForm.name"  autocomplete="off" />
      </a-form-model-item>
      <a-form-model-item has-feedback label="手机号" prop="tel">
        <a-input v-model="ruleForm.tel" autocomplete="off" />
      </a-form-model-item>
      <a-form-model-item has-feedback label="邮箱" prop="email">
        <a-input v-model="ruleForm.email" autocomplete="off" />
      </a-form-model-item>
      <a-form-model-item has-feedback label="行业" prop="trade">
        <a-input v-model="ruleForm.trade" autocomplete="off" />
      </a-form-model-item>
      <a-form-model-item has-feedback label="学校" prop="school">
        <a-input v-model="ruleForm.school" autocomplete="off" />
      </a-form-model-item>
      <a-form-model-item has-feedback label="使用目的" prop="use">
        <a-input v-model="ruleForm.use" autocomplete="off" />
      </a-form-model-item>
      <a-form-model-item has-feedback label="密码" prop="pass">
        <a-input v-model="ruleForm.pass" type="password" autocomplete="off" />
      </a-form-model-item>
      <a-form-model-item has-feedback label="确认密码" prop="checkPass">
        <a-input v-model="ruleForm.checkPass" type="password" autocomplete="off" />
      </a-form-model-item>
      <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
        <a-button style="margin-left:20px;width:100px" @click="resetForm('ruleForm')">取消</a-button>
        <a-button
          style="margin-left: 50px;width:100px"
          type="primary"
          @click="submitForm('ruleForm')"
        >确认</a-button>
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>
<script>
import { error } from "../../../tools/mammoth/lib/results";
import {baseHref} from '../../../utils/api.js';
export default {
  data() {
    const pwdReg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,15}$/; //8到16位数字与字母组合
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
    let validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
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
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error("两次输入的密码不匹配!"));
      } else {
        callback();
      }
    };
    return {
      visible: false,
      ruleForm: {
        name: "",
        tel: "",
        email: "",
        trade: "", //行业
        school: "",
        use: "",
        pass: "",
        checkPass: ""
      },
      rules: {
        name: [{ required: true, validator: validateName, trigger: "change" }],
        tel: [{ required: true, validator: validateTel, trigger: "change" }],
        email: [
          { required: true, validator: validateEmail, trigger: "change" }
        ],
        pass: [{ required: true, validator: validatePass, trigger: "change" }],
        checkPass: [
          { required: true, validator: validatePass2, trigger: "change" }
        ]
      },
      layout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 14 }
      }
    };
  },
  created() {
    this.userInfo = {
      name: "test1",
      tel: 13333333333,
      email: "1234567@163.com"
    };
  },
  methods: {
    show() {
      this.visible = true;
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log(this.ruleForm);
          let param = {
            confirmPassword: this.ruleForm.checkPass,
            email: this.ruleForm.email,
            industry: this.ruleForm.trade,
            name: this.ruleForm.name,
            password: this.ruleForm.pass,
            phone: this.ruleForm.tel,
            purpose: this.ruleForm.use,
            school: this.ruleForm.school
          };
          this.$axios
            .post(`${baseHref}/user/register`, param)
            .then(result => {
               if (result.data.code == 1) {
                this.$message.success("注册成功");
                this.visible=false;
                this.$parent.showLogin();
              } else {
                this.$message.error(result.data.msg);
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
      this.isEdit = false;
    },
    close() {
      this.$refs.ruleForm.resetFields();
      // this.$parent.showLogin();
    }
  }
};
</script>