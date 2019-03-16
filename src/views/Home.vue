<template>
  <div>
    <app-home-public title="Vue-Auth Home Page" v-if="!auth"></app-home-public>
    <app-home-auth title="Welcome Back!" v-if="auth"></app-home-auth>
  </div>
</template>

<script>
  import HomePublic from '../components/home/HomePublic.vue';
  import HomeAuth from '../components/home/HomeAuth.vue';
  import { mapGetters } from 'vuex';

  export default {
    name: 'home',
    data() {
      return {
        title: ''
      };
    },
    components: {
      appHomePublic: HomePublic,
      appHomeAuth: HomeAuth
    },
    computed: {
      ...mapGetters({
        auth: 'authStatus'
      })
    }
  };
</script>
