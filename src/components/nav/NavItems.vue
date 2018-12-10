<template>
  <div class="navbar-collapse collapse">
    <ul class="nav navbar-nav">
      <li>
        <router-link :to="{ name: 'home'}">Home</router-link>
      </li>
      <li>
        <router-link :to="{ name: 'about'}">About</router-link>
      </li>
      <li>
        <router-link :to="{ name: 'contact'}">Contact</router-link>
      </li>
    </ul>
    <ul class="nav navbar-nav navbar-right">
      <li>
        <router-link :to="{ name: 'register'}">Register</router-link>
      </li>
      <li>
        <router-link :to="{ name: 'login'}">Log in</router-link>
      </li>
    </ul>
  </div>
</template>
