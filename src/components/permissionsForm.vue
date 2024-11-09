<template>
  <div class="permissions-box">
    <a-form :model="formState" @finish="onFinish">
      <div class="menu-form-item">
        <p>权限名称</p>
        <a-input
          v-model:value="formState.permissions_name"
          placeholder="请输入权限名称"
          :status="formState.permissions_name ? '' : 'error'"
        />
        <span v-if="!formState.permissions_name" class="error-text"
          >请输入权限名称</span
        >
      </div>

      <div class="menu-form-item">
        <p>权限列表</p>
        <a-spin :spinning="loading">
          <a-tree
            v-model:checkedKeys="checkedKeys"
            checkable
            :tree-data="treeData"
            @check="handleCheck"
          />
        </a-spin>
      </div>

      <div class="action-buttons">
        <a-button
          type="primary"
          html-type="submit"
          :loading="submitting"
          v-if="EditId === ''"
          >提交</a-button
        >
        <a-button v-else :loading="submitting" @click="edit">更新</a-button>
      </div>
    </a-form>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, defineEmits, defineProps } from "vue";
import { message } from "ant-design-vue";
import _ from "lodash";
import {
  getDirectoryList,
  createPermission,
  getPermissionOne,
  updatePermission,
} from "@api";

// 定义props
const props = defineProps(["EditId"]);
const EditId = ref(props.EditId);

// 表单状态
const formState = reactive({
  permissions_name: "",
});

// 树形控件状态
const checkedKeys = ref([]);
const originalData = ref([]);
const treeData = ref([]);

// 加载状态
const loading = ref(false);
const submitting = ref(false);

// 自定义事件
const emits = defineEmits(["submit-success"]);

// 处理权限树选中事件
const handleCheck = (checkedKeysValue, { checked, node }) => {
  const newCheckedKeys = new Set(checkedKeysValue);

  // 更新所有节点的 isShow 属性
  const updateIsShow = (nodes) => {
    nodes.forEach((node) => {
      const hasCheckedChildren = node.children?.some((child) =>
        checkedKeys.value.includes(child.router_path)
      );
      node.isShow =
        hasCheckedChildren || checkedKeys.value.includes(node.router_path)
          ? "0"
          : "1";
      if (node.children) {
        updateIsShow(node.children);
      }
    });
  };

  // 获取所有父节点
  const getParentKeys = (key, nodes, parentKeys = []) => {
    for (const node of nodes) {
      if (node.router_path === key) {
        return parentKeys;
      }
      if (node.children) {
        const result = getParentKeys(key, node.children, [
          ...parentKeys,
          node.router_path,
        ]);
        if (result) {
          return result;
        }
      }
    }
    return null;
  };

  // 当节点被选中时，添加所有父节点到 checkedKeys 中
  if (checked) {
    const parentKeys = getParentKeys(node.key, originalData.value);
    if (parentKeys) {
      parentKeys.forEach((parentKey) => {
        newCheckedKeys.add(parentKey);
      });
    }
  }

  // 设置新的 checkedKeys 并更新所有节点的 isShow 属性
  checkedKeys.value = Array.from(newCheckedKeys);
  updateIsShow(originalData.value);

  // 更新后的元数据
  console.log("更新后的", originalData.value);
};

// 获取目录列表
const fetchDirectoryList = async () => {
  try {
    loading.value = true;
    const { data } = await getDirectoryList();
    treeData.value = data.map((item) => ({
      title: item.directory_name,
      key: item.router_path,
      isShow: "1",
      children: item.children
        ? item.children.map((childItem) => ({
            title: childItem.menu_name,
            key: childItem.router_path,
            isShow: "1",
            children: childItem.children
              ? childItem.children.map((grandChild) => ({
                  title: grandChild.menu_name,
                  key: grandChild.router_path,
                  isShow: "1",
                }))
              : [],
          }))
        : [],
    }));
    originalData.value = data;
  } catch (error) {
    message.error("获取目录列表失败");
  } finally {
    loading.value = false;
  }
};

