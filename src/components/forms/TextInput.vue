<template>
  <div class="form-group" :class="{'has-error': inputError}">
    <label :for="inputName" class="control-label">{{ label }}</label>
    <input
      type="text"
      :name="inputName"
      class="form-control"
      :placeholder="placeholder"
      v-model.trim="inputText"
      @input="validateText"
      @blur="checkValidation"
    >
    <div class="validation-messages" v-if="displayValidations && inputError">
      <span v-if="!$v.inputText.required" class="text-danger">This field is requried</span>
      <span
        v-if="!$v.inputText.maxLength"
        class="text-danger"
      >{{ label }} exceeds limit of {{$v.inputText.$params.maxLength.max}} characters</span>
    </div>
  </div>
</template>

<script>
  import { required, maxLength } from 'vuelidate/lib/validators';

  export default {
    props: {
      label: {
        type: String,
        default: 'Text'
      },
      placeholder: {
        type: String,
        default: 'Text'
      },
      inputName: {
        type: String,
        default: 'text'
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
        inputText: '',
        inputError: false
      };
    },
    validations: {
      inputText: {
        required: required,
        maxLength: maxLength(250)
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
      validateText() {
        this.$v.inputText.$touch();
        if (!this.$v.$invalid) {
          if (this.inputError) {
            this.inputError = false;
          }
          this.$emit('output', this.inputText);
          this.$emit('valid', true);
        } else {
          this.$emit('valid', false);
        }
      },
      checkValidation() {
        this.$v.inputText.$touch();

        if (this.$v.$invalid) {
          if (!this.inputError) {
            this.inputError = true;
          }
          this.$emit('valid', false);
        } else {
          // is valid, get rid of errors
          if (this.inputError) {
            this.inputError = false;
          }
        }
      }
    }
  };
</script>
