// The Vue build version to load with the `import` command
import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import App1 from './App1'
import VueCurrencyFilter from 'vue-currency-filter'

Vue.use(VueAxios, axios)

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
  el: '#thinklife-conversation-1',
  components: { App1 },
  template: '<App1/>'
})
