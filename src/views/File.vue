<template>
  <div class="anticipatory-file">
    <div :style="{
        paddingTop: selectKey === 1 ? '0px' : '0px',
      }" class="body">
      <div
        :style="{ width: collapsed ? '120px' : '40px' }"
        :class="{ collapsed: !collapsed }"
        class="left"
      >
        <a-menu style="width: 100%" :selected-keys="[selectKey]" mode="inline" @click="handleClick">
          <a-menu-item v-for="item in menus" :key="item.key">
            <a-tooltip placement="right" v-if="!collapsed" :title="item.title">
              <i class="iconfont" :class="item.icon"></i>
            </a-tooltip>
            <i class="iconfont" v-else :class="item.icon"></i>
            {{ item.title }}
          </a-menu-item>
        </a-menu>
        <div class="left-handle collapsed-btn-body">
          <a-button type="primary" class="collapsed-btn" @click="toggleCollapsed">
            <a-icon :type="!collapsed ? 'menu-unfold' : 'menu-fold'" />
          </a-button>
        </div>
      </div>
      <div class="right">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectKey: 0,
      collapsed: false,
      menus: [
        {
          title: "自动转换",
          key: 0,
          icon: "icon-zidongduiying",
          name: "autotransformation",
          path: "/autotransformation"
        },
        {
          title: "转换编辑",
          key: 1,
          name: "transformationedit",
          icon: "icon-bianji",
          path: "/transformationedit"
        },
        {
          title: "语料检索",
          name: "ContetSearch",
          icon: "icon-icon-",
          path: "/contentsearch",
          key: 2
        }
      ]
    };
  },
  watch: {
    $route: {
      handler(to) {
        console.log(to.name);
        const menu = this.menus.find(d => d.name === to.name);
        console.log(menu);
        this.selectKey = menu.key;
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    toggleCollapsed() {
      this.$ipcRenderer.send("timer.refresh");
      this.collapsed = !this.collapsed;
    },
    handleClick({ key }) {
      this.$bus.emit("activehelp");
      this.selectKey = key;
      this.$ipcRenderer.send("timer.refresh");
      const menu = this.menus.find(d => d.key === key);
      if (menu.key === 1) {
        this.$router.push(menu.path + "/" + new Date().getTime());
      } else {
        this.$router.push(menu.path);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.anticipatory-file {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  .body {
    display: flex;
    height: calc(100vh - 46px);
  }
  .left {
    width: 120px;
    height: 100%;
    background: #ffffff;
    padding-top: 20px;
    overflow: hidden;
    transition: all 0.2s;
    box-shadow: 0px 2px 8px 0px rgba(230, 230, 230, 0.35);
    position: relative;
    .collapsed-btn-body {
      position: absolute;
      bottom: 0;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      .collapsed-btn {
        width: 100%;
      }
    }
    .iconfont {
      font-size: 18px;
    }
    .ant-menu-item {
      padding-left: 18px !important;
    }
    &.collapsed {
      .ant-menu-item {
        padding-left: 8px !important;
        text-overflow: unset !important;
        .iconfont {
          margin-right: 20px;
          font-size: 20px;
        }
      }
    }
  }
  .right {
    flex: 1;
    height: 100%;
    padding: 8px;
    overflow: hidden;
  }
}
</style>
