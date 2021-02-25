import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify';
import './assets/formulate.css'
import VueFormulate from '@braid/vue-formulate'
import 'sweetalert2/dist/sweetalert2.min.css';

Vue.use(VueFormulate)
Vue.config.productionTip = false

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
