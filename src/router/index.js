import { createRouter, createWebHistory } from "vue-router";

// 动态导入基础路由组件
const Login = () => import("@pages/basic/login.vue");
const TokenWarning = () => import("@pages/error/token-warning.vue");
const PageNotFound = () => import("@pages/error/404.vue");

// 静态路由
const staticRoutes = [
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: {
      title: "登录",
    },
  },
  {
    path: "/token-warning",
    name: "TokenWarning",
    component: TokenWarning,
    meta: {
      title: "访问受限",
    },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "PageNotFound",
    component: PageNotFound,
    meta: {
      title: "404页面没找到",
    },
  },
];

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes: staticRoutes,
});

export const addDynamicRoutes = async (data) => {
  const routerList = [];
  const modules = import.meta.glob(["/src/pages/**/*.vue"]);
  const normalizeComponentPath = (path) => {
    const cleanPath = path.startsWith("/") ? path.slice(1) : path;
    const normalizedPath = `/src/pages/${cleanPath}.vue`;

    if (modules[normalizedPath]) {
      return modules[normalizedPath];
    }
    return undefined;
  };

  data.forEach((item) => {
    if (item.isMenu === "1") {
      const routerPath = item.file_path.replace(/\.vue$/, "");
      const component = normalizeComponentPath(routerPath);
      if (component) {
        routerList.push({
          path: item.router_path,
          name: item.router_path,
          meta: {
            title: item.directory_name,
          },
          component,
        });
      }
    } else if (item.isMenu === "0") {
      item.children.forEach((childItem) => {
        const routerPath = childItem.file_path.replace(/\.vue$/, "");
        const component = normalizeComponentPath(routerPath);
        if (component) {
          routerList.push({
            path: childItem.router_path,
            name: childItem.menu_name,
            meta: {
              title: childItem.menu_name,
            },
            component,
          });
        }
      });
    }
  });

  // 添加完动态路由后，需要添加到路由实例中
  router.addRoute({
    path: "/",
    name: "Home",
    component: () => import("@pages/basic/home.vue"),
    children: routerList,
  });
};

// 路由守卫 设置页面标题
router.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = to.meta.title;
  next();
});

export default router;
