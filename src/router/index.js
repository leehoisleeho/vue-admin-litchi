import { createRouter, createWebHistory } from "vue-router";

// 基础路由组件
const Home = () => import("@pages/basic/home.vue");
const Login = () => import("@pages/basic/login.vue");
const TokenWarning = () => import("@pages/error/token-warning.vue");
const PageNotFound = () => import("@pages/error/404.vue");

import { getDirectoryList, getAccountDetail } from "@api";

// 添加加载状态控制
let routesLoaded = false;

// 基础路由配置
const baseRoutes = [
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: {
      title: "登录",
      requiresAuth: false,
    },
  },
  {
    path: "/token-warning",
    name: "TokenWarning",
    component: TokenWarning,
    meta: {
      title: "访问受限",
      requiresAuth: false,
    },
  },
];

const modules = import.meta.glob(["/src/pages/**/*.vue"]);

const normalizeComponentPath = (path) => {
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  const normalizedPath = `/src/pages/${cleanPath}.vue`;
  return modules[normalizedPath];
};

const parseJWTToken = (token) => {
  try {
    const parts = token.split(".");
    const encodedPayload = parts[1];
    const decodedPayload = atob(encodedPayload);
    return JSON.parse(decodedPayload);
  } catch (error) {
    console.error("Token parsing failed:", error);
    return null;
  }
};

const generateRoutes = (menuList) => {
  const routerList = [];

  menuList.forEach((item) => {
    if (item.isMenu === "1") {
      const routerPath = item.file_path.replace(/\.vue$/, "");
      const component = normalizeComponentPath(routerPath);

      if (component) {
        routerList.push({
          path: item.router_path,
          name: item.router_path,
          meta: {
            title: item.directory_name,
            requiresAuth: true,
          },
          component,
        });
      }
    } else if (item.isMenu === "0" && item.children) {
      item.children.forEach((subItem) => {
        const routerPath = subItem.file_path.replace(/\.vue$/, "");
        const component = normalizeComponentPath(routerPath);

        if (component) {
          routerList.push({
            path: subItem.router_path,
            name: subItem.menu_name,
            meta: {
              title: subItem.menu_name,
              requiresAuth: true,
            },
            component,
          });
        }
      });
    }
  });

  return routerList;
};

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "Home",
      component: Home,
      children: [],
      meta: {
        requiresAuth: true,
      },
    },
    ...baseRoutes,
    {
      path: "/:pathMatch(.*)*",
      name: "PageNotFound",
      component: PageNotFound,
      meta: {
        title: "404页面没找到",
        requiresAuth: false,
      },
    },
  ],
});

// 初始化路由
const initializeRouter = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      routesLoaded = true;
      return false;
    }

    const payload = parseJWTToken(token);
    if (!payload) {
      routesLoaded = true;
      return false;
    }

    const res = await getAccountDetail(payload.id);
    const userData = res.data;

    let menuList;
    if (userData.permission !== "all") {
      menuList = JSON.parse(userData.permissions.permissions_list);
    } else {
      const { data } = await getDirectoryList();
      menuList = data;
    }

    // 清除现有的动态路由
    router.getRoutes().forEach((route) => {
      if (route.meta?.requiresAuth) {
        router.removeRoute(route.name);
      }
    });

    // 生成新的动态路由
    const dynamicRoutes = generateRoutes(menuList);

    // 添加新的动态路由
    const homeRoute = {
      path: "/",
      name: "Home",
      component: Home,
      children: dynamicRoutes,
      meta: {
        requiresAuth: true,
      },
    };

    router.addRoute(homeRoute);

    routesLoaded = true;
    return true;
  } catch (error) {
    console.error("初始化路由失败:", error);
    routesLoaded = true;
    return false;
  }
};

// 路由守卫
router.beforeEach(async (to, from, next) => {
  // 如果路由还没有加载完成，并且不是去登录页
  if (!routesLoaded && to.path !== "/login") {
    // 等待路由初始化
    const initialized = await initializeRouter();

    if (initialized) {
      // 路由初始化成功后，重新导航到目标路由
      return next({ path: to.fullPath, replace: true });
    } else {
      // 如果初始化失败，重定向到登录页
      return next("/login");
    }
  }

  // 设置页面标题
  document.title = `${import.meta.env.VITE_APP_TITLE} - ${
    to.meta.title || "默认标题"
  }`;

  const token = localStorage.getItem("token");

  // 处理需要认证的路由
  if (to.meta.requiresAuth && !token) {
    next("/login");
    return;
  }

  // 如果已登录，访问登录页则重定向到首页
  if (to.path === "/login" && token) {
    next("/");
    return;
  }

  next();
});

export default router;
