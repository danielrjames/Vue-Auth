<template>
  <div class="navbar-collapse collapse">
    <ul class="nav navbar-nav">
      <li>
        <router-link :to="{ name: 'home'}">Home</router-link>
      </li>
    </ul>
    <ul class="nav navbar-nav navbar-right">
      <li>
        <router-link :to="{ name: 'account'}">Account</router-link>
      </li>
      <li>
        <button class="logout" @click="onLogout">Logout</button>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    methods: {
      onLogout() {
        this.$store.dispatch('logoutUser', '/');
      }
    }
  };
</script>

<style scoped>
  .logout {
    background-color: transparent;
    border: none;
    font: inherit;
    cursor: pointer;
    color: #595959;
    padding: 15px;
    line-height: 20px;
  }

  .logout:active,
  .logout:focus {
    outline: none;
  }
</style>
