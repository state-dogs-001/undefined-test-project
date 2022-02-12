<template>
  <div>
    <b-navbar toggleable="lg" type="light" variant="light">
      <b-navbar-brand to="/main">Undefined Test</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <!-- Not login -->
          <template v-if="!user">
            <b-button variant="outline-success" to="/">Login</b-button>
          </template>
          <!-- Logged in -->
          <template v-else>
            <b-nav-item disabled>Hello {{ user.email }}</b-nav-item>
            <b-button variant="danger" @click="logoutClick">Logout</b-button>
          </template>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: null,
    };
  },
  created() {
    this.getUser();
  },
  methods: {
    async getUser() {
      const req = await fetch("http://localhost:4000/api/check-token", {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      });
      const user = await req.json();
      if (user.status === "error") {
        localStorage.removeItem("token");
      } else {
        this.user = user.user;
      }
    },
    async logoutClick() {
      const id = { id: this.user._id };

      const response = await fetch("http://localhost:4000/api/logout", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(id),
      });

      const res = await response.json();
      console.log(res);
      if (res.status === "ok") {
        localStorage.removeItem("token");
        alert("Logout success");
        window.location.replace("/");
      }
    },
  },
};
</script>

<style></style>
