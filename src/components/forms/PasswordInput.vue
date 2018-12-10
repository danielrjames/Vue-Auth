<template>
  <div>
    <div class="form-group" :class="{'has-error': passwordError}">
      <label
        :for="!matchPassword ? 'password' : 'confirmpassword'"
        class="control-label"
      >{{ label }}</label>
      <input
        type="password"
        :name="!matchPassword ? 'password' : 'confirmpassword'"
        class="form-control"
        :placeholder="placeholder"
        ref="password"
        v-model.trim="password"
        @input="validatePass"
        @blur="checkValidation"
      >
      <div class="validation-messages" v-if="displayValidations && !suppressErrors">
        <div v-if="!matchPassword">
          <div
            class="text-success"
            v-if="passwordCriteria.met && !$v.password.$error"
          >Your password is secure</div>
          <div
            class="text-danger"
            v-if="!$v.password.maxLength"
          >{{ label }} exceeds limit of {{$v.password.$params.maxLength.max}} characters</div>
          <div v-if="passwordCriteria.met == false">
            <div class="row">
              <div class="col-md-12">
                <div class="row">
                  <div class="col-md-6" :class="{'criteria-met' : passwordCriteria.lowercase}">
                    <span>One lowercase letter</span>
                  </div>
                  <div class="col-md-6" :class="{'criteria-met' : passwordCriteria.special}">
                    <span>One special character</span>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-6" :class="{'criteria-met' : passwordCriteria.uppercase}">
                    <span>One uppercase letter</span>
                  </div>
                  <div class="col-md-6" :class="{'criteria-met' : passwordCriteria.min}">
                    <span>8 characters minimum</span>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-6" :class="{'criteria-met' : passwordCriteria.number}">
                    <span>One number</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else>
          <div class="text-danger" v-if="passwordMatchError">
            <span>Passwords do not match</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { required, maxLength } from 'vuelidate/lib/validators';

  export default {
    props: {
      label: {
        type: String,
        default: 'Password'
      },
      placeholder: {
        type: String,
        default: 'Password'
      },
      displayValidations: {
        type: Boolean,
        default: true
      },
      matchPassword: {
        type: Boolean,
        default: false
      },
      passwordToMatch: {
        type: String,
        default: ''
      },
      suppressErrors: {
        type: Boolean,
        default: false
      },
      touchValidation: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        password: '',
        passwordCriteria: {
          lowercase: false,
          uppercase: false,
          number: false,
          special: false,
          min: false,
          max: false,
          met: false
        },
        passwordError: false,
        passwordMatchError: false
      };
    },
    validations: {
      password: {
        required: required,
        maxLength: maxLength(128)
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
      validatePass: function() {
        if (!this.matchPassword) {
          if (this.password !== '') {
            if (this.password.length < 8) {
              this.passwordCriteria.min = false;
            } else {
              this.passwordCriteria.min = true;
            }

            if (this.password.length > 128) {
              this.passwordCriteria.max = false;
            } else {
              this.passwordCriteria.max = true;
            }

            if (this.password.search(/\d/) === -1) {
              this.passwordCriteria.number = false;
            } else {
              this.passwordCriteria.number = true;
            }

            if (this.password.search(/[a-z]/) === -1) {
              this.passwordCriteria.lowercase = false;
            } else {
              this.passwordCriteria.lowercase = true;
            }

            if (this.password.search(/[A-Z]/) === -1) {
              this.passwordCriteria.uppercase = false;
            } else {
              this.passwordCriteria.uppercase = true;
            }

            if (this.password.search(/\W+/) === -1) {
              this.passwordCriteria.special = false;
            } else {
              this.passwordCriteria.special = true;
            }

            if (
              (this.passwordCriteria.min === true &&
                this.passwordCriteria.max === true &&
                this.passwordCriteria.number === true &&
                this.passwordCriteria.lowercase === true &&
                this.passwordCriteria.uppercase === true &&
                this.passwordCriteria.special === true) ||
              this.suppressErrors
            ) {
              this.passwordCriteria.met = true;
              this.passwordError = false;
              this.$emit('output', this.password);
              this.$emit('valid', true);
            } else {
              this.passwordCriteria.met = false;
              this.$emit('valid', false);
            }
          } else {
            for (const key in this.passwordCriteria) {
              if (this.passwordCriteria.hasOwnProperty(key)) {
                if (this.passwordCriteria[key] !== false) {
                  this.passwordCriteria[key] = false;
                }
              }
            }
          }
        } else {
          // is password match
          if (this.password !== '') {
            // suppress error here when user starts typign again
            this.passwordError = false;
            this.passwordMatchError = false;
            if (this.passwordToMatch === this.password) {
              this.$emit('output', this.password);
              this.$emit('valid', true);
            } else {
              this.$emit('valid', false);
            }
          }
        }
      },
      checkValidation() {
        this.$v.password.$touch();

        if (this.password !== '') {
          if (
            (!this.suppressErrors && !this.matchPassword && !this.$v.$invalid && this.passwordCriteria.met) ||
            (!this.suppressErrors && this.matchPassword && this.passwordToMatch === this.password) ||
            (this.suppressErrors && !this.$v.$invalid)
          ) {
            // everything is valid, get rid of errors
            if (this.passwordError === true) {
              this.passwordError = false;
              if (this.passwordMatchError === true) {
                this.passwordMatchError = false;
              }
            }
          } else {
            if (this.passwordError === false) {
              this.passwordError = true;
            }
            if (this.matchPassword) {
              this.passwordMatchError = true;
            }
            this.$emit('valid', false);
          }
        } else {
          this.passwordError = true;
          this.$emit('valid', false);
        }
      }
    }
  };
</script>

<style scoped>
  .criteria-met {
    opacity: 0.5;
    text-decoration: line-through;
  }
</style>
