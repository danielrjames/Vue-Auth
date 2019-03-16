<template>
  <div class="home" style="text-align: center;">
    <img alt="Vue logo" src="./../../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
  // @ is an alias to /src
  import HelloWorld from '../HelloWorld.vue';

  export default {
    name: 'homePublic',
    props: {
      title: {
        type: String,
        default: 'Vue-Auth Home Page'
      }
    },
    data() {
      return {
        description: 'Welocme to the Public Page'
      };
    },
    metaInfo() {
      return {
        title: this.title,
        titleTemplate: '%s | One stop shop for Vue Authentication',
        meta: [{ vmid: 'description', name: 'description', content: this.description }]
      };
    },
    components: {
      HelloWorld
    },
    methods: {}
  };
</script>
