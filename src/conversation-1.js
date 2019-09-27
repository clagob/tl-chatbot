// The Vue build version to load with the `import` command
import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import App1 from './App1'

Vue.use(VueAxios, axios)
if (process.env.NODE_ENV === 'production') {
  Vue.axios.defaults.baseURL = '//bot.think-life.uk'
}

/* eslint-disable no-new */
new Vue({
  // router,
  // store,
  el: '#thinklife-conversation-1',
  components: { App1 },
  template: '<App1/>'
})
