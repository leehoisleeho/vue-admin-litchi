<template>
  <div class="content">
    <div class="header">
      <Header />
    </div>
    <div class="main">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import Header from "@components/head.vue";
</script>

<style scoped lang="less">
.content {
  height: 100%;
  width: 100%;
  .header {
    height: 75px;
  }
  .main {
    height: calc(100% - 75px);
  }
}
</style>
