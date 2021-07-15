<template>
  <div class="find-pwd">
    <a-modal v-model="visible" title="忘记密码" :footer="null" @cancel="close">
      <a-form-model ref="ruleForm" :model="ruleForm" :rules="rules" v-bind="layout">
        <a-form-model-item has-feedback label="用户名" prop="name">
          <a-input v-model="ruleForm.name" placeholder="请输入" type="password" autocomplete="off" />
        </a-form-model-item>
        <a-form-model-item has-feedback label="手机号" prop="tel">
          <a-input v-model="ruleForm.tel" placeholder="请输入" autocomplete="off" />
        </a-form-model-item>
        <a-form-model-item
          class="right-style"
          style="width:470px"
          has-feedback
          label="验证码"
          prop="code"
        >
          <a-input
            style="width:160px"
            v-model.number="ruleForm.code"
            placeholder="请输入"
            autocomplete="off"
          />
          <a-button
            :disabled="isdisabled"
            @click="getCode()"
            style="margin-left: 20px;"
            type="primary"
          >获取验证码</a-button>
          <span v-show="isshow">{{count}}</span>
        </a-form-model-item>
        <a-form-model-item :wrapper-col="{ span: 14, offset: 6 }">
          <a-button
            style="margin-left: 10px;width:100px"
            type="primary"
            @click="submitForm('ruleForm')"
          >确认</a-button>

          <a-button style="margin-left: 10px;width:100px" @click="resetForm('ruleForm')">取消</a-button>
        </a-form-model-item>
      </a-form-model>
    </a-modal>

    <ResetPwd ref="mychild"></ResetPwd>
  </div>
</template>
<script>
import ResetPwd from "./ResetPwd.vue";
export default {
  // props: {
  //   visible: {
  //     type: Boolean,
  //     default: false
  //   }
  // },
  components: { ResetPwd },
  data() {
    const regTel = /^[1][3,4,5,7,8][0-9]{9}$/;
    let checkPending;
    let checkCode = (rule, value, callback) => {
      clearTimeout(checkPending);
      if (!value) {
        return callback(new Error("请输入验证码"));
      }
      checkPending = setTimeout(() => {
        if (!Number.isInteger(value)) {
          callback(new Error("输入的验证码不合法"));
        } else {
          callback();
        }
      }, 1000);
    };
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
    return {
      isResetPwd: false,
      visible: false,
      btnContent: "获取验证码",
      count: 0,
      isshow: false,
      isdisabled: false,
      ruleForm: {
        name: "",
        tel: "",
        code: ""
      },
      rules: {
        name: [{ validator: validateName, trigger: "change" }],
        tel: [{ validator: validateTel, trigger: "change" }],
        code: [{ validator: checkCode, trigger: "change" }]
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
          console.log(this.ruleForm);
          // alert("submit!");
          this.$refs.ruleForm.resetFields();
          this.visible = false;
          this.$refs.mychild.show();
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
    show() {
      this.visible = true;
    },
    close() {
      this.$refs.ruleForm.resetFields();
    },
    getCode() {
      const TIME_COUNT = 60;
      if (!this.timer) {
        this.isdisabled = true;
        this.isshow = !this.isshow;
        this.count = TIME_COUNT;
        this.show = false;
        this.timer = setInterval(() => {
          if (this.count > 0 && this.count <= TIME_COUNT) {
            this.count--;
          } else {
            this.isdisabled = false;
            this.isshow = !this.isshow;
            clearInterval(this.timer);
            this.timer = null;
          }
        }, 1000);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.right-style {
  position: relative;
  button {
    position: absolute;
    right: -114px;
    top: -6px;
  }
  span {
    position: absolute;
    right: -143px;
    top: -8px;
  }
}
</style>