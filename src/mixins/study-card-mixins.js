export default {
  data() {
    return {
      cardTypes: [
        {
          label: '小学正式卡',
          value: 'P'
        },
        {
          label: '小学体验卡',
          value: 'TP'
        },
        {
          label: '初中正式卡',
          value: 'M'
        },
        {
          label: '初中体验卡',
          value: 'TM'
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
      return item.isBind === 0 ? '未绑定' : '已绑定'
    },
    statusFormatter(item) {
      // 0未分配教材 1已分配教材 2未激活 3已激活 4已到期
      switch (item.status) {
        case 0:
          return '未分配教材'
        case 1:
          return '已分配教材'
        case 2:
          return '未激活'
        case 3:
          return '已激活'
        case 4:
          return '已到期'
      }
    },
    endTimeFormatter(item) {
      return item.endTime ? item.endTime : '暂无'
    },
    /**
     * 延长学习卡的到期时间
     */
    addEndTime(item) {
      this.dialogEditVisible = true
      this.tempItem.studyCardId = item.studyCardId
      this.tempItem.status = item.status
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
      this.$router.push({
        name: 'TextBookList',
        params: {
          studyCardId: item.studyCardId,
          studyCardCode: item.cardCode,
          studyCardErcode: item.cardErcode
        }
      })
    },
    grantTextBookList(item) {
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
