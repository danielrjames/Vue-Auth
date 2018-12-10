<template>
  <div>
    <app-home-public v-if="!auth"></app-home-public>
    <app-home-auth v-if="auth"></app-home-auth>
  </div>
</template>

<script>
  import HomePublic from '../components/home/HomePublic.vue';
  import HomeAuth from '../components/home/HomeAuth.vue';
  import { mapGetters } from 'vuex';

  export default {
    name: 'home',
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
