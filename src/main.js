import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import "ant-design-vue/dist/reset.css";
import AntDesign from "ant-design-vue";
import { init } from "@utils/init";
import router, { addDynamicRoutes } from "./router/index";
import { getUserInfo } from "@utils/getUserInfo.js";
import { getDirectoryList } from "@api";

// 创建应用实例
const app = createApp(App);

// 当页面刷新时 获取用户信息 加载动态路由
const addRouter = async () => {
  // 检查当前路由是否是登录页面
  if (router.currentRoute.value.path === "/login") {
    return; // 如果是登录页面，则不执行后续操作
  }

  // 从缓存里面获取token
  const token = localStorage.getItem("token");
  if (!token) {
    router.push("/login");
    return; // 如果没有token，则重定向到登录页面
  }

  const userInfo = await getUserInfo(token);
  let data = null;
  if (userInfo.permission === "all") {
    let res = await getDirectoryList();
    data = res.data;
  } else {
    data = JSON.parse(userInfo.permissions.permissions_list);
  }
  await addDynamicRoutes(data);
};

// 初始化数据库
init();
await addRouter();
app.use(router);
app.use(AntDesign);
app.mount("#app");
