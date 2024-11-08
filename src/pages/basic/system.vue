<template>
  <div class="system-box">
    <div class="system">
      <div class="system-title">系统设置</div>
      <div class="system-item-img">
        <img src="/logo.png" alt="" v-if="system_logo_url === ''" />
        <img :src="baseURL + system_logo_url" alt="" v-else />
        <a-upload
          v-if="status === 1"
          :show-upload-list="false"
          :before-upload="beforeUpload"
          :custom-request="customUpload"
          accept="image/*"
        >
          <a-button>上传图片</a-button>
        </a-upload>
      </div>
      <div class="system-item">
        <p>系统名称</p>
        <a-input
          v-model:value="system_name"
          placeholder="请输入系统名称"
          style="width: 400px"
          :disabled="disabled"
        />
      </div>
      <div class="system-item">
        <p>系统版本</p>
        <a-input
          v-model:value="system_version"
          placeholder="请输入系统版本"
          style="width: 400px"
          :disabled="disabled"
        />
      </div>
      <a-button
        v-if="status === 0"
        style="width: 400px; margin-top: 10px"
        @click="edit"
        >编辑</a-button
      >
      <a-button
        type="primary"
        v-if="status === 1"
        style="width: 400px; margin-top: 10px"
        @click="submit"
        >保存并上传</a-button
      >
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getSystemConfig, updateSystemConfig, uploadImage } from "@api";
import { message } from "ant-design-vue";
// 环境变量里面配置的api地址
const baseURL = import.meta.env.VITE_BASE_URL;

const system_name = ref("");
const system_version = ref("");
const system_logo_url = ref("");
// 0是编辑 1是保存/上传
const status = ref(0);
const disabled = ref(true);

// 编辑按钮
const edit = () => {
  status.value = 1;
  disabled.value = false;
};

// 图片上传前的校验
const beforeUpload = (file) => {
  // 验证文件类型
  const isImage = file.type.startsWith("image/");
  if (!isImage) {
    message.error("只能上传图片文件!");
    return false;
  }

  // 验证文件大小（这里限制为2MB）
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("图片必须小于2MB!");
    return false;
  }

  return true;
};

// 自定义上传方法
const customUpload = async ({ file, onSuccess, onError }) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await uploadImage(formData);
    system_logo_url.value = response.data.filePath;
    message.success("上传成功");
  } catch (error) {
    console.error("上传出错:", error);
    message.error("上传失败");
    onError();
  }
};

// 提交
const submit = async () => {
  if (!system_name.value) {
    message.error("请输入系统名称");
    return;
  }
  if (!system_version.value) {
    message.error("请输入系统版本");
    return;
  }

  try {
    await updateSystemConfig({
      system_name: system_name.value,
      system_version: system_version.value,
      system_logo_url: system_logo_url.value,
    });
    status.value = 0;
    disabled.value = true;
    message.success("更新成功");
    // 刷新页面
    window.location.reload();
  } catch (error) {
    console.log(error);
    message.error("更新失败");
  }
};

// 获取初始数据
onMounted(async () => {
  try {
    const { data } = await getSystemConfig();
    if (data && data[0]) {
      system_name.value = data[0].system_name;
      system_version.value = data[0].system_version;
      system_logo_url.value = data[0].system_logo_url;
    }
  } catch (error) {
    console.error("获取系统配置失败:", error);
    message.error("获取系统配置失败");
  }
});
</script>

<style scoped lang="less">
.system-title {
  margin-bottom: 20px;
}
.system-item-img {
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-items: center;
  width: 400px;
  img {
    width: 100px;
    height: 100px;
    margin-bottom: 20px;
    border-radius: 8px;
  }
  margin-bottom: 20px;
}
.system-item {
  p {
    font-size: 13px;
    margin-bottom: 5px;
    color: #333;
  }
  margin-bottom: 20px;
}
.system-box {
  width: 100%;
  height: 100%;
  padding: 20px;
  .system {
    width: 100%;
    height: 100%;
    background: white;
    border-radius: 8px;
    padding: 20px;
  }
}
</style>
