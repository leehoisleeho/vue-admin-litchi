<!-- TokenWarning.vue -->
<template>
  <a-result
    status="warning"
    title="访问受限"
    sub-title="您的登录状态已失效，请重新登录后继续访问"
    class="warning-page"
  >
    <template #extra>
      <a-button type="primary" danger size="large" @click="goToLogin">
        <template #icon>
          <LoginOutlined />
        </template>
        立即登录
      </a-button>
    </template>

    <!-- 添加额外的提示信息 -->
    <template #footer>
      <a-alert
        message="安全提示"
        description="为了保护您的账户安全，请及时登录并妥善保管您的账户信息"
        type="warning"
        show-icon
        class="mt-4 max-w-md mx-auto"
      />
    </template>
  </a-result>
</template>

<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { LoginOutlined } from "@ant-design/icons-vue";
import { message } from "ant-design-vue";

const router = useRouter();

// 防止用户通过浏览器返回按钮返回
onMounted(() => {
  history.pushState(null, null, document.URL);
  window.addEventListener("popstate", () => {
    history.pushState(null, null, document.URL);
  });

  // 显示提示消息
  message.warning("登录状态已失效，请重新登录");
});

// 跳转到登录页面
const goToLogin = () => {
  router.push("/login");
  router.replace("/login"); // 替换历史记录，防止返回
};
</script>

<style scoped>
.warning-page {
  padding-top: 100px;
  height: 100vh;
  background-color: #f5f5f5;
}

/* 让结果页面内容水平居中 */
:deep(.ant-result) {
  padding: 24px;
}

/* 自定义一些响应式样式 */
@media (max-width: 576px) {
  .warning-page {
    padding-top: 50px;
  }
}
</style>
