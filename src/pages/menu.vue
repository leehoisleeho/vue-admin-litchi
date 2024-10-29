<template>
  <div class="menu">
    <a-drawer
      v-model:open="open"
      class="custom-class"
      root-class-name="drawer"
      placement="right"
      title="菜单管理"
      :closable="false"
      width="30%"
      @after-open-change="afterOpenChange"
    >
      <MenuForm></MenuForm>
    </a-drawer>
    <div class="title">
      <div class="title-item-1"></div>
      <div class="title-item-2">
        <a-button type="primary" @click="showDrawer">
          <template #icon>
            <FileAddOutlined />
          </template>
          新增
        </a-button>
      </div>
    </div>
    <div class="table"></div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { FileAddOutlined } from "@ant-design/icons-vue";
import MenuForm from "@components/menuForm.vue";
const open = ref(false);
// 抽屉打开关闭回调
const afterOpenChange = (bool) => {};
const showDrawer = () => {
  open.value = true;
};
</script>

<style scoped lang="less">
.menu {
  width: 100%;
  height: 100%;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .title {
    height: 8%;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0px 20px;
  }
  .table {
    height: 90%;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
    border-radius: 8px;
  }
}
</style>
