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
      :items="combinedMenuItems"
      @click="handleMenuClick"
    />
  </div>
</template>

<script setup>
import { computed, ref, h, watch, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import * as Icons from "@ant-design/icons-vue";
import { getDirectoryList } from "@api";

// Constants and Environment Variables
const title = import.meta.env.VITE_APP_TITLE;
const logoUrl = "/logo.png";

// Router Setup
const router = useRouter();
const route = useRoute();

// Menu State
const selectedKeys = ref([]);
const openKeys = ref([]);
const menuData = ref([]);

// 动态创建图标组件
const createIcon = (iconName) => {
  const icon = Icons[iconName];
  return icon ? () => h(icon) : null;
};

// 处理动态菜单项
const dynamicMenuItems = computed(() => {
  return menuData.value
    .filter((item) => item.isShow === "0")
    .sort((a, b) => b.sort - a.sort)
    .map((item) => {
      if (item.isMenu === "1") {
        return {
          key: item.router_path,
          label: item.directory_name,
          icon: createIcon(item.icon_name),
        };
      } else if (item.isMenu === "0") {
        return {
          key: item.router_path,
          label: item.directory_name,
          icon: createIcon(item.icon_name),
          children: item.children
            .sort((a, b) => b.sort - a.sort)
            .map((subItem) => ({
              key: subItem.router_path,
              label: subItem.menu_name,
            })),
        };
      }
    });
});

// 合并静态和动态菜单项
const combinedMenuItems = computed(() => {
  return [...dynamicMenuItems.value];
});

// 获取菜单信息
const fetchMenuList = async () => {
  try {
    const { data } = await getDirectoryList();
    menuData.value = data;
    // 获取菜单数据后更新选中状态
    updateSelectedKeys(route.path);
  } catch (error) {
    console.error("获取菜单列表失败:", error);
  }
};

// 更新选中的菜单项
// 更新选中的菜单项和展开的菜单项
const updateSelectedKeys = (path) => {
  selectedKeys.value = [path];
  // 更新展开的菜单
  const matchingItem = menuData.value.find((item) =>
    item.children?.some((child) => child.router_path === path)
  );
  if (matchingItem) {
    const parentKey = matchingItem.router_path;
    if (!openKeys.value.includes(parentKey)) {
      openKeys.value = [...openKeys.value, parentKey];
    }
  } else {
    // 如果没有匹配的二级菜单项，则可能是顶级菜单项或需要关闭所有展开的菜单
    openKeys.value = [];
  }
};

// Navigation Handlers
const handleMenuClick = ({ key }) => {
  updateSelectedKeys(key);
  router.push(key);
};

// 监听路由变化
watch(
  () => route.path,
  (newPath) => {
    updateSelectedKeys(newPath);
  },
  { immediate: true }
);

// 监听菜单数据变化
watch(
  menuData,
  () => {
    updateSelectedKeys(route.path);
  },
  { deep: true }
);

onMounted(() => {
  fetchMenuList();
});
</script>

<style scoped lang="less">
.navigation {
  width: 300px;
  height: 100vh;

  .title {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 15px;

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
