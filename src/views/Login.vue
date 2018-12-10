<template>
  <div class="row">
    <div class="col-md-6 col-md-offset-3">
      <div class="row">
        <div class="col-md-12">
          <h2>Login</h2>
        </div>
      </div>
      <div class="row" v-if="hasError">
        <div class="col-md-12">
          <span class="text-danger">Email and/or password was incorrect. Please try again.</span>
        </div>
      </div>
      <form @submit.prevent="handleSubmit">
        <div class="row">
          <div class="col-md-12">
            <app-email-input
              label="Email"
              placeholder="Email Address"
              :display-validations="false"
              :touch-validation="touchValidation"
              @output="login.email = $event"
              @valid="validStatus.email = $event"
            ></app-email-input>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12">
            <app-password-input
              label="Password"
              placeholder="Password"
              :display-validations="false"
              :suppress-errors="true"
              :touch-validation="touchValidation"
              @output="login.password = $event"
              @valid="validStatus.password = $event"
            ></app-password-input>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12">
            <div class="checkbox">
              <label>
                <input type="checkbox" v-model="login.rememberMe">Remember Me
              </label>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12">
            <button type="submit" class="btn btn-default">Login</button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
  import EmailInput from '../components/forms/EmailInput.vue';
  import PasswordInput from '../components/forms/PasswordInput.vue';
  import { mapGetters } from 'vuex';

  export default {
    data() {
      return {
        login: {
          email: '',
          password: '',
          rememberMe: false
        },
        validStatus: {
          email: false,
          password: false
        },
        touchValidation: false
      };
    },
    components: {
      appEmailInput: EmailInput,
      appPasswordInput: PasswordInput
    },
    computed: {
      ...mapGetters({
        preventSubmit: 'preventAuthSubmit',
        hasError: 'loginError'
      })
    },
    methods: {
      handleSubmit() {
        if (!this.preventSubmit) {
          let valid = true;
          // if all properties are not valid, do not submit
          for (let key in this.validStatus) {
            if (this.validStatus.hasOwnProperty(key) && this.validStatus[key] === false) {
              valid = false;
            }
          }
          if (valid) {
            let route = '/';
            if (this.$route.query.returnUrl) {
              route = this.$route.query.returnUrl;
            }
            const loginData = {
              email: this.login.email,
              password: this.login.password,
              rememberMe: this.login.rememberMe,
              routeRedirect: route
            };
            this.$store.dispatch('loginUser', loginData);
          } else {
            this.touchValidation = true;
          }
        }
      }
    }
  };
</script>

<style scoped>
  .checkbox {
    margin-top: -5px;
  }
</style>
