<template>
  <div class="form-group" :class="{'has-error': emailError}">
    <label for="email" class="control-label">{{ label }}</label>
    <input
      type="email"
      name="email"
      class="form-control"
      :placeholder="placeholder"
      v-model.trim="email"
      @input="validateEmail"
      @blur="checkValidation"
    >
    <div class="validation-messages" v-if="displayValidations && emailError">
      <span v-if="!$v.email.required" class="text-danger">This field is requried</span>
      <span v-if="!$v.email.email" class="text-danger">Please enter a valid email address</span>
      <span
        v-if="!$v.email.maxLength"
        class="text-danger"
      >{{ label }} exceeds limit of {{$v.email.$params.maxLength.max}} characters</span>
    </div>
  </div>
</template>

<script>
  import { required, email, maxLength } from 'vuelidate/lib/validators';

  export default {
    props: {
      label: {
        type: String,
        default: 'Email'
      },
      placeholder: {
        type: String,
        default: 'Email Address'
      },
      displayValidations: {
        type: Boolean,
        default: true
      },
      touchValidation: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        email: '',
        emailError: false
      };
    },
    validations: {
      email: {
        required: required,
        email: email,
        maxLength: maxLength(225)
      }
    },
    watch: {
      touchValidation(newValue, oldValue) {
        if (newValue === true) {
          this.checkValidation();
        }
      }
    },
    methods: {
      validateEmail() {
        this.$v.email.$touch();
        if (!this.$v.$invalid) {
          if (this.emailError) {
            this.emailError = false;
          }

          this.$emit('output', this.email);
          this.$emit('valid', true);
        } else {
          this.$emit('valid', false);
        }
      },
      checkValidation() {
        this.$v.email.$touch();

        if (this.$v.$invalid) {
          if (!this.emailError) {
            this.emailError = true;
          }
          this.$emit('valid', false);
        } else {
          // is valid, get rid of errors
          if (this.emailError) {
            this.emailError = false;
          }
        }
      }
    }
  };
</script>
