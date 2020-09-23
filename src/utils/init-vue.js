/* eslint-disable space-before-function-paren */
import Vue from 'vue'

import { Loading } from 'element-ui'

// http
import { http, HTTP_GET, HTTP_POST } from '../api/common'

import * as urlPath from '../api/url-path'

import { level } from 'province-city-china/data'
import { style, menuButtonModel } from './app-config'

Vue.prototype.$http = http
Vue.prototype.$privinceData = level
Vue.prototype.HTTP_GET = HTTP_GET
Vue.prototype.HTTP_POST = HTTP_POST
Vue.prototype.$urlPath = urlPath
Vue.prototype.$roles = sessionStorage.getItem('userRoles') ? JSON.parse(sessionStorage.getItem('userRoles'))[0] : ''
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
    target: document.getElementsByClassName('container')[0]
  })
  if (callback) {
    callback(_ => {
      this.$nextTick(_ => {
        loadingInstance.close()
      })
    })
  } else {
    this.$nextTick(_ => {
      loadingInstance.close()
    })
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
  }).catch(_ => {
    console.log('取消')
  })
}

Vue.prototype.$isPhone = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
