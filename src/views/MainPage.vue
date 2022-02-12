<template>
  <div class="main-page my-5">
    <b-container>
      <h1>This is an main page</h1>
    </b-container>
  </div>
</template>

<script>
import jwt from "jsonwebtoken";

export default {
  // middleware router
  beforeCreate() {
    const token = localStorage.getItem("token");
    if (token) {
      const user = jwt.decode(token);
      // if has token but it determinate
      if (!user) {
        localStorage.removeItem("token");
        window.location.replace("/");
      }
    } else {
      window.location.replace("/");
    }
  },
};
</script>
