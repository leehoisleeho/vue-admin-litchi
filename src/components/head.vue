<template>
  <div class="head">
    <a-modal v-model:open="open" title="退出">
      确认退出吗？
      <template #footer>
        <a-button
          key="back"
          @click="
            () => {
              open = false;
            }
          "
          >取消</a-button
        >
        <a-button key="submit" type="primary" danger @click="handleOk"
          >确认</a-button
        >
      </template>
    </a-modal>
    <div class="logout">
      <a-button type="primary" danger @click="logoutBtn">退出系统</a-button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { ref } from "vue";
const router = useRouter();
const open = ref(false);

const logoutBtn = () => {
  open.value = true;
};
const handleOk = () => {
  localStorage.removeItem("token");
  router.push("/login");
};
</script>

<style scoped lang="less">
.head {
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
  height: 100%;
  display: flex;
  justify-content: end;
  align-items: center;
  padding: 0 20px;
}
</style>
