<template>
  <div id="app">
    <app-nav></app-nav>
    <div class="container">
      <router-view/>
    </div>
  </div>
</template>

<script>
  import Nav from './components/nav/Nav.vue';

  export default {
    // metaInfo: {
    //   // if no subcomponents specify a metaInfo.title, this title will be used
    //   title: 'Default Title',
    //   // all titles will be injected into this template
    //   titleTemplate: '%s | My Awesome Webapp'
    // },
    metaInfo() {
      return {
        // if no subcomponents specify a metaInfo.title, this title will be used
        title: 'Default Title',
        // all titles will be injected into this template
        titleTemplate: '%s | Vue-Auth'
      };
    },
    components: {
      appNav: Nav
    }
  };
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
  }

  .btn-default:focus {
    /* background-color: #fff !important; */
    /* border-color: #ccc !important; */
    outline: none !important;
    box-shadow: none;
  }

  .validation-messages {
    margin: 5px 0 0;
    font-size: 13px;
  }
</style>
