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
        :disabled="disabled"
      />
      <Transition mode="out-in" name="fade">
        <KeepAlive>
          <component
            :is="activeComponent[value]"
            @submit-success="handleSubmitSuccess"
            :id="id"
          />
        </KeepAlive>
      </Transition>
    </a-drawer>
    <div class="title">
      <div class="title-item-1"></div>
      <div class="title-item-2">
        <a-button type="primary" @click="add">
          <template #icon>
            <FileAddOutlined />
          </template>
          新增
        </a-button>
      </div>
    </div>
    <div class="table">
      <a-table
        :columns="columns"
        :data-source="dataList"
        :expand-column-width="100"
        :pagination="false"
        :row-className="() => 'custom-row'"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'isShow'">
            <a-tag color="red" v-if="record.isShow === '1'">隐藏</a-tag>
            <a-tag color="green" v-else>显示</a-tag>
          </template>
          <template v-if="column.key === 'icon_name'">
            <component
              :is="iconMap[`${record.icon_name}`]"
              class="custom-icon-size"
            />
          </template>
          <template v-if="column.key === 'router_path'">
            <a-tag color="blue">{{ record.router_path }}</a-tag>
          </template>
          <template v-if="column.key === 'isMenu'">
            <a-tag color="red" v-if="record.isMenu === '1'">无</a-tag>
            <a-tag color="green" v-else>有</a-tag>
          </template>
          <template v-if="column.key === 'file_path'">
            <a-tag color="#108ee9" v-if="record.file_path">{{
              record.file_path
            }}</a-tag>
            <a-tag v-else>-</a-tag>
          </template>
          <template v-if="column.key === 'updatedAt'">
            <a-tag color="#108ee9" v-if="record.updatedAt">{{
              record.updatedAt
            }}</a-tag>
            <a-tag v-else>-</a-tag>
          </template>
          <template v-if="column.key === 'action'">
            <div v-if="isSystem(record.directory_name)">
              <a-button type="link" @click="editDir(record.id)">编辑</a-button>
              <a-popconfirm
                title="确定删除吗?"
                ok-text="是"
                cancel-text="否"
                @confirm="deleteDir(record.id)"
              >
                <a-button danger type="link">删除</a-button>
              </a-popconfirm>
            </div>
          </template>
        </template>
        <template #expandedRowRender="{ record }">
          <a-tag v-if="record.list.length === 0">没有子菜单</a-tag>
          <ul v-else class="custom-list">
            <li class="custom-list-title">
              <span>id</span>
              <span>菜单名称</span>
              <span>排序</span>
              <span>路由地址</span>
              <span>文件路径</span>
              <span>创建时间</span>
              <span>更新时间</span>
              <span>操作</span>
            </li>
            <li class="custom-list-item" v-for="item in record.list">
              <span>{{ item.id }}</span>
              <span>{{ item.menu_name }}</span>
              <span>{{ item.sort }}</span>

              <span>
                <a-tag color="blue" style="width: auto">
                  {{ item.router_path }}
                </a-tag>
              </span>
              <span>
                <a-tag color="#108ee9" style="width: auto"
                  >{{ item.file_path }}
                </a-tag>
              </span>
              <span>
                {{ item.createdAt }}
              </span>
              <span>
                <a-tag
                  color="#108ee9"
                  v-if="item.updatedAt"
                  style="width: auto"
                  >{{ item.updatedAt }}</a-tag
                >
                <a-tag v-else style="width: auto">-</a-tag>
              </span>
              <span>
                <div v-if="isSystem(item.menu_name)">
                  <a-button type="link" @click="editMenu(item.id)"
                    >编辑</a-button
                  >
                  <a-popconfirm
                    title="确定删除吗?"
                    ok-text="是"
                    cancel-text="否"
                    @confirm="deleteMenu(item.id)"
                  >
                    <a-button danger type="link">删除</a-button>
                  </a-popconfirm>
                </div>
              </span>
            </li>
          </ul>
        </template>
        <template #expandColumnTitle>
          <span style="color: red">详情</span>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from "vue";
import * as Icons from "@ant-design/icons-vue";
import { getDirectoryList, deleteDirectory, deleteMenuOne } from "@api";
import { FileAddOutlined } from "@ant-design/icons-vue";
import DirectoryForm from "@components/directoryForm.vue";
import MenuForm from "@components/menuForm.vue";
import { message } from "ant-design-vue";

