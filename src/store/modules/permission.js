import { asyncRoutes, constantRoutes } from '@/router'
import { getMenus } from '@/api/user'

import Layout from '@/layout'
import { menuButtonModel } from '@/utils/app-config'

const hiddenMenuList = [
  '/system/menuButton',
  '/material/distribution',
  '/message/groupmessage',
  '/message/schoolmessage',
  '/integral'
]

const affixMenuList = [
  // '/system/group'
]

const pathMapName = new Map()
pathMapName.set('group', 'Group')
pathMapName.set('department', 'Department')
pathMapName.set('roles', 'Roles')
pathMapName.set('menu', 'Menu')
pathMapName.set('menuButton', 'MenuButton')
pathMapName.set('learningcard', 'StudyCard')
pathMapName.set('feedback', 'FeedBack')
pathMapName.set('logmanagement', 'Logmanagement')
pathMapName.set('appversion', 'AppVersion')
pathMapName.set('crontabmanager', 'CrontabManager')
pathMapName.set('groupmessage', 'GroupMessage')
pathMapName.set('schoolmessage', 'SchoolMessage')
pathMapName.set('systemmessage', 'SystemMessage')
pathMapName.set('vipshcool', 'VIPShcool')
pathMapName.set('vipteacher', 'VIPTeacher')
pathMapName.set('vipclass', 'VIPClass')
pathMapName.set('vipstudent', 'VIPStudent')
pathMapName.set('expressuser', 'ExpressUser')
pathMapName.set('material', 'Material')
pathMapName.set('knowledge', 'Knowledge')
pathMapName.set('exampoint', 'ExamPoint')
pathMapName.set('grammarpractise', 'GrammarPractise')
pathMapName.set('grammarlevel', 'GrammarLevel')
pathMapName.set('prize', 'Prize')
pathMapName.set('lucklist', 'LuckList')
pathMapName.set('online', 'OnlinePK')
pathMapName.set('testpaper', 'TestPager')

const pathToFileName = new Map()
pathToFileName.set('/system/crontabmanager', '/system/CrontabManager')
pathToFileName.set('/message/groupmessage', '/message/GroupMessage')
pathToFileName.set('/message/schoolmessage', '/message/SchoolMessage')
pathToFileName.set('/message/systemmessage', '/message/SystemMessage')
pathToFileName.set('/membership/expressuser', '/membership/ExpressUser')
pathToFileName.set('/material/knowledge', '/material/Knowledge')
pathToFileName.set('/material/exampoint', '/material/ExamPoint')
pathToFileName.set('/material/grammarpractise', '/material/GrammarPractise')
pathToFileName.set('/material/grammarlevel', '/material/GrammarLevel')
pathToFileName.set('/arena/online', '/arena/OnlinePK')
pathToFileName.set('/arena/testpaper', '/arena/TestPaper')

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []
  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })
  return res
}

/**
 * 后台查询的菜单数据拼装成路由格式的数据
 * @param routes
 */
function getViews(path) {
  return resolve => {
    require.ensure([], (require) => {
      resolve(require('@/views' + (pathToFileName.has(path) ? pathToFileName.get(path) : path)))
    })
  }
}

function getCharCount(str, char) {
  var regex = new RegExp(char, 'g') // 使用g表示整个字符串都要匹配
  var result = str.match(regex) // match方法可在字符串内检索指定的值，或找到一个或多个正则表达式的匹配。
  var count = !result ? 0 : result.length
  return count
}

function getIcon(url) {
  if (url) {
    const splits = url.split('/')
    if (splits.length === 2) {
      return 'menu'
    }
    if (splits.length === 3) {
      return splits[2]
    }
  }
  return 'menu'
}

export function generaMenu(routes, data) {
  data.forEach(item => {
    const isMenu = getCharCount(item.menuUrl, '/') === 1
    let pathName = ''
    if (isMenu) {
      pathName = item.menuUrl
    } else {
      const tempPath = item.menuUrl.split('/')[2]
      if (pathMapName.has(tempPath)) {
        pathName = pathMapName.get(tempPath)
      } else {
        pathName = tempPath
      }
    }
    const menu = {
      path: item.menuUrl === '#' ? item.menuUrl + '_key' : item.menuUrl,
      component: isMenu ? Layout : getViews(item.menuUrl),
      children: [],
      hidden: hiddenMenuList.includes(item.menuUrl),
      name: pathName,
      meta: { title: item.menuName, noCache: false, id: item.menuId, roles: ['admin'], icon: isMenu ? 'list' : getIcon(item.menuUrl), affix: affixMenuList.includes(item.menuUrl) }
    }
    menuButtonModel[menu.name] = item.menuButtons
    if (isMenu) {
      menu.redirect = 'noRedirect'
    }
    if (item.children) {
      generaMenu(menu.children, item.children)
    }
    routes.push(menu)
  })
}

const state = {
  routes: [],
  roles: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  generateRoutes({ commit }, roles) {
    const loadMenuData = []
    return new Promise((resolve, reject) => {
      const roleId = localStorage.getItem('roleId')
      const userId = localStorage.getItem('userId')
      getMenus(userId, roleId).then(response => {
        const { obj } = response
        const data = obj
        Object.assign(loadMenuData, data)
        generaMenu(asyncRoutes, loadMenuData)
        const roles = ['admin']
        const accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
        commit('SET_ROUTES', accessedRoutes)
        commit('SET_ROLES', roles)
        resolve(accessedRoutes)
      }).catch(error => {
        reject(error)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
