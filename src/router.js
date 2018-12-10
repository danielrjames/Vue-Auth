import Vue from 'vue';
import Router from 'vue-router';
import store from './store';
import Home from './views/Home.vue';

Vue.use(Router);

const APP_NAME = ' | Vue-Auth';

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: {
        title: 'Vue-Auth | Vue Auth Solution'
      }
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('./views/About.vue'),
      meta: {
        title: 'About' + APP_NAME
      }
    },
    {
      path: '/contact',
      name: 'contact',
      component: () => import('./views/Contact.vue'),
      meta: {
        title: 'Contact' + APP_NAME
      }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('./views/Register.vue'),
      meta: {
        requiresAnon: true,
        title: 'Register' + APP_NAME
      }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('./views/Login.vue'),
      meta: {
        requiresAnon: true,
        title: 'Login' + APP_NAME
      }
    },
    {
      path: '/account',
      name: 'account',
      component: () => import('./views/Account.vue'),
      meta: {
        requiresAuth: true,
        title: 'Account' + APP_NAME
      }
    }
  ]
});

router.beforeEach((to, from, next) => {
  function proceed() {
    if (to.matched.some(record => record.meta.requiresAuth)) {
      if (!store.state.authState.authenticated) {
        next({
          path: '/login',
          query: { returnUrl: to.path }
        });
      } else {
        next();
      }
    } else if (to.matched.some(record => record.meta.requiresAnon)) {
      if (!store.state.authState.authenticated) {
        next();
      } else {
        next({ path: '/' });
      }
    } else {
      next();
    }
  }
  if (!store.state.authState.checked) {
    store.dispatch('checkTokens').then(response => {
      proceed();
    });
  } else {
    proceed();
  }
});

export default router;
