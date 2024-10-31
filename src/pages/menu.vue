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
      @after-open-change="afterOpenChange"
      destroyOnClose
    >
      <a-segmented
        v-model:value="value"
        :options="data"
        style="margin-bottom: 20px"
      />
      <Transition mode="out-in" name="fade">
        <KeepAlive>
          <component
            :is="activeComponent[value]"
            @submit-success="handleSubmitSuccess"
          />
        </KeepAlive>
      </Transition>
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
import { ref, reactive } from "vue";
import { FileAddOutlined } from "@ant-design/icons-vue";
import DirectoryForm from "@components/directoryForm.vue";
import MenuForm from "@components/menuForm.vue";
import { message } from "ant-design-vue";
const data = reactive(["目录", "菜单"]);
const value = ref(data[0]);
const open = ref(false);
const title = ref(value.value);

const activeComponent = {
  目录: DirectoryForm,
  菜单: MenuForm,
};
// 抽屉打开关闭回调
const afterOpenChange = () => {
  value.value = data[0];
};
const showDrawer = () => {
  open.value = true;
};
const handleSubmitSuccess = () => {
  open.value = false;
  message.success("提交成功");
};
</script>

<style scoped lang="less">
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
  }
}
</style>
