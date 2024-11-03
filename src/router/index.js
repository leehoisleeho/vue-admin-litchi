import { createRouter, createWebHistory } from "vue-router";
// 基础路由组件
const Home = () => import("@pages/basic/home.vue");
const Login = () => import("@pages/basic/login.vue");
const TokenWarning = () => import("@pages/error/token-warning.vue");
const PageNotFound = () => import("@pages/error/404.vue");

import { getDirectoryList } from "@api";

const { data } = await getDirectoryList();

const routerList = [];
// 修改为正确的路径格式
const modules = import.meta.glob(["/src/pages/**/*.vue"]);

const normalizeComponentPath = (path) => {
  // 移除开头的斜杠（如果存在）
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  // 构造正确的路径格式
  const normalizedPath = `/src/pages/${cleanPath}.vue`;

  if (modules[normalizedPath]) {
    return modules[normalizedPath];
  }
  return undefined;
};

for (let i = 0; i < data.length; i++) {
  if (data[i].isMenu === "1") {
    // 去掉路径中的 .vue 后缀（如果存在）
    const routerPath = data[i].file_path.replace(/\.vue$/, "");
    const component = normalizeComponentPath(routerPath);
    if (component) {
      routerList.push({
        path: `${data[i].router_path}`,
        name: data[i].router_path,
        meta: {
          title: data[i].directory_name,
        },
        component,
      });
    }
  } else if (data[i].isMenu === "0") {
    data[i].children.forEach((item) => {
      // 去掉路径中的 .vue 后缀（如果存在）
      const routerPath = item.file_path.replace(/\.vue$/, "");
      const component = normalizeComponentPath(routerPath);
      if (component) {
        routerList.push({
          path: item.router_path,
          name: item.menu_name,
          meta: {
            title: item.menu_name,
          },
          component,
        });
      }
    });
  }
}

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    children: [
      // 动态路由
      ...routerList,
    ],
  },
  // 登录
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: {
      title: "登录",
    },
  },
  // 404
  {
    path: "/:pathMatch(.*)*",
    name: "PageNotFound",
    component: PageNotFound,
    meta: {
      title: "404页面没找到",
    },
  },
  // 登录过期
  {
    path: "/token-warning",
    name: "TokenWarning",
    component: TokenWarning,
    meta: {
      title: "访问受限",
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  document.title =
    import.meta.env.VITE_APP_TITLE + " - " + to.meta.title || "默认标题";
  next();
});

export default router;
