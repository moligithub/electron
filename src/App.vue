<template>
  <div id="app">
    <Layout>
      <router-view />
    </Layout>
    <div id="wordId"></div>
  </div>
</template>
<script>
import Layout from "./layouts";
export default {
  components: { Layout },
};
</script>
<style lang="scss">
#wordId {
  width: 0;
  height: 0;
  overflow: hidden;
}
.CodeMirror-advanced-dialog + .CodeMirror {
  padding-top: 70px;
}
.CodeMirror-advanced-dialog {
  display: flex;
  height: 60px;
  align-items: center;
  position: absolute;
  width: 100%;
  background: #ffffff;
  z-index: 300;
  button {
    margin-left: 10px;
    border: 0;
    background: 0;
    padding: 0;
    cursor: pointer;
    &:hover {
      color: #1890ff;
    }
  }
  .row {
    height: 32px;
    display: flex;
    margin-left: 15px;
    align-items: center;
    label {
      padding-right: 16px;
    }
  }
  input {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-variant: tabular-nums;
    list-style: none;
    font-feature-settings: "tnum";
    position: relative;
    display: inline-block;
    outline: 0px;
    height: 32px;
    padding: 4px 11px;
    color: rgba(0, 0, 0, 0.65);
    font-size: 14px;
    line-height: 1.5;
    background-color: #fff;
    background-image: none;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    transition: all 0.3s;
    &:focus {
      border-color: #40a9ff;
      border-right-width: 1px !important;
      outline: 0;
    }
  }
  .CodeMirror-search-count {
    margin-left: 15px;
  }
}
.find-box {
  position: absolute !important;
}
.CodeMirror-scroll {
  background: #f7f7f7;
}
.ant-tabs {
  height: 100%;
}
.ant-tabs-bar {
  margin: 0 !important;
}
.ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-nav-container {
  height: 30px !important;
}
.ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-tab {
  height: 30px !important;
  line-height: 28px !important;
  font-size: 12px;
}
.CodeMirror {
  height: 100%;
  padding-bottom: 20px;
  padding-top: 10px;
  padding-right: 20px;
  background: #f7f7f7;
}
.ant-tabs-content {
  height: calc(100% - 56px);
}
.ant-tabs-tabpane {
  height: 100%;
}
.ant-menu-item:hover,
.ant-menu-item-active,
.ant-menu:not(.ant-menu-inline) .ant-menu-submenu-open,
.ant-menu-submenu-active,
.ant-menu-submenu-title:hover {
  color: #1890ff !important;
}
.ant-menu-item-selected {
  color: #1890ff !important;
}
#app {
  width: 100%;
  height: 100%;
  overflow: hidden;
  min-width: 800px;
  background: #f8f9fa;
}
::-webkit-scrollbar {
  width: 10px;
} /* 这是针对缺省样式 (必须的) */

::-webkit-scrollbar-track {
  background-color: #f8f9fa;
} /* 滚动条的滑轨背景颜色 */

::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
} /* 滑块颜色 */

::-webkit-scrollbar-button {
  background-color: #f8f9fa;
} /* 滑轨两头的监听按钮颜色 */

::-webkit-scrollbar-corner {
  background-color: black;
}
</style>
