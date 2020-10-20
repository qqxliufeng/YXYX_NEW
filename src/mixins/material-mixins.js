import { Loading } from 'element-ui'
export default {
  data() {
    return {
      materialList: [],
      courseList: [],
      levelList: [],
      knowledgeList: [],
      knowledgeExamList: []
    }
  },
  methods: {
    getMaterialList(url = this.$urlPath.queryTextBookList, callback) {
      this.enginData({ url, dataName: 'materialList', callback })
    },
    getCourseList(textbookId, callback) {
      this.enginData({ url: this.$urlPath.queryCourseByTextBook, postData: { textbookId }, dataName: 'courseList', callback })
    },
    getLevelList(textbookId, courseCode, callback) {
      this.enginData({ url: this.$urlPath.queryCourseLevel, postData: { textbookId, courseCode }, dataName: 'levelList', callback })
    },
    getKnowledgeList(callback) {
      this.enginData({ url: this.$urlPath.queryKnowledgeList, postData: {}, dataName: 'knowledgeList', pageSize: 1000, callback })
    },
    getKnowledgeExamList(callback) {
      this.enginData({ url: this.$urlPath.queryKnowledgeExamList, postData: {}, dataName: 'knowledgeExamList', pageSize: 1000, callback })
    },
    enginData({ url, postData, dataName, pageSize = 100, callback }) {
      const loadingInstance = Loading.service({
        target: document.getElementsByClassName('container')[0]
      })
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
