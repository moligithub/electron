import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import './assets/iconfont/iconfont.css';
import Bus from './tools/bus';
import axios from 'axios'
import db, { DbMap } from './datastore';
import { ipcRenderer } from 'electron';
let callbackCache = []
Vue.prototype.$ipcRenderer = {
  send: (msgType, msgData) => {
    console.log(msgType, msgData);
    ipcRenderer.send('message-from-renderer', {
      action: msgType,
      data: msgData
    })
  },
  on: (action, callback) => {
    console.log(action);
    callbackCache.push({
      action,
      callback
    })
  }
}
ipcRenderer.on('message-to-renderer', (sender, msg) => {
  console.log(sender, msg);
  callbackCache.forEach(cache => {
    if (cache.action === msg.action) {
      cache.callback && cache.callback(msg.res)
    }
  })
})
Vue.prototype.$db = db
Vue.prototype.$dbMap = new DbMap()
// axios.defaults.withCredentials = true
// axios.defaults.withCredentials=true;//让ajax携带cookie
Vue.prototype.$axios = axios
Vue.use(Antd);
Vue.use(Bus);
Vue.config.productionTip = false
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
