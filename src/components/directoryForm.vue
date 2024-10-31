<template>
  <div class="menu-form">
    <a-modal v-model:open="open" :title="title" @ok="handleOk">
      <p>{{ modalText }}</p>
    </a-modal>
    <div class="menu-form-item">
      <p>目录名称</p>
      <a-input
        v-model:value="directory_name"
        placeholder="请输入目录名称"
        style="margin-top: 0"
      />
    </div>
    <div class="menu-form-item">
      <p>路由地址</p>
      <a-input
        v-model:value="router_path"
        placeholder="请输入目录路由地址 /user"
        style="margin-top: 0"
      />
    </div>
    <div class="menu-form-item">
      <Icon v-model="icon_name" />
    </div>
    <div class="menu-form-item">
      <p>目录排序</p>
      <a-input-number
        placeholder="请输入排序 数字越大越靠前"
        v-model:value="sort"
        :keyboard="keyboard"
        :min="1"
        style="width: 100%"
      />
    </div>
    <div class="menu-form-item">
      <p>目录显示/隐藏</p>
      <a-select ref="select" v-model:value="isShow" style="width: 100%">
        <a-select-option value="0">显示</a-select-option>
        <a-select-option value="1">隐藏</a-select-option>
      </a-select>
    </div>
    <div class="menu-form-item">
      <p>是否有子菜单</p>
      <a-select ref="select" v-model:value="isMenu" style="width: 100%">
        <a-select-option value="0">是</a-select-option>
        <a-select-option value="1">否</a-select-option>
      </a-select>
    </div>
    <div class="menu-form-item" v-if="isMenu === '1'">
      <p>文件地址</p>
      <a-input
        v-model:value="file_path"
        placeholder="请输入文件地址 /user/user.vue 或者 /user/user"
        style="margin-top: 0"
      />
    </div>
    <div class="btnBox">
      <a-button type="primary" @click="submitBtn" v-if="id === ''"
        >提交</a-button
      >
      <a-button v-else @click="submitBtn">更新</a-button>
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits, defineProps } from "vue";
import { createDirectory, getDirectoryDetail, updateDirectory } from "@api";
import Icon from "@/components/icon.vue";
import { onMounted } from "vue";

const open = ref(false);
const directory_name = ref("");
const sort = ref(1);
const keyboard = ref(true);
const isShow = ref("0");
const icon_name = ref("");
const isMenu = ref("0");
const file_path = ref("");
const router_path = ref("");
const modalText = ref("确定创建目录吗？");
const title = ref("创建目录");

// 获取编辑数据
const getData = async (id) => {
  const res = await getDirectoryDetail(id);
  if (res.code === 0) {
    const { data } = res;
    directory_name.value = data.directory_name;
    sort.value = data.sort;
    isShow.value = data.isShow;
    icon_name.value = data.icon_name;
    isMenu.value = data.isMenu;
    file_path.value = data.file_path;
    router_path.value = data.router_path;
    title.value = "编辑目录";
    modalText.value = "确定更新吗？";
  }
};

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
// 创建
const submitBtn = () => {
  open.value = true;
};

// 提交创建事件
const handleOk = async () => {
  const data = {
    file_path: file_path.value,
    directory_name: directory_name.value,
    sort: sort.value,
    isShow: isShow.value,
    icon_name: icon_name.value,
    isMenu: isMenu.value,
    router_path: router_path.value,
  };
  if (id.value !== "") {
    const res = await updateDirectory(id.value, data);
    if (res.code === 0) {
      emits("submit-success");
    }
    open.value = false;
    return;
  }
  const res = await createDirectory(data);
  if (res.code === 0) {
    emits("submit-success");
  }
  open.value = false;
};
</script>

<style scoped lang="less">
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
