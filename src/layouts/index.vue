<template>
  <div class="anticipatory-layout">
    <Tools />
    <div class="anticipatory-layout-body">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import Tools from '../components/Tools';
export default {
  components: { Tools }
}
</script>

<style lang="scss" scoped>
.anticipatory-layout {
  position: relative;
  overflow: hidden;
  height: 100vh;
  .anticipatory-layout-body {
    padding-top: 47px;
    height: 100%;
  }
}
</style>