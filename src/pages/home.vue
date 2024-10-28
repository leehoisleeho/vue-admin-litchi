<template>
  <div class="home">
    <Navigation />
    <Content />
  </div>
</template>

<script setup>
import Navigation from "@/components/navigation.vue";
import Content from "@/components/content.vue";
</script>

<style scoped lang="less">
.home {
  width: 100%;
  height: 100%;
  display: flex;
}
</style>
