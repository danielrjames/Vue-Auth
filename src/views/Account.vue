<template>
  <div class="row">
    <div class="col-md-12">
      <h3>Welcome {{ firstName + ' ' + lastName }}</h3>
    </div>
  </div>
</template>

<script>
  import axios from 'axios';

  export default {
    data() {
      return {
        firstName: '',
        lastName: '',
        profileUrl: process.env.VUE_APP_API_ENDPOINT + '/profile',
        error: false
      };
    },
    metaInfo() {
      return {
        title: 'My Account',
        meta: [{ vmid: 'description', name: 'description', content: 'This is the account page' }]
      };
    },
    beforeMount() {
      this.fetchData();
    },
    methods: {
      fetchData() {
        const self = this;
        axios.get(self.profileUrl).then(response => {
          self.firstName = response.data.firstName;
          self.lastName = response.data.lastName;
        });
      }
    }
  };
</script>
