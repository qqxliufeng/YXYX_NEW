export default {
  data() {
    return {
      cardTypes: [
        {
          label: '小学正式卡',
          value: 'P'
        },
        {
          label: '初中正式卡',
          value: 'M'
        }
      ],
      grantTextBookLoading: false,
      dialogGrantTextBookVisible: false,
      grantTextBookTableData: [],
      dialogEditVisible: false,
      tempItem: {
        studyCardId: 0,
        status: 0,
        endTime: ''
      },
      studyCardStatus: [
        {
          label: '未分配教材',
          value: 0
        },
        {
          label: '已分配教材',
          value: 1
        },
        {
          label: '未激活',
          value: 2
        },
        {
          label: '已激活',
          value: 3
        },
        {
          label: '已到期',
          value: 4
        }
      ]
    }
  },
  methods: {
    cardTypeFormatter(item) {
      // P小学正式卡  TP小学体验卡 M初中正式卡 TM初中体验卡
      switch (item.cardType) {
        case 'P':
          return '小学正式卡'
        case 'TP':
          return '小学体验卡'
        case 'M':
          return '初中正式卡'
        case 'TM':
          return '初中体验卡'
      }
    },
    bindFormatter(item) {
      return {
        label: item.isBind === 0 ? '未绑定' : '已绑定',
        type: item.isBind === 0 ? 'danger' : 'primary'
      }
    },
    statusFormatter(item) {
      // 0未分配教材 1已分配教材 2未激活 3已激活 4已到期
      switch (item.status) {
        case 2:
          return { label: '未激活', type: 'warning' }
        case 3:
          return { label: '已激活', type: 'success' }
        case 4:
          return { label: '已到期', type: 'danger' }
      }
    },
    endTimeFormatter(item) {
      return item.endTime ? item.endTime : '暂无'
    },
    /**
     * 延长学习卡的到期时间
     */
    addEndTime(item) {
      if (!this.checkButtonPermission('delay_time')) {
        return
      }
      this.dialogEditVisible = true
      this.tempItem.studyCardId = item.studyCardId
      this.tempItem.status = item.status
      this.tempItem.isBind = item.isBind
      this.tempItem.studentId = item.studentId || 0
      this.endTime = item.endTime
    },
    handleEditDialogConfirm() {
      if (!this.tempItem.endTime) {
        this.$errorMsg('请输入到期时间')
        return
      }
      this.$http({
        url: this.$urlPath.editStudyCardInfo,
        data: this.tempItem
      }).then(res => {
        this.dialogEditVisible = false
        this.$successMsg('延期操作成功')
        this.getData()
      })
    },
    textBookList(item) {
      if (!this.checkButtonPermission('grant_material')) {
        return
      }
      this.$router.push({
        name: 'TextBookList',
        params: {
          studyCardId: item.studyCardId,
          studyCardCode: item.cardCode,
          studyCardErcode: item.cardErcode,
          textbookType: item.cardSource
        }
      })
    },
    grantTextBookList(item) {
      if (!this.checkButtonPermission('search_material')) {
        return
      }
      this.dialogGrantTextBookVisible = true
      this.grantTextBookLoading = true
      this.$http({
        url: this.$urlPath.queryTextBookByStudyCardId,
        methods: this.HTTP_GET,
        data: {
          studyCardId: item.studyCardId
        }
      }).then(res => {
        this.grantTextBookLoading = false
        this.grantTextBookTableData = res.obj
      })
    }
  }
}
