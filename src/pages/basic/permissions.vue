<template>
  <div class="menu">
    <a-drawer
      v-model:open="open"
      class="custom-class"
      root-class-name="drawer"
      placement="right"
      :title="title"
      :closable="false"
      width="30%"
      destroyOnClose
    >
      <PermissionsForm></PermissionsForm>
    </a-drawer>
    <div class="title">
      <div class="title-item-1"></div>
      <div class="title-item-2">
        <a-button type="primary" @click="add">
          <template #icon>
            <FileAddOutlined />
          </template>
          新增权限
        </a-button>
      </div>
    </div>
    <div class="table"></div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { FileAddOutlined } from "@ant-design/icons-vue";
import PermissionsForm from "@components/permissionsForm.vue";

const open = ref(false);
const title = ref("");
const add = () => {
  title.value = "新增权限";
  open.value = true;
};
</script>

<style scoped lang="less">
.custom-list {
  list-style: none;
  .custom-list-item {
    display: flex;
    border-bottom: 1px solid rgb(245, 245, 245);
    background-color: white;
    padding: 15px 0;
    align-items: center;
    span {
      width: 100%;
      display: flex;
      justify-content: center;
      font-size: 12px;
    }
  }
  .custom-list-title {
    display: flex;
    justify-content: center;
    margin-bottom: 15px;
    span {
      border-right: 1px solid rgb(234, 234, 234);
      width: 100%;
      display: flex;
      justify-content: center;
      font-size: 12px;
      font-weight: 600;
    }
  }
}
.menu-row {
  height: auto;
}
.custom-icon-size {
  font-size: 23px !important;
}
:deep(.custom-row) {
  height: 6.9vh; // 设置你想要的行高
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(5px);
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}
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
    background: white;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0px 20px;
  }
  .table {
    height: 90%;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
    background: white;
    border-radius: 8px;
    overflow-y: auto;
  }

  /* 自定义滚动条的整体样式 */
  .table::-webkit-scrollbar {
    width: 5px; /* 设置滚动条的宽度 */
  }

  /* 自定义滚动轨道的样式 */
  .table::-webkit-scrollbar-track {
    background: #f1f1f1; /* 设置滚动轨道的背景颜色 */
    border-radius: 2px; /* 设置滚动轨道的圆角 */
  }

  /* 自定义滚动滑块的样式 */
  .table::-webkit-scrollbar-thumb {
    background: #b3b3b3; /* 设置滚动滑块的背景颜色 */
    border-radius: 6px; /* 设置滚动滑块的圆角 */
  }

  /* 当鼠标悬停在滚动滑块上时的样式 */
  .table::-webkit-scrollbar-thumb:hover {
    background: #333; /* 设置鼠标悬停时滚动滑块的背景颜色 */
  }
}
</style>
