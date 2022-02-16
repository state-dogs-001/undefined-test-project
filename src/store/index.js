import Vue from "vue";
import Vuex from "vuex";
import jwt from "jsonwebtoken";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    // state authentication
    userStatus: false,
    user: null,

    // state product
    products: null,
    addProductStatus: false,
    updateProductStatus: false,
    deleteProductStatus: false,
  },
  mutations: {
    // mutate authentication
    setUserStatus(state, status) {
      state.userStatus = status;
    },
    setUser(state, payload) {
      state.user = payload;
    },

    // mutate product
    setProduct(state, payload) {
      state.products = payload;
    },
    setAddProductStatus(state, status) {
      state.addProductStatus = status;
    },
    setUpdateProductStatus(state, status) {
      state.updateProductStatus = status;
    },
    setDeleteProductStatus(state, status) {
      state.deleteProductStatus = status;
    },
  },
  actions: {
    // ----------------------------------- function authentication ------------------------------------ //
    // Login
    async login({ commit }, userEmailPassword) {
      const response = await fetch("http://localhost:4000/api/sign-in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userEmailPassword),
      });

      const data = await response.json();

      // If status ok
      if (data.status === "ok") {
        // has user data
        if (data.user) {
          localStorage.setItem("token", data.user.token);
          commit("setUserStatus", true);
          alert("Login successful");
          window.location.replace("/products");
        }
      }

      // If has data but token expire out.
      else if (data.status === "tokenError") {
        // Use id for update token with email.
        const userIdEmail = {
          id: data.user._id,
          email: data.user.email,
        };

        // Update token and use it
        const update_response = await fetch(
          "http://localhost:4000/api/update-token",
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(userIdEmail),
          }
        );

        const newData = await update_response.json();

        localStorage.setItem("token", newData.user.token);
        commit("setUserStatus", true);
        alert("Login successful");
        window.location.replace("/products");
      }

      // Invalid login
      else {
        alert(data.message);
        commit("setUserStatus", false);
      }
    },

    // Get user data and token.
    async getUser({ commit }) {
      const response = await fetch("http://localhost:4000/api/get-user", {
        method: "GET",
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      });

      const data = await response.json();

      // Response status ok
      if (data.status === "ok") {
        const token = data.user.token;
        try {
          // if token is ok.
          jwt.verify(token, "secret");
          commit("setUser", data.user);
        } catch (error) {
          // token expire time out
          commit("setUser", null);
        }
      }
    },

    // Logout
    async logout({ commit }, id) {
      const response = await fetch("http://localhost:4000/api/logout", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(id),
      });

      const getResponse = await response.json();
      // Remove token and set user null
      if (getResponse.status === "ok") {
        localStorage.removeItem("token");
        commit("setUserStatus", false);
        alert("Logout success");
        window.location.replace("/");
      }
    },

    // ----------------------------------- function authentication ------------------------------------ //

    // ------------------------------------ function crud product ------------------------------------- //
    // Get products data
    async getProducts({ commit }) {
      const response = await fetch("http://localhost:4000/api/products", {
        method: "GET",
      });

      const data = await response.json();

      // If response status is ok
      if (data.status === "ok") {
        commit("setProduct", data.data);
      } else {
        commit("setProduct", null);
      }
    },

    // Add product
    async addProduct({ commit }, product_info) {
      const add_response = await fetch(
        "http://localhost:4000/api/add-product",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": localStorage.getItem("token"),
          },
          body: JSON.stringify(product_info),
        }
      );

      const response = await add_response.json();
      if (response.status === "ok") {
        commit("setAddProductStatus", true);
        alert(response.message);
        window.location.replace("/products");
      } else {
        commit("setAddProductStatus", false);
        alert(response.message);
      }
    },

    // Update product
    async updateProduct({ commit }, product_info) {
      const update_response = await fetch(
        "http://localhost:4000/api/update-product",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": localStorage.getItem("token"),
          },
          body: JSON.stringify(product_info),
        }
      );

      const response = await update_response.json();
      if (response.status === "ok") {
        commit("setUpdateProductStatus", true);
        alert(response.message);
        window.location.replace("/products");
      } else {
        commit("setUpdateProductStatus", false);
        alert(response.message);
      }
    },

    // Delete product
    async deleteProduct({ commit }, id) {
      const del_response = await fetch(
        "http://localhost:4000/api/delete-product",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": localStorage.getItem("token"),
          },
          body: JSON.stringify(id),
        }
      );

      const response = await del_response.json();
      if (response.status === "ok") {
        commit("setDeleteProductStatus", true);
        alert(response.message);
        window.location.reload();
      } else {
        commit("setDeleteProductStatus", false);
        alert(response.message);
      }
    },

    // ------------------------------------ function crud product ------------------------------------- //
  },
  getters: {
    user: (state) => state.user,
    products: (state) => state.products,
  },
});
