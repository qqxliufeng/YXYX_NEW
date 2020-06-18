/*
 * @Author: your name
 * @Date: 2020-06-13 15:10:10
 * @LastEditTime: 2020-06-13 15:15:43
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: /YXYX_NEW/src/mixins/school-mixins.js
 */
import { Loading } from 'element-ui'
export default {
  data() {
    return {
      schoolList: [],
      teacherList: [],
      youXingUserList: [],
      classList: [],
      roleList: []
    }
  },
  methods: {
    getSchoolList(callback) {
      const loadingInstance = Loading.service(document.getElementsByClassName('container')[0])
      if (this.schoolList.length === 0) {
        this.$http({
          url: this.$urlPath.querySchoolList,
          methods: this.HTTP_GET,
          data: {
            pageNum: 0,
            pageSize: 100
          }
        }).then(res => {
          this.$nextTick(_ => {
            loadingInstance.close()
          })
          this.schoolList = res.obj.list
          if (callback) {
            callback()
          }
        })
      } else {
        if (callback) {
          callback()
        }
      }
    },
    /**
     * 获取老师的列表信息
     */
    getTeacherList(callback) {
      const loadingInstance = Loading.service(document.getElementsByClassName('container')[0])
      if (this.schoolList.length === 0) {
        this.$http({
          url: this.$urlPath.queryTeacherList,
          methods: this.HTTP_GET,
          data: {
            pageNum: 0,
            pageSize: 1000
          }
        }).then(res => {
          this.$nextTick(_ => {
            loadingInstance.close()
          })
          this.teacherList = res.obj.list
          if (callback) {
            callback()
          }
        })
      } else {
        if (callback) {
          callback()
        }
      }
    },
    teacherChange(teacherId) {
      if (!this.teacherChangeCallBack) return
      const teacherName = this.teacherList.find(it => it.userId === teacherId).username
      this.teacherChangeCallBack(teacherName)
    },
    /**
     * 获取集团用户的列表信息
     */
    getYouXingList(callback) {
      const loadingInstance = Loading.service(document.getElementsByClassName('container')[0])
      if (this.schoolList.length === 0) {
        this.$http({
          url: this.$urlPath.queryYouXingUserList,
          methods: this.HTTP_GET,
          data: {
            pageNum: 0,
            pageSize: 1000
          }
        }).then(res => {
          this.$nextTick(_ => {
            loadingInstance.close()
          })
          this.youXingUserList = res.obj.list
          if (callback) {
            callback()
          }
        })
      } else {
        if (callback) {
          callback()
        }
      }
    },
    /**
     * 获取所有的角色
     */
    getRoleList() {
      const loadingInstance = Loading.service(document.getElementsByClassName('container')[0])
      this.$http({
        url: this.$urlPath.queryRoles,
        methods: this.HTTP_GET,
        data: {
          pageNum: 0,
          pageSize: 100
        }
      }).then(res => {
        this.$nextTick(_ => {
          loadingInstance.close()
        })
        this.roleList = res.obj.list
      }).catch(error => {
        console.log(error)
        this.$nextTick(_ => {
          loadingInstance.close()
        })
      })
    },
    getClassList(callback) {
      this.enginData(this.$urlPath.querySchoolClass, 'classList', 100, callback)
    },
    enginData(url, dataName, pageSize = 100, callback) {
      const loadingInstance = Loading.service(document.getElementsByClassName('container')[0])
      this.$http({
        url,
        methods: this.HTTP_GET,
        data: {
          pageNum: 0,
          pageSize
        }
      }).then(res => {
        this.$nextTick(_ => {
          loadingInstance.close()
        })
        this[dataName] = res.obj.list
        if (callback) {
          callback()
        }
      }).catch(error => {
        console.log(error)
        this.$nextTick(_ => {
          loadingInstance.close()
        })
      })
    }
  }
}
