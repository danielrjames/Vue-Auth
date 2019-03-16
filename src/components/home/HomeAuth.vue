<template>
  <div class="row">
    <div class="col-md-12">
      <h2>You are authenticated.</h2>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      title: {
        type: String,
        default: 'Vue-Auth Home Page'
      }
    },
    data() {
      return {
        description: 'You are logged in'
      };
    },
    metaInfo() {
      return {
        title: this.title,
        titleTemplate: null,
        meta: [{ vmid: 'description', name: 'description', content: this.description }]
      };
    }
  };
</script>
