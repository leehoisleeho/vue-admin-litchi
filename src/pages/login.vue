<template>
  <div class="login">
    <div class="login-box">
      <div class="right-top">
        <span style="background: #ea4336"></span>
        <span style="background: #34a853"></span>
        <span style="background: #4285f4"></span>
      </div>
      <div class="login-box-1">
        <div class="title">
          <p>{{ title }}</p>
        </div>
        <img src="../assets/images/login.png" alt="" />
        <div class="foot">浩辰科技提供技术支持 18608735101</div>
      </div>
      <div class="login-box-2">
        <div class="title-2">
          <img src="/logo.png" alt="" />
          <h1>登录 Login</h1>
          <a-input
            v-model:value="username"
            style="width: 420px; margin-top: 20px"
            placeholder="请输入账号"
            @keydown.enter.exact.prevent="_enter"
            size="large"
          >
            <template #prefix>
              <UserOutlined />
            </template>
          </a-input>
          <a-input-password
            v-model:value="password"
            style="width: 420px; margin-top: 20px"
            placeholder="请输入密码"
            @keydown.enter.exact.prevent="_enter"
            size="large"
          >
            <template #prefix>
              <LockOutlined />
            </template>
            <template #iconRender="v">
              <EyeTwoTone v-if="v"></EyeTwoTone>
              <EyeInvisibleOutlined v-else></EyeInvisibleOutlined>
            </template>
          </a-input-password>
          <a-button
            type="primary"
            style="width: 420px; margin-top: 20px"
            size="large"
            @click="submitLogin"
            :loading="loading"
            >登录</a-button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import {
  EyeTwoTone,
  EyeInvisibleOutlined,
  UserOutlined,
  LockOutlined,
} from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import { login } from "@api";
import SHA256 from "crypto-js/sha256";

const router = useRouter();
const username = ref("");
const password = ref("");
const title = import.meta.env.VITE_APP_TITLE;
const loading = ref(false);
// 回车发送事件
const _enter = (event) => {
  if (event.keyCode === 13) {
    submitLogin();
  }
};

const submitLogin = async () => {
  loading.value = true;
  if (!username.value || !password.value) {
    message.error("账号密码不能为空", 1.5);
    loading.value = false;
    return;
  }
  // 使用 SHA-256 对密码进行哈希
  const hashedPassword = SHA256(password.value).toString();
  try {
    const res = await login({
      username: username.value,
      password: hashedPassword,
    });
    if (res.code === 0) {
      localStorage.setItem("token", res.data.token_access);
      message.success("登录成功", 1.5);
      router.push("/");
    } else {
      // 如果登录失败，也显示错误信息
      message.error(res.message || "登录失败", 1.5);
    }
  } catch (error) {
    console.error(error);
  } finally {
    // 无论成功还是失败，都会执行这里的代码
    loading.value = false;
  }
};
</script>

<style scoped lang="less">
.login {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  // 背景色 渐变
  background: linear-gradient(20deg, @blue 60%, white 100%);
  .login-box {
    width: 1000px;
    height: 700px;
    box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
    border-radius: 10px;
    display: flex;
    background: white;
    position: relative;

    .right-top {
      height: 20;
      position: absolute;
      right: 5px;
      top: 15px;
      display: flex;
      span {
        display: flex;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        margin-right: 7px;
      }
    }
  }
}
.login-box-1 {
  border-right: 1px solid rgb(241, 241, 241);
  height: 100%;
  width: 40%;
  display: flex;
  justify-content: center;
  align-items: center;
  display: flex;
  flex-direction: column;
  position: relative;
  .foot {
    font-size: 11px;
    color: #929292;
    position: absolute;
    bottom: 10px;
    // 字间距
    letter-spacing: 0.5px;
  }
  .title {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 20px;
    left: 20px;
    img {
      width: 20px;
    }
    p {
      font-size: 15px;
      color: #636363;
      margin-left: 5px;
      // 斜体
      font-style: italic;
      font-weight: 600;
    }
  }
  img {
    width: 350px;
  }
  h1 {
    margin-bottom: 20px;
    font-weight: 400;
    color: #929292;
    font-size: 25px;
  }
}
.login-box-2 {
  width: 60%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .title-2 {
    display: flex;
    flex-direction: column;
    align-items: center;
    h1 {
      font-size: 18px;
      color: #565656;
      font-weight: 500;
      // 斜体
      font-style: italic;
    }
    img {
      width: 120px;
      margin-bottom: 20px;
    }
  }
}
</style>
