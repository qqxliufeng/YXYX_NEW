export default {
  methods: {
    getWarningLevelName(item) {
      if (item.useTime <= 1000) {
        return 'success'
      }
      if (item.useTime > 1000 && item.useTime <= 3000) {
        return 'success'
      }
      if (item.useTime > 3000 && item.useTime <= 5000) {
        return 'warning'
      }
      if (item.useTime > 5000 && item.useTime <= 8000) {
        return 'danger'
      }
      if (item.useTime > 8000) {
        return 'danger'
      }
    },
    getWarningName(item) {
      // 神速(小于1秒钟)
      // 正常(1-3秒钟)
      // 警告（3-5秒钟）
      // 龟速（5-8秒钟）
      // 严重（8秒以上）
      if (item.useTime <= 1000) {
        return '神速'
      }
      if (item.useTime > 1000 && item.useTime <= 3000) {
        return '正常'
      }
      if (item.useTime > 3000 && item.useTime <= 5000) {
        return '警告'
      }
      if (item.useTime > 5000 && item.useTime <= 8000) {
        return '龟速'
      }
      if (item.useTime > 8000) {
        return '严重'
      }
    }
  }
}
