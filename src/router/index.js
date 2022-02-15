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
          next({ path: "/products" });
        } catch (error) {
          next();
        }
      } else {
        next();
      }
    },
  },
  {
    path: "/products",
    name: "Products",
    component: () => import("../views/Products.vue"),
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
  {
    path: "/add-product",
    name: "Create Product",
    component: () => import("../views/product/AddProduct.vue"),
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
  {
    path: "/update-product/:id",
    name: "Update Product",
    component: () => import("../views/product/UpdateProduct.vue"),
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
