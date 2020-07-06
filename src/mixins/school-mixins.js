/*
 * @Author: your name
 * @Date: 2020-06-13 15:10:10
 * @LastEditTime: 2020-06-13 15:15:43
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: /YXYX_NEW/src/mixins/school-mixins.js
 */
import { Loading } from 'element-ui'
import { isArray } from '@/utils/validate'
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
      this.enginData(this.$urlPath.querySchoolList, 'schoolList', 1000, callback)
    },
    /**
     * 获取老师的列表信息
     */
    getTeacherList(callback) {
      this.enginData(this.$urlPath.queryTeacherList, 'teacherList', 1000, callback)
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
      this.enginData(this.$urlPath.queryYouXingUserList, 'youXingUserList', 1000, callback)
    },
    /**
     * 获取所有的角色
     */
    getRoleList(callback) {
      this.enginData(this.$urlPath.queryRoles, 'roleList', 100, callback)
    },
    getClassList(callback) {
      this.enginData(this.$urlPath.querySchoolClass, 'classList', 100, callback)
    },
    getClassListBySchoolId(callback, schoolId) {
      this.enginData(this.$urlPath.querySchoolClassBySchool, 'classList', 100, callback, schoolId)
    },
    enginData(url, dataName, pageSize = 100, callback, schoolId = this.$store.getters.schoolId) {
      const loadingInstance = Loading.service({
        target: document.getElementsByClassName('container')[0]
      })
      this.$http({
        url,
        methods: this.HTTP_GET,
        data: {
          pageNum: 0,
          pageSize,
          schoolId
        }
      }).then(res => {
        this.$nextTick(_ => {
          loadingInstance.close()
        })
        if (isArray(res.obj)) {
          this[dataName] = res.obj
        } else {
          this[dataName] = res.obj.list
        }
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
