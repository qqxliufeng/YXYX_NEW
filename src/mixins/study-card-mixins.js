export default {
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
    }
  }
}
