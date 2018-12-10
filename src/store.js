import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import router from './router';

import * as jwtDecode from 'jwt-decode';
import * as UAParser from 'ua-parser-js';

var uaParser = new UAParser();

Vue.use(Vuex);

const ACCESS_TOKEN_NAME = 'atk';
const REFRESH_TOKEN_NAME = 'r';

export default new Vuex.Store({
  state: {
    authState: {
      checked: false,
      authenticated: false,
      accessToken: null,
      emailConfirmed: false,
      loginError: false,
      registerError: false,
      preventSubmit: false
    }
  },
  getters: {
    authChecked: state => {
      return state.authState.checked;
    },
    authStatus: state => {
      return state.authState.authenticated;
    },
    preventAuthSubmit: state => {
      return state.authState.preventSubmit;
    },
    loginError: state => {
      return state.authState.loginError;
    },
    registerError: state => {
      return state.authState.registerError;
    },
    accessToken: state => {
      return state.authState.accessToken;
    }
  },
  mutations: {
    updateCheckStatus(state) {
      state.authState.checked = true;
    },
    authenticateUser(state, payload) {
      state.authState.accessToken = payload.accessToken;
      state.authState.emailConfirmed = payload.emailConfirmed;
      state.authState.authenticated = true;
      state.authState.checked = true;
    },
    updateLoginError(state, payload) {
      state.authState.loginError = payload;
    },
    updateRegisterError(state, payload) {
      state.authState.registerError = payload;
    },
    updateAuthSubmit(state, payload) {
      state.authState.preventSubmit = payload;
    },
    setAuthFalse(state) {
      state.authState.authenticated = false;
      state.authState.accessToken = null;
      state.authState.preventSubmit = false;
    },
    resetAuthState(state) {
      state.authState.authenticated = false;
      state.authState.accessToken = null;
      state.authState.loginError = false;
      state.authState.registerError = false;
      state.authState.preventSubmit = false;
    }
  },
  actions: {
    registerUser({ commit, dispatch }, componentData) {
      commit('updateAuthSubmit', true);
      const here = 'register';
      const uAgent = uaParser.getResult();
      const data = {
        firstName: componentData.firstName,
        lastName: componentData.lastName,
        email: componentData.email,
        password: componentData.password,
        browser: uAgent.browser.name,
        os: uAgent.os.name + ' ' + uAgent.os.version,
        clientId: 1,
        grantType: 'password',
        scope: 'offline_access'
      };
      axios
        .post(process.env.VUE_APP_API_ENDPOINT + '/account/register', data)
        .then(response => {
          const data = {
            access_token: response.data.access_token,
            refresh_token: response.data.refresh_token,
            routeRedirect: '/',
            origin: here
          };
          dispatch('handleResponse', data);
        })
        .catch(err => {
          dispatch('handleError', { error: err, origin: here });
        });
    },
    loginUser({ commit, dispatch, state, watch }, componentData) {
      commit('updateAuthSubmit', true);
      const here = 'login';
      const uAgent = uaParser.getResult();
      const data = {
        email: componentData.email,
        password: componentData.password,
        rememberMe: componentData.rememberMe,
        browser: uAgent.browser.name,
        os: uAgent.os.name + ' ' + uAgent.os.version,
        clientId: 1,
        grantType: 'password',
        scope: 'offline_access'
      };
      axios
        .post(process.env.VUE_APP_API_ENDPOINT + '/account/login', data)
        .then(response => {
          const responseData = {
            access_token: response.data.access_token,
            refresh_token: response.data.refresh_token,
            routeRedirect: componentData.routeRedirect,
            origin: here
          };
          dispatch('handleResponse', responseData);
        })
        .catch(err => {
          dispatch('handleError', { error: err, origin: here });
        });
    },
    handleResponse({ commit, state, dispatch }, data) {
      if (data.access_token && data.refresh_token) {
        if (data.origin === 'login') {
          if (state.authState.loginError) {
            commit('updateLoginError', false);
          }
        } else if (data.origin === 'register') {
          if (state.authState.registerError) {
            commit('updateRegisterError', false);
          }
        } else if (data.origin === 'renew') {
          // add logic here if needed
        }
        if (state.authState.preventSubmit) {
          commit('updateAuthSubmit', false);
        }
        dispatch('validateTokens', data);
      } else {
        dispatch('handleError', { error: true, origin: data.origin });
      }
    },
    handleError({ commit, state, dispatch }, data) {
      if (data.error) {
        if (data.origin === 'login') {
          if (!state.authState.loginError) {
            commit('updateLoginError', true);
          }
        } else if (data.origin === 'register') {
          if (!state.authState.registerError) {
            commit('updateRegisterError', true);
          }
        } else if (data.origin === 'renew') {
          router.replace({ path: '/login' });
        }
        if (!state.authState.checked) {
          commit('updateCheckStatus');
        }
        if (state.authState.preventSubmit) {
          commit('updateAuthSubmit', false);
        }
        if (state.authState.authenticated) {
          commit('setAuthFalse');
        }
        dispatch('removeTokens');
      }
    },
    checkTokens({ commit, dispatch }) {
      const accessToken = localStorage.getItem(ACCESS_TOKEN_NAME);
      const refreshToken = localStorage.getItem(REFRESH_TOKEN_NAME);
      if (accessToken && refreshToken) {
        const data = {
          access_token: accessToken,
          refresh_token: refreshToken
        };
        dispatch('validateTokens', data);
      } else {
        commit('updateCheckStatus');
        dispatch('removeTokens');
      }
    },
    validateTokens({ commit, dispatch }, data) {
      const decodedToken = jwtDecode(data.access_token);
      const currentTime = Math.round(+new Date() / 1000);
      // cutting refresh token life by 15 seconds to ensure enough time to renew
      const refreshLife = decodedToken.rExp - currentTime - 15;
      if (refreshLife > 0) {
        const accessLife = decodedToken.exp - currentTime;
        if (accessLife > 0) {
          localStorage.setItem(ACCESS_TOKEN_NAME, data.access_token);
          localStorage.setItem(REFRESH_TOKEN_NAME, data.refresh_token);
          commit('authenticateUser', {
            accessToken: data.access_token,
            emailConfirmed: !!decodedToken.email_confirmed
          });
          dispatch('renewTokenTimer', accessLife);
          if (data.routeRedirect) {
            router.replace({ path: data.routeRedirect });
          }
        } else {
          dispatch('renewTokens');
        }
      } else {
        dispatch('logoutUser', '/');
      }
    },
    renewTokenTimer({ dispatch }, expirationTime) {
      setTimeout(() => {
        dispatch('renewTokens');
      }, expirationTime * 1000);
    },
    renewTokens({ dispatch }) {
      const here = 'renew';
      const rToken = localStorage.getItem(REFRESH_TOKEN_NAME);
      if (rToken) {
        const uAgent = uaParser.getResult();
        const data = {
          refreshToken: rToken,
          browser: uAgent.browser.name,
          os: uAgent.os.name + ' ' + uAgent.os.version,
          clientId: 1,
          grantType: 'refresh_token',
          scope: 'offline_access'
        };
        axios
          .post(process.env.VUE_APP_API_ENDPOINT + '/account/renew', data)
          .then(response => {
            const responseData = {
              access_token: response.data.access_token,
              refresh_token: response.data.refresh_token,
              origin: here
            };
            dispatch('handleResponse', responseData);
          })
          .catch(err => {
            dispatch('handleError', { error: err, origin: here });
          });
      } else {
        dispatch('handleError', { error: true, origin: here });
      }
    },
    logoutUser({ commit, state, dispatch }, route) {
      if (!state.authState.checked) {
        commit('updateCheckStatus');
      }
      if (route !== '') {
        router.replace({ path: route });
      }
      commit('resetAuthState');
      dispatch('removeTokens');
    },
    removeTokens() {
      localStorage.removeItem(ACCESS_TOKEN_NAME);
      const rToken = localStorage.getItem(REFRESH_TOKEN_NAME);
      if (rToken) {
        axios.post(process.env.VUE_APP_API_ENDPOINT + '/account/revoke', { refreshToken: rToken });
        localStorage.removeItem(REFRESH_TOKEN_NAME);
      }
    }
  }
});
