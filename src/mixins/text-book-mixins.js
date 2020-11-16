export default {
  data() {
    return {

    }
  },
  methods: {
    typeFormatter(item) {
      switch (item.textbookType) {
        case 0:
          return '词汇'
        case 1:
          return '语法'
        case 2:
          return '体验'
        case 3:
          return '自然拼读'
      }
    },
    categoryFormatter(item) {
      switch (item.textbookCategory) {
        case 0:
          return 'YouCan'
        case 1:
          return '拳心词汇'
        case 2:
          return '智能英语'
        case 3:
          return '中考'
        case 4:
          return '小升初'
        case 5:
          return '同步'
        case 6:
          return '贝世卡'
        case 7:
          return '语法逆袭'
        case 8:
          return '拳心语法'
      }
    },
    videoFormatter(item) {
      return item.isHasVideo === 0 ? '是' : '否'
    },
    exercisesFormatter(item) {
      return item.textbookType === 0 ? item.isHasExercises === 0 ? '是' : '否' : '--'
    },
    openFormatter(item) {
      return item.isOpenUser === 0 ? '是' : '否'
    },
    statusFormatter(item) {
      return {
        label: item.status === 0 ? '正常' : '禁用',
        type: item.status === 0 ? 'primary' : 'danger'
      }
    }
  }
}
