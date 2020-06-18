import { Loading } from 'element-ui'
export default {
  data() {
    return {
      materialList: [],
      courseList: [],
      levelList: []
    }
  },
  methods: {
    getMaterialList(callback) {
      this.enginData({ url: this.$urlPath.queryTextBookList, dataName: 'materialList', callback })
    },
    getCourseList(textbookId, callback) {
      this.enginData({ url: this.$urlPath.queryCourseByTextBook, postData: { textbookId }, dataName: 'courseList', callback })
    },
    getLevelList(textbookId, courseCode, callback) {
      this.enginData({ url: this.$urlPath.queryCourseLevel, postData: { textbookId, courseCode }, dataName: 'levelList', callback })
    },
    enginData({ url, postData, dataName, pageSize = 100, callback }) {
      const loadingInstance = Loading.service(document.getElementsByClassName('container')[0])
      if (!postData) postData = {}
      postData.pageNum = 0
      postData.pageSize = pageSize
      this.$http({
        url,
        methods: this.HTTP_GET,
        data: postData
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