const data = reactive(["目录", "菜单"]);
const value = ref(data[0]);
const open = ref(false);
const title = ref(value.value);
const disabled = ref(false);

// 计算属性
const isSystem = computed(() => {
  return (value) => {
    if (
      value === "首页" ||
      value === "系统配置" ||
      value === "权限管理" ||
      value === "菜单管理" ||
      value === "账号管理"
    ) {
      return false;
    } else {
      return true;
    }
  };
});

/**
 * 新增/编辑状态
 * @description 0:新增 1:编辑
 */
const status = ref("");

/**
 * 类型
 * @description 0:菜单 1:目录
 */
const type = ref("");

// 动态加载图标
const iconMap = Object.keys(Icons).reduce((prev, current) => {
  prev[current] = Icons[current];
  return prev;
}, {});

const activeComponent = {
  目录: DirectoryForm,
  菜单: MenuForm,
};
// 表格配置
const columns = [
  {
    title: "id",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "目录名称",
    dataIndex: "directory_name",
    key: "directory_name",
  },
  {
    title: "图标",
    dataIndex: "icon_name",
    key: "icon_name",
  },
  {
    title: "排序",
    dataIndex: "sort",
    key: "sort",
  },
  {
    title: "路由地址",
    dataIndex: "router_path",
    key: "router_path",
  },
  {
    title: "子菜单",
    dataIndex: "isMenu",
    key: "isMenu",
  },
  {
    title: "文件地址",
    dataIndex: "file_path",
    key: "file_path",
  },
  {
    title: "创建时间",
    dataIndex: "createdAt",
    key: "createdAt",
  },
  {
    title: "更新时间",
    dataIndex: "updatedAt",
    key: "updatedAt",
  },
  {
    title: "操作",
    key: "action",
  },
];

const dataList = ref([]);
// 抽屉打开关闭回调
const afterOpenChange = () => {
  id.value = "";
  if (status.value === "1") {
    // 编辑
    disabled.value = true;
  } else if (status.value === "0") {
    // 新增
    disabled.value = false;
  }
};
const showDrawer = () => {
  open.value = true;
};
const handleSubmitSuccess = () => {
  open.value = false;
  message.success("提交成功");
  fetchMenuList();
};

// 获取菜单信息
const fetchMenuList = async () => {
  try {
    const { data } = await getDirectoryList();
    dataList.value = data.map((item) => {
      // 把item.children转换为list 然后删除children
      item.list = item.children;
      delete item.children;
      return {
        ...item,
        key: item.id,
      };
    });
  } catch (error) {
    console.error("获取菜单列表失败:", error);
  }
};
/**
 * add
 */
const add = () => {
  // 弹出表单
  showDrawer();
  // 设置表单类型
  title.value = "新增";
  // 设置状态 0:新增 1:编辑
  status.value = "0";
  id.value = "";
};
/**
 * 删除
 * deleteDir 删除目录
 * deleteMenu 删除菜单
 */
const deleteDir = async (id) => {
  const res = await deleteDirectory(id);
  if (res.code === 0) {
    message.success("删除成功");
    fetchMenuList();
  } else {
    message.error("删除失败");
  }
};
const deleteMenu = async (id) => {
  const res = await deleteMenuOne(id);
  if (res.code === 0) {
    message.success("删除成功");
    fetchMenuList();
  } else {
    message.error("删除失败");
  }
};

const id = ref("");
/**
 * editDir 编辑目录
 * editMenu 编辑菜单
 */
const editDir = (record) => {
  // 弹出表单
  showDrawer();
  // 设置表单类型
  title.value = "编辑目录";
  // 设置type 0:菜单 1:目录
  type.value = "1";
  // 设置滑块位置
  value.value = "目录";
  // 设置状态 0:新增 1:编辑
  status.value = "1";
  // 设置 id
  id.value = record;
};

const editMenu = (record) => {
  // 弹出表单
  showDrawer();
  // 设置表单类型
  title.value = "编辑菜单";
  // 设置type 0:菜单 1:目录
  type.value = "0";
  // 设置滑块位置
  value.value = "菜单";
  // 设置状态 0:新增 1:编辑
  status.value = "1";
  // 设置 id
  id.value = record;
};

// 页面加载时
onMounted(() => {
  fetchMenuList();
});
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
