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
      schoolList: []
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
    }
  }
}
