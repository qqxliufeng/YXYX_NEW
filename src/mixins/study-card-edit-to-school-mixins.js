export default {
  data() {
    return {
      studyCardTypeList: [
        {
          value: 'P',
          label: '小学正式卡'
        },
        {
          value: 'TP',
          label: '小学体验卡'
        },
        {
          value: 'M',
          label: '初中正式卡'
        },
        {
          value: 'TM',
          label: '初中体验卡'
        }
      ],
      textbookList: [],
      tempStudyCardItem: null,
      multipleSelection: []
    }
  },
  methods: {
    addStudyCard() {
      const item = {
        id: new Date().getTime(),
        cardType: '',
        cardNum: 0, //			  学习卡数量(批量增加方式)
        cardCode: '', //		  学习卡编码(查询学习卡编码方式,暂时不增加此字段)
        textbookIds: '', //		  教材主键ID，多个用逗号隔开
        textbookNames: '',
        tempTextbookIds: []
      }
      this.schoolModel.studyCardParams.push(item)
    },
    selectTextBookList(item) {
      this.tempStudyCardItem = item
      this.dialogTableVisible = true
      if (this.textbookList.length === 0) {
        this.tableLoading = true
        this.$http({
          url: this.$urlPath.queryTextBookList,
          methods: this.HTTP_GET,
          data: {
            pageNum: 0,
            pageSize: 1000
          }
        }).then(res => {
          this.tableLoading = false
          this.textbookList = res.obj.list
          if (this.textbookList && this.textbookList.length > 0) {
            this.textbookList.forEach(it => {
              this.$set(it, 'selected', false)
            })
          }
        })
      } else {
        this.textbookList.forEach(it => {
          it.selected = this.tempStudyCardItem.tempTextbookIds.includes(it.textbookId)
        })
      }
      const selectedItems = this.textbookList.filter(it => it.selected)
      if (selectedItems.length > 0) {
        this.$nextTick(_ => {
          selectedItems.forEach(row => {
            this.$refs.multiTable.toggleRowSelection(row, true)
          })
        })
      } else {
        this.$nextTick(_ => {
          this.$refs.multiTable.clearSelection()
        })
      }
    },
    deleteTextBookItem(item) {
      this.schoolModel.studyCardParams.splice(this.schoolModel.studyCardParams.indexOf(item), 1)
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleTextBookConfirm() {
      this.dialogTableVisible = false
      if (this.multipleSelection.length === 0) {
        this.tempStudyCardItem.textbookNames = ''
        this.tempStudyCardItem.tempTextbookIds = []
        return
      }
      const tempList = this.multipleSelection.map(it => {
        return { name: it.textbookName, id: it.textbookId }
      })
      this.tempStudyCardItem.textbookNames = tempList.map(it => it.name).join(',')
      this.tempStudyCardItem.tempTextbookIds = tempList.map(it => it.id)
    }
  }
}
