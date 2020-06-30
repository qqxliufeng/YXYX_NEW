import { login } from '@/api/user'
import { getToken, setToken, setUserId, setRoleId, setPhone, setuserNickName, removeToken, removeAll } from '@/utils/auth'
import router, { resetRouter } from '@/router'

const state = {
  token: getToken(),
  userNickName: '',
  name: '',
  phone: '',
  userId: Number(localStorage.getItem('userId')) || '',
  roleId: Number(localStorage.getItem('roleId')) || '',
  avatar: '',
  schoolId: Number(localStorage.getItem('schoolId')) || '',
  introduction: '',
  roles: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_USERID: (state, userId) => {
    state.userId = userId
  },
  SET_ROLEID: (state, roleId) => {
    state.roleId = roleId
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_userNickName: (state, userNickName) => {
    state.userNickName = userNickName
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_PHONE: (state, phone) => {
    state.phone = phone
  },
  SET_SCHOOL_ID: (state, schoolId) => {
    state.schoolId = schoolId
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { phone, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ phone: phone.trim(), password: password }).then(response => {
        const { obj } = response
        const data = obj
        const roles = data.roles
        commit('SET_TOKEN', data.token)
        commit('SET_PHONE', data.phone)
        commit('SET_USERID', data.userId)
        commit('SET_ROLEID', data.roleId)
        commit('SET_ROLES', roles)
        commit('SET_userNickName', data.userNickName)
        commit('SET_SCHOOL_ID', data.schoolId)
        setToken(data.token)
        setUserId(data.userId)
        setRoleId(data.roleId)
        setuserNickName(data.userNickName)
        setPhone(data.phone)
        localStorage.setItem('phone', data.phone)
        localStorage.setItem('username', data.username)
        localStorage.setItem('roleId', data.roleId)
        localStorage.setItem('userId', data.userId)
        localStorage.setItem('schoolId', data.schoolId)
        sessionStorage.setItem('userRoles', JSON.stringify(roles))
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      try {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        localStorage.removeItem('phone')
        localStorage.removeItem('username')
        localStorage.removeItem('roleId')
        localStorage.removeItem('userId')
        localStorage.removeItem('schoolId')
        sessionStorage.removeItem('userRoles')
        removeAll()
        resetRouter()
        dispatch('tagsView/delAllViews', null, { root: true })
        sessionStorage.removeItem('visitedViews')
        resolve()
      } catch (e) {
        reject(e)
      }
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  changeRoles({ commit, dispatch }, role) {
    return new Promise(async resolve => {
      const token = role + '-token'

      commit('SET_TOKEN', token)
      setToken(token)

      const { roles } = await dispatch('getInfo')

      resetRouter()

      // generate accessible routes map based on roles
      const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })

      // dynamically add accessible routes
      router.addRoutes(accessRoutes)

      // reset visited views and cached views
      dispatch('tagsView/delAllViews', null, { root: true })

      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
