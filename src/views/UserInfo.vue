<template>
  <div class="anticipatory-file">
    <div :style="{ paddingTop: selectKey === 1 ? '0px' : '0px' }" class="body">
      <div class="left">
        <a-menu style="width: 100%" :selected-keys="[selectKey]" mode="inline" @click="handleClick">
          <a-menu-item v-for="item in menus" :key="item.key">{{ item.title }}</a-menu-item>
        </a-menu>
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
      menus: [
        {
          title: "基本信息",
          key: 0,
          name: "userbaseinfo",
          path: "/userbaseinfo"
        },
        {
          title: "修改密码",
          key: 1,
          name: "changepwd",
          path: "/changepwd"
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
    handleClick({ key }) {
      this.selectKey = key;
      const menu = this.menus.find(d => d.key === key);
      this.$router.push(menu.path);
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
    width: 200px;
    height: 100%;
    background: #ffffff;
    padding-top: 20px;
    box-shadow: 0px 2px 8px 0px rgba(230, 230, 230, 0.35);
  }
  .right {
    flex: 1;
    height: 100%;
    padding: 16px;
    overflow: hidden;
  }
}
</style>
