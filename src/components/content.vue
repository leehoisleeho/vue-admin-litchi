<template>
  <div class="content">
    <div class="header">
      <Header />
    </div>
    <div class="main">
      <router-view v-slot="{ Component }">
        <transition name="slide" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
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
    position: relative;
    overflow: hidden; // 防止滑动时出现滚动条
  }
}

/* 滑动效果 */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease-in-out;
  position: absolute; // 防止动画时影响布局
  width: 100%;
  height: 100%;
}

.slide-enter-from {
  transform: translateY(100%);
  opacity: 1;
}

.slide-leave-to {
  transform: translateY(-100%);
}

// 如果需要内部滚动，可以给路由页面添加以下样式
:deep(.route-page) {
  height: 100%;
  overflow-y: auto;
}
</style>
