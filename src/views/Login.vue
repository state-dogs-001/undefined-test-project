<template>
  <div class="login my-5">
    <b-container style="max-width: 600px">
      <b-card>
        <form @submit.stop.prevent="loginClick">
          <b-row>
            <b-col cols="12" class="mb-4">
              <h1>Login</h1>
            </b-col>
            <b-col cols="12" class="mb-3">
              <label for="email">E-mail</label>
              <input
                type="email"
                name="email"
                id="email"
                v-model="email"
                placeholder="Press your e-mail here"
                class="form-control"
                required
              />
            </b-col>
            <b-col cols="12" class="mb-3">
              <label for="password">Password</label>
              <input
                type="password"
                name="password"
                id="password"
                v-model="password"
                placeholder="Press your password here"
                class="form-control"
                required
              />
            </b-col>
            <b-col cols="12" class="mt-3 d-flex justify-content-center">
              <b-button type="reset" variant="danger" class="mr-3">
                Cancel
              </b-button>
              <b-button type="submit" variant="success"> Login </b-button>
            </b-col>
          </b-row>
        </form>
      </b-card>
    </b-container>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  data() {
    return {
      // use in email and password value
      email: "arm_1@mail.com",
      password: "55305530",
    };
  },
  methods: {
    // user login function
    ...mapActions(["login"]),
    async loginClick() {
      const userEmailPassword = {
        email: this.email,
        password: this.password,
      };
      await this.login(userEmailPassword);
    },
  },
};
</script>

<style></style>
