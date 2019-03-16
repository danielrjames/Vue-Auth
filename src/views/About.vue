<template>
  <div class="about">
    <h1>This is an about page</h1>
  </div>
</template>

<script>
  export default {
    metaInfo() {
      return {
        title: 'About',
        meta: [{ vmid: 'description', name: 'description', content: 'This is the about page' }]
      };
    }
  };
</script>
