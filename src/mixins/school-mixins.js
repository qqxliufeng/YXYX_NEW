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
    }
  }
}
