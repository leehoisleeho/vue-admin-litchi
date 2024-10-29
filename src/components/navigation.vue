<template>
  <div class="navigation">
    <div class="title">
      <img :src="logoUrl" :alt="title" />
      <span>{{ title }}</span>
    </div>
    <a-menu
      v-model:selectedKeys="selectedKeys"
      v-model:openKeys="openKeys"
      mode="inline"
      :items="menuItems"
      @click="handleMenuClick"
    />
  </div>
</template>

<script setup>
import { computed, reactive, ref, h, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { HomeOutlined, MenuOutlined } from "@ant-design/icons-vue";

// Constants and Environment Variables
const title = import.meta.env.VITE_APP_TITLE;
const logoUrl = "/logo.png";

// Router Setup
const router = useRouter();
const route = useRoute();

// Menu State
const selectedKeys = ref([route.path]);
const openKeys = ref(["menu"]); // 默认展开菜单管理

// Menu Item Factory
const createMenuItem = (label, key, icon = null, children = null) => ({
  key,
  label,
  icon: icon ? () => h(icon) : undefined,
  children,
});

// Menu Structure
const menuItems = reactive([
  createMenuItem("首页", "/", HomeOutlined),
  createMenuItem("菜单管理", "/menu", MenuOutlined),
]);

// Navigation Helpers
const isSubMenu = computed(() => (path) => path.split("/").length > 2);

const getParentKey = computed(() => (path) => {
  const segments = path.split("/");
  return segments.length > 1 ? `/${segments[1]}` : "";
});

// Event Handlers
const handleMenuClick = ({ key }) => {
  router.push(key);
};

// Route Watcher
watch(
  route,
  (newRoute) => {
    selectedKeys.value = [newRoute.path];

    // 根据当前路由判断是否需要展开父菜单
    const parentMenuItem = menuItems.find((item) =>
      item.children?.some((child) => child.key === newRoute.path)
    );

    if (parentMenuItem) {
      // 如果当前路由是子菜单，展开父菜单
      openKeys.value = [parentMenuItem.key];
    } else {
      // 如果是主菜单，收起所有菜单
      openKeys.value = [];
    }
  },
  { immediate: true }
);
</script>

<style scoped lang="less">
.navigation {
  width: 300px;
  height: 100vh;
  border-right: 1px solid rgba(229, 229, 229, 1);

  .title {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 15px;
    border-bottom: 1px solid rgba(229, 229, 229, 1);

    img {
      width: 60px;
      height: auto;
    }

    span {
      margin-top: 20px;
      font-size: 13px;
      font-weight: 600;
      font-style: italic;
      color: #333;
    }
  }
}

// Add responsive styles
@media (max-width: 768px) {
  .navigation {
    width: 250px;
  }
}

@media (max-width: 480px) {
  .navigation {
    width: 200px;

    .title {
      img {
        width: 40px;
      }

      span {
        font-size: 12px;
      }
    }
  }
}
</style>
