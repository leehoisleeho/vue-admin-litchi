import { createRouter, createWebHistory } from "vue-router";
import Home from "@pages/home.vue";
import Index from "@pages/index.vue";
import Login from "@pages/login.vue";
import Menu from "@pages/menu.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    children: [
      {
        path: "/",
        name: "Index",
        component: Index,
        meta: {
          title: "首页",
        },
      },
      {
        path: "menu",
        name: "Menu",
        component: Menu,
        meta: {
          title: "菜单管理",
        },
      },
    ],
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: {
      title: "登录",
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 全局导航守卫
router.beforeEach((to, from, next) => {
  // 设置标题
  document.title =
    to.meta.title || import.meta.env.VITE_APP_TITLE || "默认标题";
  next();
});

export default router;
