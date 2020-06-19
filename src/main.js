/* eslint-disable space-before-function-paren */
/*
 * @Descripttion: 描述
 * @version: 版本
 * @Author: lf
 * @Date: 2020-05-20 11:46:00
 * @LastEditors: lf
 * @LastEditTime: 2020-06-08 15:25:33
 */
import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element, { Loading } from 'element-ui'
import './styles/element-variables.scss'

import './assets/custom-theme/main.css'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import './icons' // icon
import './permission' // permission control
import './utils/error-log' // error log

import * as filters from './filters' // global filters

// http
import { http, HTTP_GET, HTTP_POST } from './api/common.js'

import * as urlPath from './api/url-path'

// common vue
import TableFoot from './components/Common/TableFoot.vue'
import TableHeader from './components/Common/TableHeader.vue'
import { level } from 'province-city-china/data'
import { style, menuButtonModel } from './utils/app-config'
import language from './components/ImageCropper/utils/language'

Vue.component('TableFoot', TableFoot)
Vue.component('TableHeader', TableHeader)

Vue.use(Element, {
  size: Cookies.get('size') || 'medium' // set element-ui default size
})

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.prototype.$http = http
Vue.prototype.$privinceData = level
Vue.prototype.HTTP_GET = HTTP_GET
Vue.prototype.HTTP_POST = HTTP_POST
Vue.prototype.$urlPath = urlPath
Vue.prototype.$roles = localStorage.getItem('roles') ? JSON.parse(localStorage.getItem('roles'))[0] : ''
Vue.prototype.$style = style
Vue.prototype.$menuButtonModel = menuButtonModel

Vue.config.productionTip = false

Vue.prototype.$successMsg = function (message = '') {
  this.$message({
    message: message,
    type: 'success'
  })
}

Vue.prototype.$errorMsg = function (message = '') {
  this.$message.error(message)
}

Vue.prototype.$closeView = function (path) {
  if (!path) {
    return
  }
  this.$store.dispatch('tagsView/delView', { path }).then(_ => {
    this.$router.go(-1)
  })
}

Vue.prototype.$closeCurrentView = function () {
  this.$closeView(this.$route.path)
}

Vue.prototype.$showLoading = function (callback) {
  const loadingInstance = Loading.service({
    target: document.getElementById('content-wrapper')
  })
  if (callback) {
    callback(loadingInstance)
  } else {
    loadingInstance.close()
  }
}

Vue.prototype.$warningConfirm = function (message = '', handlerFunction = null) {
  this.$confirm(message, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    if (handlerFunction) {
      handlerFunction()
    }
  })
}

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
