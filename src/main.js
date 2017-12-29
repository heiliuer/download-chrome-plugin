import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'

import router from './router'
import lodash from 'lodash'

// import axios from 'axios'
// Vue.prototype.axios = axios
// axios.defaults.baseURL = 'http://extension.browser.qq.com/'
// axios.defaults.headers.post['Content-Type'] = 'application/json'

Vue.prototype._ = lodash

Vue.use(VueRouter)


new Vue({
    el: '#app',
    router: new VueRouter(router),
    render: h => h(App)
})
