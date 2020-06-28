import Vue from 'vue'
import router from './router'
import store from './store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/auth-redirect'] // no redirect whitelist

function includesPath(accessRoutes) {
  return accessRoutes.reduce((acc, cur) => {
    if (cur.children) {
      cur.children.reduce((a, c) => {
        a.push(c.path)
        return acc
      }, acc)
    } else {
      acc.push(cur.path)
    }
    return acc
  }, [])
}

// eslint-disable-next-line space-before-function-paren
router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      next()
      NProgress.done()
    } else {
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      if (hasRoles) {
        next()
      } else {
        const accessRoutes = await store.dispatch('permission/generateRoutes')
        Vue.prototype.$roles = sessionStorage.getItem('userRoles') ? JSON.parse(sessionStorage.getItem('userRoles'))[0] : ''
        router.addRoutes(accessRoutes)
        const paths = includesPath(accessRoutes)
        if (accessRoutes && accessRoutes.length > 1) {
          // 判断要去的页面是否包含在动态路由中，如果包含，则直接跳转过去
          if (paths.includes(to.path)) {
            next({ ...to, replace: true })// hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
          } else { // 如果没有包含则取动态中路由的第一条（非404页面） 当做当前路由跳转
            next({ path: accessRoutes[1].children[0].path, replace: true })
          }
        } else {
          next({ path: '/404' })
        }
      }
      next()
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
