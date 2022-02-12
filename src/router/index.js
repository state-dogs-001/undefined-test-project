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
        try {
          jwt.verify(token, "secret");
          next({ path: "/main" });
        } catch (error) {
          next();
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
        try {
          jwt.verify(token, "secret");
          next();
        } catch (error) {
          next({ path: "/" });
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
