<template>
  <div class="menu-form">
    <a-modal v-model:open="open" :title="title" @ok="handleOk">
      <p>{{ modalText }}</p>
    </a-modal>
    <div class="menu-form-item">
      <p>菜单名称</p>
      <a-input
        v-model:value="menu_name"
        placeholder="请输入菜单名称"
        style="margin-top: 0"
      />
    </div>
    <div class="menu-form-item">
      <p>上层目录</p>
      <a-select ref="select" v-model:value="parentId" style="width: 100%">
        <a-select-option
          v-for="item in directoryList"
          :key="item.id"
          :value="item.id"
        >
          {{ item.directory_name }}
        </a-select-option>
      </a-select>
    </div>
    <div class="menu-form-item">
      <p>路由地址</p>
      <a-input
        v-model:value="router_path"
        placeholder="请输入路由地址 /user/add"
        style="margin-top: 0"
      />
    </div>
    <div class="menu-form-item">
      <p>目录排序</p>
      <a-input-number
        v-model:value="sort"
        :keyboard="keyboard"
        :min="1"
        style="width: 100%"
      />
    </div>
    <div class="menu-form-item">
      <p>文件地址</p>
      <a-input
        v-model:value="file_path"
        placeholder="请输入文件地址 /user/user.vue 或者 /user/user"
        style="margin-top: 0"
      />
      <!-- 显示匹配结果 -->
      <ul v-if="isShowList" class="pagesList">
        <li
          v-for="item in matchedPage"
          :key="item.value"
          @click="selectItem(item.value)"
        >
          {{ item.value }}
        </li>
      </ul>
      <p style="color: #ea4336; margin-top: 5px; font-size: 12px">
        {{ errorMsg }}
      </p>
    </div>
    <div class="btnBox">
      <a-button type="primary" @click="submitBtn">提交</a-button>
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits, onMounted, watch } from "vue";
import { getDirectoryList, createMenu, getMenuDetail, updateMenu } from "@api";
import pages from "../auto-pages.json"; // 根据你的输出路径调整
const open = ref(false);
const menu_name = ref("");
const sort = ref(1);
const keyboard = ref(true);
const isShow = ref("0");
const file_path = ref("");
const router_path = ref("");
const modalText = ref("确定创建菜单吗？");
const title = ref("创建菜单");
const parentId = ref("");
const pagesList = ref([]);

// 自定义事件
const emits = defineEmits(["submit-success"]);
// props
const props = defineProps(["id"]);
const id = ref(props.id);
onMounted(() => {
  if (id.value === "") {
    title.value = "创建目录";
    modalText.value = "确定创建吗？";
  } else {
    getData(id.value);
  }
});
// 获取编辑数据
const getData = async (id) => {
  const res = await getMenuDetail(id);
  if (res.code === 0) {
    const { data } = res;
    menu_name.value = data.menu_name;
    sort.value = data.sort;
    file_path.value = data.file_path;
    router_path.value = data.router_path;
    isShow.value = data.isShow;
    parentId.value = data.parentId;
    title.value = "编辑菜单";
    modalText.value = "确定编辑菜单吗?";
  }
};

// 创建
const submitBtn = () => {
  open.value = true;
  console.log(parentId.value);
};
// 提交创建事件
const handleOk = async () => {
  const data = {
    file_path: file_path.value,
    menu_name: menu_name.value,
    sort: sort.value,
    isShow: isShow.value,
    router_path: router_path.value,
    parentId: parentId.value,
  };
  if (id.value !== "") {
    const res = await updateMenu(id.value, data);
    if (res.code === 0) {
      emits("submit-success");
    }
    open.value = false;
    return;
  }
  const res = await createMenu(data);
  if (res.code === 0) {
    emits("submit-success");
    // 强制刷新页面
    location.reload();
  }
  open.value = false;
};
const directoryList = ref([]);
// 获取目录列表
const getDirectoryListData = async () => {
  const res = await getDirectoryList();
  if (res.code === 0) {
    const { data } = res;
    directoryList.value = data.filter((item) => item.isMenu === "0");
  }
};

const isShowList = ref(false);
const selectItem = (item) => {
  file_path.value = item;
  isShowList.value = false; // 选中后立即隐藏
};
function getRoutePath(fullPath) {
  // 匹配 /pages/ 后面的所有内容，直到文件扩展名
  const match = fullPath.match(/\/pages\/(.*?)\.vue$/);
  return match ? match[1] : "";
}

const errorMsg = ref("");
const matchedPage = ref(null);

// 监听file_path输入框的变化
watch(file_path, (newValue) => {
  let selected = true;
  if (newValue === "") {
    isShowList.value = false;
    selected = false;
  }
  // 如果选中了完整路径 则不显示列表
  pagesList.value.forEach((item) => {
    if (item.value === newValue) {
      selected = false;
    }
  });
  if (selected) {
    // 重置状态
    matchedPage.value = null;
    errorMsg.value = "";

    if (!newValue) return;

    // 使用filter找出所有匹配的项
    const found = pagesList.value.filter((item) =>
      item.value.includes(newValue)
    );

    if (found.length > 0) {
      isShowList.value = true;

      matchedPage.value = found.reverse();
    } else {
      console.log("未找到匹配的页面");
      errorMsg.value = "未找到匹配的页面";
    }
  }
});

// 页面加载时候
onMounted(() => {
  getDirectoryListData();
  const res = Object.entries(pages).map(([route, info]) => ({
    route,
    ...info,
  }));
  res.forEach((item) => {
    pagesList.value.push({
      value: "/" + getRoutePath(item.path),
    });
  });
});
</script>

<style scoped lang="less">
.pagesList {
  max-height: 200px;
  overflow-y: auto;
  margin-top: 5px;
  border: 1px solid #f5f5f5;
  opacity: 1;
  li {
    list-style: none;
    padding: 10px 8px;
    cursor: pointer;
    &:hover {
      background-color: #f5f5f5;
    }
  }
}
.btnBox {
  position: absolute;
  display: flex;
  justify-content: end;
  bottom: 0;
  width: 100%;
}
.icon-input {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.menu-form {
  width: 100%;
  height: 93%;
  position: relative;
  .menu-form-item {
    margin-bottom: 20px;
    p {
      font-size: 14px;
      color: #333;
      margin-bottom: 8px;
    }
  }
}
</style>
