// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import AV from 'leancloud-storage'
import 'normalize.css'
import './assets/reset.css'
import './assets/main.css'
import './assets/iconfont.js'
import { APP_ID, APP_KEY } from '../AppConfig.json'

Vue.config.productionTip = false

/* eslint-disable no-new */

AV.init({
  appId: APP_ID,
  appKey: APP_KEY
})

// var vm = new Vue()

new Vue({
  router,
  render: (createElement) => createElement(App)
}).$mount('#app')
