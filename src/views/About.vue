<template>
  <div class="about">
    <div>
      <a-divider orientation="left">帮助</a-divider>

      <a-tabs>
        <a-tab-pane key="1" tab="产品说明">
          <div class="content">
            <div>语料转换工具</div>
            <p>语料转换工具是由翻译领域专家设计并研发的一款PC桌面端软件，设计的初衷是希望能为各位译员与教师在语料收集、语料整理、语料积累、语料研究和应用等环节中提供帮助。这款产品为用户提供三大核心功能：语料文件格式转换、语料内容编辑整理、语料应用检索。</p>
            <p>您可以在安装语料转换工具客户端后，注册登录并使用相关功能。</p>

            <div>语料文件格式转换</div>
            <p>当前支持包括TXT/DOC/XLS/TMX/TBX/XLIFF/SRT/ASS等格式文件的转换功能， 您可以通过工具打开本地文件，进行自动转换或人工转换。</p>
            <p>对于XLS/TMX/TBX/XLIFF/SRT/ASS等标准化文档，转换效率更高、更规范。</p>

            <div>语料内容编辑整理</div>
            <p>当前支持包括TXT/DOC/XLS/TMX/TBX/XLIFF/SRT/ASS等格式文件的编辑功能， 您可以通过工具打开本地文件，进行编辑修改，通过导出来完成语料的整理和转换。</p>
            <p>支持同时打开多个文件进行编辑。</p>

            <div>语料应用检索</div>
            <p>当前支持通过语料转换工具来检索本地文件，设计了单语检索和双语对照检索两种模式。</p>
            <p>您可以通过关键词和正则表达式来检索定位您需要的语料，提高语料检索效率，充分发挥语料应用价值。</p>
          </div>
        </a-tab-pane>
        <a-tab-pane key="2" tab="意见反馈">
          <div class="idea">
            <div class="up">
              <div class="fontstyle">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;类型:</div>
              <a-select default-value="优化建议" style="width: 200px" @change="handleChange">
                <a-select-option value="优化建议">优化建议</a-select-option>
                <a-select-option value="需求申请">需求申请</a-select-option>
                <a-select-option value="其他">其他</a-select-option>
              </a-select>
            </div>
            <div class="down">
              <div class="fontstyle">反馈详情:</div>
              <a-textarea placeholder="请输入详细描述，感谢您的反馈..." v-model="handleMode.content" />
            </div>

            <div class="bottom">
              <a-button type="primary" @click="okClick">提交</a-button>
            </div>
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script>
import { baseHref } from "../utils/api.js";
export default {
  data() {
    return {
      handleMode: {
        content: "",
        type: "优化建议"
      }
    };
  },
  created() {},
  methods: {
    goback() {
      this.$router.go(-1); //返回上一层
    },
    handleChange(value) {
      this.handleMode.type = value;
    },
    okClick() {
      const token = this.$db
        .read()
        .get("userId")
        .value();
      this.$axios
        .post(`${baseHref}/help/feedback`, this.handleMode, {
          headers: { token: token }
        })
        .then(res => {
          if (res.data.code == 1) {
            this.$message.success("提交成功");
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.about {
  padding-left: 100px;
  padding-top: 30px;
  padding-right: 200px;
  .content {
    margin: 20px;
    div {
      font-weight: 700;
      margin-bottom: 10px;
    }
    p {
      text-indent: 2rem;
    }
  }
  .fontstyle {
    font-weight: 700;
    margin-right: 25px;
    width: 100px;
    // text-align: right;
  }
  .idea {
    .up {
      margin-top: 30px;
      display: flex;
    }
    .down {
      margin-top: 30px;
      display: flex;

      .ant-input {
        height: 200px;
        margin-left: 10px;
      }
    }
    .bottom {
      text-align: right;
      margin-top: 20px;
    }
  }
}
</style>