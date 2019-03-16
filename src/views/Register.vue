<template>
  <div class="row">
    <div class="col-md-6 col-md-offset-3">
      <div class="row">
        <div class="col-md-12">
          <h2>Register</h2>
        </div>
      </div>
      <div class="row" v-if="hasError">
        <div class="col-md-12">
          <span class="text-danger">There was an unexpected error. Please try again.</span>
        </div>
      </div>
      <form @submit.prevent="handleSubmit">
        <div class="row">
          <div class="col-md-6">
            <app-text-input
              label="First Name"
              placeholder="First Name"
              inputName="firstName"
              :display-validations="false"
              :touch-validation="touchValidation"
              @output="registration.firstName = $event"
              @valid="validStatus.firstName = $event"
            ></app-text-input>
          </div>
          <div class="col-md-6">
            <app-text-input
              label="Last Name"
              placeholder="Last Name"
              inputName="lastName"
              :display-validations="false"
              :touch-validation="touchValidation"
              @output="registration.lastName = $event"
              @valid="validStatus.lastName = $event"
            ></app-text-input>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12">
            <app-email-input
              label="Email"
              placeholder="Email Address"
              :display-validations="false"
              :touch-validation="touchValidation"
              @output="registration.email = $event"
              @valid="validStatus.email = $event"
            ></app-email-input>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12">
            <app-password-input
              label="Password"
              placeholder="Password"
              :touch-validation="touchValidation"
              @output="registration.password = $event"
              @valid="validStatus.password = $event"
            ></app-password-input>
            <!-- <app-password-input
              label="Confirm Password"
              placeholder="Confirm Password"
              :match-password="true"
              :password-to-match="registration.password"
              :touch-validation="touchValidation"
              @output="registration.confirmPassword = $event"
              @valid="validStatus.confirmPassword = $event"
            ></app-password-input>-->
          </div>
        </div>
        <div class="row">
          <div class="col-md-12">
            <button type="submit" class="btn btn-default">Register</button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
  import TextInput from '../components/forms/TextInput.vue';
  import EmailInput from '../components/forms/EmailInput.vue';
  import PasswordInput from '../components/forms/PasswordInput.vue';
  import { mapGetters } from 'vuex';

  export default {
    data() {
      return {
        registration: {
          firstName: '',
          lastName: '',
          email: '',
          password: ''
          // confirmPassword: ''
        },
        validStatus: {
          firstName: false,
          lastName: false,
          email: false,
          password: false
          // confirmPassword: false
        },
        touchValidation: false
      };
    },
    metaInfo() {
      return {
        title: 'Register',
        meta: [{ vmid: 'description', name: 'description', content: 'This is the Register page' }]
      };
    },
    components: {
      appTextInput: TextInput,
      appEmailInput: EmailInput,
      appPasswordInput: PasswordInput
    },
    computed: {
      ...mapGetters({
        preventSubmit: 'preventAuthSubmit',
        hasError: 'registerError'
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
            this.$store.dispatch('registerUser', this.registration);
          } else {
            this.touchValidation = true;
          }
        }
      }
    }
  };
</script>
