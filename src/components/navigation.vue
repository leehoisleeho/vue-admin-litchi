<template>
  <div class="navigation">
    <div class="title">
      <img src="/logo.png" alt="" />
      <span>{{ title }}</span>
    </div>
    <a-menu
      v-model:selectedKeys="selectedKeys"
      v-model:openKeys="openKeys"
      mode="inline"
      :items="items"
      @click="handleClick"
    ></a-menu>
  </div>
</template>

<script setup>
import { reactive, ref, h, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { HomeOutlined, UserOutlined } from "@ant-design/icons-vue";
// 获取.env配置文件中的VUE_APP_BASE_URL
const title = import.meta.env.VITE_APP_TITLE;

const router = useRouter();
const route = useRoute();
const selectedKeys = ref([route.path]);
const openKeys = ref([]); // 初始化为空数组

function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}

const items = reactive([
  getItem("首页", "/", () => h(HomeOutlined)),
  getItem("个人设置", "/account", () => h(UserOutlined)),
]);

// 检查当前路由是否是子菜单
const isSubMenu = (path) => {
  return path.split("/").length > 2;
};

// 获取父级菜单的 key
const getParentKey = (path) => {
  return "/" + path.split("/")[1];
};

// 点击菜单项 跳转路由
const handleClick = (e) => {
  router.push(e.key);
};

// 监听路由变化并更新选中的菜单项和展开状态
watch(
  route,
  (newRoute) => {
    selectedKeys.value = [newRoute.path];

    // 只有当前路径是子菜单时，才设置 openKeys
    if (isSubMenu(newRoute.path)) {
      openKeys.value = [getParentKey(newRoute.path)];
    } else {
      // 如果是一级菜单，则清空 openKeys
      openKeys.value = [];
    }
  },
  { immediate: true }
);
</script>

<style scoped lang="less">
.title {
  display: flex;
  flex-direction: column;
  align-items: center;
  border-bottom: 1px solid rgb(229, 229, 229);
  padding: 15px;
  span {
    margin-top: 20px;
    font-size: 13px;
    font-weight: 600;
    color: #333;
    // 斜体
    font-style: italic;
  }
  img {
    width: 60px;
  }
}
.navigation {
  width: 300px;
  height: 100vh;
  border-right: 1px solid rgb(229, 229, 229);
}
</style>