// 提交表单
const onFinish = async () => {
  if (!formState.permissions_name) {
    message.error("请输入权限名称");
    return;
  }
  // 实现表单提交逻辑
  try {
    submitting.value = true;
    // 提交表单
    console.log(originalData.value);
    const data = JSON.stringify(originalData.value);
    const res = await createPermission({
      permissions_name: formState.permissions_name,
      permissions_list: data,
    });
    emits("submit-success");
    message.success("提交成功");
  } catch (error) {
    console.log(error);
    message.error("提交失败");
  } finally {
    submitting.value = false;
  }
};
// 编辑模式下，初始化表单和树数据
const initializeForm = async (id) => {
  try {
    loading.value = true;
    const { data } = await getPermissionOne(id);
    // 设置表单名称
    formState.permissions_name = data.permissions_name;
    // 解析权限列表数据
    const permissionData = JSON.parse(data.permissions_list);
    // 同步最新的权限列表
    const newList = await syncPermissionsList(permissionData);

    // 比较用户的权限列表和目录列表进行比较，找出差异
    // 转换树形数据结构的函数
    const transformToTreeData = (items) => {
      if (!Array.isArray(items)) return [];

      return items.map((item) => ({
        title: item.directory_name || item.menu_name,
        key: item.router_path,
        isShow: item.isShow,
        children: item.children ? transformToTreeData(item.children) : [],
      }));
    };

    // 获取选中的节点键值的函数
    const getCheckedKeys = (items) => {
      const keys = [];

      const processNode = (node) => {
        if (!node) return;

        // 检查子节点的选中状态
        if (node.children && node.children.length > 0) {
          const checkedChildrenCount = node.children.filter(
            (child) => child.isShow === "0"
          ).length;

          // 只有当所有子节点都被选中时，才选中父节点
          if (checkedChildrenCount === node.children.length) {
            keys.push(node.router_path);
          }

          // 递归处理子节点
          node.children.forEach((child) => {
            if (child.isShow === "0") {
              keys.push(child.router_path);
            }
            processNode(child);
          });
        } else if (node.isShow === "0") {
          // 叶子节点直接根据 isShow 状态判断
          keys.push(node.router_path);
        }
      };

      // 处理每个顶级节点
      items.forEach(processNode);

      return [...new Set(keys)]; // 去重
    };

    // 转换树形数据
    const transformedTreeData = transformToTreeData(newList);
    treeData.value = transformedTreeData;

    // 设置选中的节点
    checkedKeys.value = getCheckedKeys(newList);

    // 保存原始数据
    originalData.value = newList;
  } catch (error) {
    message.error("初始化表单数据失败");
  } finally {
    loading.value = false;
  }
};
// 同步最新的权限列表数据
const syncPermissionsList = async (value) => {
  // 获取最新的目录列表数据
  const { data: newData } = await getDirectoryList();
  let _data = [...value]; // 目标数据副本

  // 递归同步数据的辅助函数
  const syncItems = (sourceItems, targetItems) => {
    // 过滤并更新目标数据，只保留在源数据中存在的项
    return targetItems
      .filter((targetItem) => {
        // 检查当前项是否在源数据中存在
        const sourceItem = sourceItems.find(
          (item) => item.id === targetItem.id
        );
        return sourceItem !== undefined;
      })
      .map((targetItem) => {
        // 获取对应的源数据项
        const sourceItem = sourceItems.find(
          (item) => item.id === targetItem.id
        );

        // 处理子项
        let children = undefined;
        if (sourceItem.children?.length && targetItem.children?.length) {
          children = syncItems(sourceItem.children, targetItem.children);
        } else if (sourceItem.children?.length) {
          children = sourceItem.children.map((child) => ({
            ...child,
            isShow: "1",
          }));
        }

        // 合并数据，使用源数据的结构但保留目标数据的某些属性
        return {
          ...sourceItem,
          isShow: targetItem.isShow || "1",
          children,
        };
      });
  };

  // 执行同步，先过滤掉顶层不存在的项
  const syncedData = newData.map((sourceItem) => {
    const targetItem = _data.find((item) => item.id === sourceItem.id);

    // 如果在目标数据中找不到对应项，使用源数据并设置默认值
    if (!targetItem) {
      return {
        ...sourceItem,
        isShow: "1",
        children: sourceItem.children?.map((child) => ({
          ...child,
          isShow: "1",
        })),
      };
    }

    // 如果找到匹配项，递归同步处理
    return {
      ...sourceItem,
      isShow: targetItem.isShow || "1",
      children:
        sourceItem.children?.length && targetItem.children?.length
          ? syncItems(sourceItem.children, targetItem.children)
          : sourceItem.children?.map((child) => ({
              ...child,
              isShow: "1",
            })),
    };
  });

  console.log("同步后的数据", syncedData);
  return syncedData;
};

// 组件挂载时获取数据
onMounted(async () => {
  if (EditId.value === "") {
    fetchDirectoryList();
  } else {
    const id = EditId.value;
    await initializeForm(id);
  }
});

// 编辑模式
const edit = async () => {
  console.log("编辑");
  try {
    await updatePermission(EditId.value, {
      permissions_name: formState.permissions_name,
      permissions_list: JSON.stringify(originalData.value),
    });
    emits("submit-success");
    message.success("更新成功");
  } catch (error) {
    console.log(error);
    message.error("更新失败");
  } finally {
    submitting.value = false;
  }
};
</script>

<style scoped lang="less">
.permissions-box {
  padding: 24px;
  background: #fff;
  border-radius: 4px;

  .menu-form-item {
    margin-bottom: 24px;

    p {
      font-size: 14px;
      color: #333;
      margin-bottom: 8px;
      font-weight: 500;
    }
  }

  .error-text {
    color: #ff4d4f;
    font-size: 12px;
    margin-top: 4px;
  }

  .action-buttons {
    margin-top: 24px;

    button {
      margin-right: 12px;
    }
  }
}
</style>
