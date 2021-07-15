<template>
  <div class="reset-pwd">
    <a-modal v-model="isResetPwdvisible" title="重置密码" :footer="null" @cancel="close">
      <a-form-model ref="ruleForm" :model="ruleForm" :rules="rules" v-bind="layout">
        <a-form-model-item has-feedback label="新密码" prop="pass">
          <a-input
            v-model="ruleForm.pass"
            type="password"
            autocomplete="off"
            placeholder="请输入8-15位新密码，数字+字母，区分大小写"
          />
        </a-form-model-item>
        <a-form-model-item has-feedback label="确认新密码" prop="checkPass">
          <a-input
            v-model="ruleForm.checkPass"
            placeholder="请再次输入新密码"
            type="password"
            autocomplete="off"
          />
        </a-form-model-item>
        <a-form-model-item :wrapper-col="{ span: 14, offset: 7 }">
          <a-button
            style="margin-left: 10px;width:100px"
            type="primary"
            @click="submitForm('ruleForm')"
          >确认</a-button>
          <a-button style="margin-left: 10px;width:100px" @click="resetForm('ruleForm')">取消</a-button>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
export default {
  //   props: {
  //     isResetPwdvisible: {
  //       type: Boolean,
  //       default: false
  //     }
  //   },
  data() {
    let pwdReg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,15}$/; //8到16位数字与字母组合
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
      isResetPwdvisible: false,
      ruleForm: {
        pass: "",
        checkPass: ""
      },
      rules: {
        pass: [{ validator: validatePass, trigger: "change" }],
        checkPass: [{ validator: validatePass2, trigger: "change" }]
      },
      layout: {
        labelCol: { span: 7 },
        wrapperCol: { span: 14 }
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log(this.ruleForm);
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    close() {
      this.$refs.ruleForm.resetFields();
    },
    show() {
      this.isResetPwdvisible = true;
      console.log(1111);
    }
  }
};
</script>

<style lang="scss" scoped>
.reset-pwd {
  .left-font {
    font-weight: 700;
  }
}
</style>