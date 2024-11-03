import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router";
import "ant-design-vue/dist/reset.css";
import AntDesign from "ant-design-vue";
import { init } from "@utils/init";

const app = createApp(App);

// 初始化数据库
init();
app.use(router);
app.use(AntDesign);
app.mount("#app");
