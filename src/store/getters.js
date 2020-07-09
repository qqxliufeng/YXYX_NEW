const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name || localStorage.getItem('username'),
  phone: state => state.user.phone,
  roleId: state => state.user.roleId || localStorage.getItem('roleId'),
  userId: state => state.user.userId,
  schoolId: state => state.user.schoolId,
  schoolStatus: state => state.user.schoolStatus,
  roles: state => state.permission.roles,
  userRoles: state => state.user.roles,
  introduction: state => state.user.introduction,
  permission_routes: state => state.permission.routes,
  errorLogs: state => state.errorLog.logs
}
export default getters
