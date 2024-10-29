<template>
  <div class="menu-form-item">
    <p>目录图标</p>
    <div class="icon-input">
      <component
        :is="selectedIcon"
        v-if="selectedIcon"
        style="font-size: 23px; color: #666"
      />
      <span v-else style="font-size: 12px; color: #666">无</span>

      <a-input
        v-model:value="iconName"
        placeholder="点击选择图标"
        style="margin-top: 0; width: 95%"
        readonly
        @click="showModal = true"
      />

      <a-modal
        v-model:open="showModal"
        title="选择图标"
        width="800px"
        @cancel="handleCancel"
      >
        <a-input
          v-model:value="searchText"
          placeholder="搜索图标"
          style="margin-bottom: 16px"
          @input="handleSearch"
        >
          <template #prefix>
            <SearchOutlined />
          </template>
        </a-input>

        <div class="icon-list">
          <div
            v-for="(icon, name) in filteredIcons"
            :key="name"
            class="icon-item"
            :class="{ 'icon-item-selected': iconName === name }"
            @click="selectIcon(name)"
          >
            <component :is="icon" />
            <span class="icon-name">{{ name.replace("Outlined", "") }}</span>
          </div>
        </div>

        <template #footer>
          <a-button @click="handleCancel">取消</a-button>
          <a-button type="primary" @click="handleOk">确定</a-button>
        </template>
      </a-modal>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import * as Icons from "@ant-design/icons-vue";
import { SearchOutlined } from "@ant-design/icons-vue";

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:modelValue", "change"]);

const showModal = ref(false);
const iconName = ref(props.modelValue);
const searchText = ref("");
const selectedIcon = computed(() => Icons[iconName.value]);

// 过滤出 Outlined 类型的图标
const outlinedIcons = computed(() => {
  const icons = {};
  Object.entries(Icons).forEach(([name, component]) => {
    if (name.endsWith("Outlined") && name !== "SearchOutlined") {
      icons[name] = component;
    }
  });
  return icons;
});

// 搜索过滤图标 - 使用计算属性自动响应搜索文本变化
const filteredIcons = computed(() => {
  const icons = outlinedIcons.value;
  if (!searchText.value) return icons;

  const filtered = {};
  Object.entries(icons).forEach(([name, component]) => {
    if (name.toLowerCase().includes(searchText.value.toLowerCase())) {
      filtered[name] = component;
    }
  });
  return filtered;
});

// 选择图标
const selectIcon = (name) => {
  iconName.value = name;
};

// 处理搜索输入
const handleSearch = (e) => {
  searchText.value = e.target.value;
};

// 确认选择
const handleOk = () => {
  emit("update:modelValue", iconName.value);
  showModal.value = false;
};

// 取消选择
const handleCancel = () => {
  iconName.value = props.modelValue;
  showModal.value = false;
};

// 监听外部值变化
watch(
  () => props.modelValue,
  (newValue) => {
    iconName.value = newValue;
  }
);
</script>

<style scoped lang="less">
.icon-input {
  display: flex;
  align-items: center;
  gap: 8px;

  .anticon {
    font-size: 16px;
    color: #333;
  }
}

.icon-list {
  height: 400px;
  overflow-y: auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 8px;
  padding: 8px;

  .icon-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 12px 8px;
    cursor: pointer;
    border: 1px solid #f0f0f0;
    border-radius: 4px;
    transition: all 0.3s;

    &:hover {
      border-color: #1890ff;
      background: #e6f7ff;
    }

    &-selected {
      border-color: #1890ff;
      background: #e6f7ff;
    }

    :deep(.anticon) {
      font-size: 24px !important;
      margin-bottom: 8px;
    }

    .icon-name {
      font-size: 12px;
      color: #666;
      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 100%;
    }
  }
}

:deep(.ant-modal-body) {
  max-height: 600px;
  overflow-y: auto;
}
</style>
