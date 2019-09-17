// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
// import Vuelidate from 'vuelidate'
import App from './App'
// import router from '@/router'
// import store from '@/store'
import VueCurrencyFilter from 'vue-currency-filter'

Vue.use(VueAxios, axios)

// Vue.use(Vuelidate)
// Vue.config.productionTip = false

Vue.use(VueCurrencyFilter, {
  symbol: '£',
  thousandsSeparator: '.',
  fractionCount: 2,
  fractionSeparator: ',',
  symbolPosition: 'front',
  symbolSpacing: true
})

/* eslint-disable no-new */
new Vue({
  // router,
  // store,
  el: '#thinklife-conversation-0',
  components: { App },
  template: '<App/>'
})
