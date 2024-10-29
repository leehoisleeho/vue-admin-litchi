<template>
  <div class="menu-form">
    <a-segmented
      v-model:value="value"
      :options="data"
      style="margin-bottom: 20px"
    />
    <div class="menu-form-item">
      <p>目录名称</p>
      <a-input
        v-model:value="menuName"
        placeholder="请输入菜单名称"
        style="margin-top: 0"
      />
    </div>
    <div class="menu-form-item">
      <p>目录key</p>
      <a-input
        v-model:value="key"
        placeholder="请输入菜单key"
        style="margin-top: 0"
      />
    </div>
    <div class="menu-form-item">
      <Icon v-model="selectedIcon" />
    </div>
    <div class="menu-form-item">
      <p>目录排序</p>
      <a-input-number
        v-model:value="number"
        :keyboard="keyboard"
        :min="1"
        style="width: 100%"
      />
    </div>
    <div class="menu-form-item">
      <p>目录显示/隐藏</p>
      <a-select ref="select" v-model:value="isShow" style="width: 100%">
        <a-select-option value="0">显示</a-select-option>
        <a-select-option value="1">隐藏</a-select-option>
      </a-select>
    </div>
    <div class="btnBox">
      <a-button type="primary">提交</a-button>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import Icon from "@/components/icon.vue";
const data = reactive(["目录", "菜单"]);
const value = ref(data[0]);
const key = ref("");
const menuName = ref("");
const number = ref(1);
const keyboard = ref(true);
const isShow = ref("0");
const selectedIcon = ref("");
</script>

<style scoped lang="less">
.btnBox {
  width: 100%;
  position: absolute;
  bottom: 20px;
  display: flex;
  justify-content: end;
}
.icon-input {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.menu-form {
  width: 100%;
  height: 100%;
  position: relative;
  .menu-form-item {
    margin-bottom: 20px;
    p {
      font-size: 14px;
      color: #333;
      margin-bottom: 8px;
    }
  }
}
</style>
