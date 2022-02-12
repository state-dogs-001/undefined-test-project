import Vue from "vue";
import VueRouter from "vue-router";
import jwt from "jsonwebtoken";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Login",
    component: () => import("../views/Login.vue"),
    beforeEnter: (to, from, next) => {
      const token = localStorage.getItem("token");
      if (token) {
        const user = jwt.decode(token);
        // if has token but token expire time out.
        if (!user) {
          localStorage.removeItem("token");
          next();
        } else {
          next({ path: "/main" });
        }
      } else {
        next();
      }
    },
  },
  {
    path: "/main",
    name: "MainPage",
    component: () => import("../views/MainPage.vue"),
    beforeEnter: (to, from, next) => {
      const token = localStorage.getItem("token");
      if (token) {
        const user = jwt.decode(token);
        // if has token but token expire time out.
        if (!user) {
          localStorage.removeItem("token");
          next({ path: "/" });
        } else {
          next();
        }
      } else {
        next({ path: "/" });
      }
    },
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
