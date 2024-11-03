<template>
  <div class="permissions-box">
    <div class="menu-form-item">
      <p>权限名称</p>
      <a-input
        v-model:value="permissions_name"
        placeholder="请输入权限名称"
        style="margin-top: 0"
      />
    </div>
    <div class="menu-form-item">
      <p>权限列表</p>
      <a-tree
        v-model:expandedKeys="expandedKeys"
        v-model:selectedKeys="selectedKeys"
        v-model:checkedKeys="checkedKeys"
        checkable
        :tree-data="treeData"
        @check="handleCheck"
      >
      </a-tree>
    </div>
    <a-button type="primary" @click="submitBtn">提交</a-button>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getDirectoryList } from "@api";
import router from "../router";

const permissions_name = ref("");
const expandedKeys = ref([]);
const selectedKeys = ref([]);
const checkedKeys = ref([]);

const originalData = ref([]);

const treeData = ref([]);
const handleCheck = (value) => {
  console.log("handleCheck", value);
  console.log(checkedKeys.value);
};

onMounted(async () => {
  try {
    const res = await getDirectoryList();
    originalData.value = res.data;
    originalData.value.map((item) => {
      treeData.value.push({
        key: item.router_path,
        title: item.directory_name,
        children: item.children.map((subItem) => ({
          key: subItem.id,
          title: subItem.menu_name,
        })),
      });
    });
  } catch (error) {
    console.error("Failed to load directory list:", error);
  }
});

const submitBtn = () => {
  console.log(originalData.value);
  const data_json = JSON.stringify(originalData.value);
  console.log(data_json);
};
</script>

<style scoped lang="less">
.menu-form-item {
  margin-bottom: 20px;
  p {
    font-size: 14px;
    color: #333;
    margin-bottom: 8px;
  }
}
</style>
