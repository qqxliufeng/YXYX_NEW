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

import './styles/element-variables.scss'

import './assets/custom-theme/main.css'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import './icons' // icon
import './permission' // permission control
import './utils/error-log' // error log

import Element from 'element-ui'
// fade/zoom 等
import 'element-ui/lib/theme-chalk/base.css'
// collapse 展开折叠
import CollapseTransition from 'element-ui/lib/transitions/collapse-transition'

import * as filters from './filters' // global filters

// common vue
import TableFoot from './components/Common/TableFoot.vue'
import TableHeader from './components/Common/TableHeader.vue'
import TableStatus from './components/Common/TableStatus.vue'

import './utils/init-vue.js'

Vue.component('TableFoot', TableFoot)
Vue.component('TableHeader', TableHeader)
Vue.component('TableStatus', TableStatus)
Vue.component(CollapseTransition.name, CollapseTransition)

Vue.use(Element, {
  size: Cookies.get('size') || 'medium' // set element-ui default size
})

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
// + 1
