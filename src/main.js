import Vue from 'vue';
import Vuelidate from 'vuelidate';
import axios from 'axios';

import App from './App.vue';
import router from './router';
import store from './store';

Vue.config.productionTip = false;

axios.interceptors.request.use(
  config => {
    const token = store.getters.accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

Vue.use(Vuelidate);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
