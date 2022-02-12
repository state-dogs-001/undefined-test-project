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
import { mapActions, mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters(["user"]),
  },
  created() {
    // Get user when create.
    this.getUser();
  },
  methods: {
    // get user data from token collection database.
    ...mapActions(["getUser"]),

    // Logout Function
    ...mapActions(["logout"]),
    async logoutClick() {
      const id = { id: this.user._id };
      await this.logout(id);
    },
  },
};
</script>

<style></style>
