<template>
  <nav class="navbar navbar navbar-top">
    <div class="container">
      <div class="navbar-header">
        <button
          type="button"
          class="navbar-toggle"
          data-toggle="collapse"
          data-target=".navbar-collapse"
        >
          <span class="sr-only">Toggle navigation</span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </button>
        <router-link :to="{ name: 'home'}" class="navbar-brand">Vue-Auth</router-link>
      </div>
      <app-nav-items v-if="!auth"></app-nav-items>
      <app-nav-items-auth v-if="auth"></app-nav-items-auth>
    </div>
  </nav>
</template>

<script>
  import NavItems from './NavItems.vue';
  import NavItemsAuth from './NavItemsAuth.vue';
  import { mapGetters } from 'vuex';

  export default {
    components: {
      appNavItems: NavItems,
      appNavItemsAuth: NavItemsAuth
    },
    computed: {
      ...mapGetters({
        auth: 'authStatus'
      })
    }
  };
</script>

<style>
  .navbar {
    border-radius: 0 !important;
    border-bottom: 1px solid #eee;
    padding: 5px 0;
    font-size: 13px;
    background-color: #fff;
  }

  .navbar-brand {
    color: #2c3e50 !important;
  }

  .navbar a {
    color: #595959;
    /* font-weight: 700; */
    border: none;
  }

  .nav > li > a:focus,
  .nav > li > a:hover {
    background: none !important;
  }
</style>
