<template>
  <div class="">
    <div class="menu-form-item">
      <p>用户名</p>
      <a-input
        v-model:value="username"
        placeholder="请输入用户名"
        style="margin-top: 0"
      />
    </div>
    <div class="menu-form-item">
      <p>密码</p>
      <a-input-password v-model:value="password" placeholder="请输入密码">
        <template #iconRender="v">
          <EyeTwoTone v-if="v"></EyeTwoTone>
          <EyeInvisibleOutlined v-else></EyeInvisibleOutlined>
        </template>
      </a-input-password>
    </div>
    <div class="menu-form-item">
      <p>权限</p>
      <a-select v-model:value="permissionsId" style="width: 100%">
        <a-select-option v-for="item in permissionsList" :value="item.id">{{
          item.permissions_name
        }}</a-select-option>
      </a-select>
    </div>
    <a-button type="primary" @click="submit" v-if="EditId === ''"
      >提交</a-button
    >
    <a-button @click="edit" v-else>更新</a-button>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { EyeTwoTone, EyeInvisibleOutlined } from "@ant-design/icons-vue";
import {
  getAccountDetail,
  createAccount,
  getPermissions,
  updateAccount,
} from "@api";
import { message } from "ant-design-vue";
const username = ref("");
const password = ref("");
const permissionsId = ref("");
const permissionsList = ref([]);

// 自定义事件
const emits = defineEmits(["submit-success"]);
// props
const props = defineProps(["EditId"]);
// oldPassWord
const oldPassWord = ref("");
onMounted(() => {
  getPermissionsList();
  if (props.EditId) {
    getAccountDetail(props.EditId).then((res) => {
      username.value = res.data.username;
      oldPassWord.value = res.data.password;
      password.value = res.data.password;
      permissionsId.value = res.data.permissionsId;
    });
  } else {
    getPermissionsList();
  }
});
// 获取权限列表
const getPermissionsList = async () => {
  const res = await getPermissions();
  permissionsList.value = res.data;
};

// 创建
const submit = async () => {
  try {
    await createAccount({
      username: username.value,
      password: password.value,
      permissionsId: permissionsId.value,
      permission: "",
    });
    emits("submit-success");
    message.success("更新成功");
  } catch (error) {
    emits("submit-success");
    message.error("更新失败");
  } finally {
    emits("submit-success");
  }
};
// 更新
const edit = async () => {
  if (oldPassWord.value === password.value) {
    try {
      await updateAccount(props.EditId, {
        username: username.value,
        password: oldPassWord.value,
        permissionsId: permissionsId.value,
        permission: "",
      });
      emits("submit-success");
      message.success("更新成功");
    } catch (error) {
      console.log(error);
      emits("submit-success");
      message.error("更新失败");
    }
    return;
  }
  try {
    await updateAccount(props.EditId, {
      username: username.value,
      password: password.value,
      permissionsId: permissionsId.value,
      permission: "",
    });
    emits("submit-success");
    message.success("更新成功");
  } catch (error) {
    console.log(error);
    emits("submit-success");
    message.error("更新失败");
  }
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
