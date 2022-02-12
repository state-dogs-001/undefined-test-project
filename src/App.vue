<template>
  <div id="app">
    <NavbarComponent />
    <div class="main">
      <router-view />
    </div>
    <FooterComponent />
  </div>
</template>

<script>
import NavbarComponent from "./components/NavbarComponent.vue";
import FooterComponent from "./components/FooterComponent.vue";

export default {
  components: {
    NavbarComponent,
    FooterComponent,
  },
  data() {
    return {};
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Prompt:wght@200&display=swap");
#app {
  font-family: "Prompt", sans-serif;
  background-color: rgba(0, 0, 0, 0.1);
}
.main {
  min-height: 77vh;
}
</style>
