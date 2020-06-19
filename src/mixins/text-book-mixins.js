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
          return '拳心同步'
        case 2:
          return '智能英语'
      }
    },
    videoFormatter(item) {
      return item.isHasVideo === 0 ? '是' : '否'
    },
    exercisesFormatter(item) {
      return item.isHasExercises === 0 ? '是' : '否'
    },
    openFormatter(item) {
      return item.isOpenUser === 0 ? '是' : '否'
    },
    statusFormatter(item) {
      return item.status === 0 ? '正常' : '禁用'
    }
  }
}
