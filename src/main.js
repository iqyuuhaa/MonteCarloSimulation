window.Popper = require('popper.js').default;
window.$ = window.jQuery = require('jquery');
window.Vue = require('vue');

require('bootstrap');

import Vue from 'vue';
import Vuetify from 'vuetify';

import 'vuetify/dist/vuetify.min.css';
import '@mdi/font/css/materialdesignicons.css';

Vue.use(Vuetify);

import App from './App.vue';

new Vue({
  render: h => h(App),
  vuetify: new Vuetify(),
}).$mount('#app');
