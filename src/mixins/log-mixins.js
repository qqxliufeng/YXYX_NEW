export default {
  methods: {
    getWarningLevelName(item) {
      if (item.useTime <= 1) {
        return 'success'
      }
      if (item.useTime > 1 && item.useTime <= 3) {
        return 'primary'
      }
      if (item.useTime > 3 && item.useTime <= 5) {
        return 'warning'
      }
      if (item.useTime > 5) {
        return 'danger'
      }
    },
    getWarningName(item) {
      if (item.useTime <= 1) {
        return '网络很好'
      }
      if (item.useTime > 1 && item.useTime <= 3) {
        return '网络正常'
      }
      if (item.useTime > 3 && item.useTime <= 5) {
        return '警告操作'
      }
      if (item.useTime > 5) {
        return '危险操作'
      }
    }
  }
}
