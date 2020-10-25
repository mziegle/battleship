<template>
  <b-container>
    <b-navbar>
      <b-navbar-brand href="#">Battleship</b-navbar-brand>
      <b-navbar-nav>
        <b-nav-item href="#/register">Register</b-nav-item>
      </b-navbar-nav>
    </b-navbar>
    <b-row>
      <b-col>
        <b-card title="Login">
          <b-form @submit.stop.prevent="login">
            <b-form-group label="User">
              <b-form-input
                v-model="form.username"
                placeholder="User"
                :state="validateState('username')"
                aria-describedby="input-username-live-feedback"
              ></b-form-input>
              <b-form-invalid-feedback id="input-username-live-feedback">
                This is a required fied and must be at least 6 characters.
              </b-form-invalid-feedback>
            </b-form-group>
            <b-form-group label="Password">
              <b-form-input
                v-model="form.password"
                placeholder="Password"
                type="password"
                :state="validateState('password')"
                aria-describedby="input-password-live-feedback"
              ></b-form-input>
              <b-form-invalid-feedback id="input-password-live-feedback">
                This is a required fied.
              </b-form-invalid-feedback>
            </b-form-group>
            <b-button type="submit" class="m-2" variant="primary">Login</b-button>
          </b-form>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import RestResource from "../services/RestResource";
import { validationMixin } from "vuelidate";
import { required, minLength } from "vuelidate/lib/validators";

const api = new RestResource();

export default {
  name: "Login",

  mixins: [validationMixin],

  data: function () {
    return {
      form: {
        username: "",
        password: "",
      },
      showError: false,
      errorMessage: "",
    };
  },

  validations: {
    form: {
      username: {
        required,
        minLength: minLength(6)
      },
      password: {
        required,
      },
    },
  },

  methods: {
    validateState(name) {
      const { $dirty, $error } = this.$v.form[name];
      return $dirty ? !$error : null;
    },

    login: function () {
      this.$v.$touch();

      if (this.$v.form.$anyError) {
        return;
      }

      api
        .login(this.form.username, this.form.password)
        .then(() => {
          this.$router.push(`/${this.form.username}/fleet`);
        })
        .catch((error) => {
          this.errorMessage = error.response.data.message;
          this.showError = true;
          this.$bvToast.toast(this.errorMessage, {
            title: 'Error',
            variant: 'danger',
            solid: true
          })
        });

        this.$nextTick(() => {
          this.$v.$reset();
        });
    },
  },
};
</script>

<style>
</style>