import { createRouter, createWebHistory } from "vue-router";
import Home from "@pages/home.vue";
import Index from "@pages/index.vue";
import Login from "@pages/login.vue";

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
      },
    ],
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
