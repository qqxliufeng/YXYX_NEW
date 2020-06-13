export default {
  data() {
    return {
      tableConfig: {
        headerCellStyle: {
          backgroundColor: '#f5f5f5',
          color: '#333333'
        },
        stripe: true,
        border: true,
        size: 'large',
        defaultSort: {
          prop: 'id',
          order: 'descending'
        },
        style: {
          width: '99%',
          margin: '10px auto'
        }
      },
      tableData: [],
      page: 0,
      pageSize: 10,
      total: 0,
      loading: true,
      multipleSelection: [],
      searchInfo: '',
      pageInfo: {},
      buttonShowConfig: {
        showAdd: this.$menuButtonModel.checkPermission(this.$route.name, 'add'),
        showDelete: this.$menuButtonModel.checkPermission(this.$route.name, 'delete'),
        showEdit: this.$menuButtonModel.checkPermission(this.$route.name, 'edit'),
        showSearch: this.$menuButtonModel.checkPermission(this.$route.name, 'select')
      }
    }
  },
  mounted() {
    this.$root.$on('refresh_table', _ => {
      this.reloadData()
    })
  },
  beforeDestroy() {
    this.$root.$off('refresh_table')
    console.log('消息取消监听')
  },
  methods: {
    resetData() {
      this.tableData = []
      this.page = 0
      this.total = 0
    },
    reloadData() {
      this.resetData()
      this.getData()
    },
    currentChange(currentPage) {
      this.loading = true
      this.page = currentPage
      this.getData()
    },
    prevClick(currentPage) {
      this.loading = true
      this.page = currentPage
    },
    nextClick(currentPage) {
      this.loading = true
      this.page = currentPage
    },
    /**
     * 判断是否可以下载
     */
    canDownItems() {
      if (this.multipleSelection.length === 0) {
        this.$errorMsg('还未选择任何条目')
        return false
      }
      return true
    },
    /**
     * 批量下载
     * @idFieldName要删除的id
     * @callback回调函数
     */
    confirmDown(idFieldName, callback) {
      this.$warningConfirm('确定要下载此记录吗？', () => {
        const recordIds = this.multipleSelection.map(it => it[idFieldName]).join(',')
        if (callback) {
          callback(recordIds)
        }
      })
    },
    /**
     * 判断是否可以删除
     */
    canDeleteItems() {
      if (this.multipleSelection.length === 0) {
        this.$errorMsg('还未选择任何条目')
        return false
      }
      return true
    },
    /**
     * 批量删除
     * @idFieldName要删除的id
     * @callback回调函数
     */
    confirmDelete(idFieldName, callback) {
      this.$warningConfirm('删除后不可恢复，确定要删除此记录吗？', () => {
        const recordIds = this.multipleSelection.map(it => it[idFieldName]).join(',')
        if (callback) {
          callback(recordIds)
        }
      })
    },
    /**
     * 删除一个
     */
    confirmDeleteSingle(callback) {
      this.$warningConfirm('确定要删除此记录吗？', () => {
        if (callback) {
          callback()
        }
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    onError(error) {
      console.log(error)
      this.loading = false
    },
    onSuccess(data) {
      this.loading = false
      this.tableData = data.list
      // this.tableData = this.tableData.concat(this.tableData)
      // this.tableData = this.tableData.concat(this.tableData)
      this.pageInfo = {
        endRow: data.endRow,
        hasNextPage: data.hasNextPage,
        hasPreviousPage: data.hasPreviousPage,
        isFirstPage: data.isFirstPage,
        isLastPage: data.isLastPage,
        navigateFirstPage: data.navigateFirstPage,
        navigateLastPage: data.navigateLastPage,
        navigatePages: data.navigatePages,
        navigatepageNums: data.navigatepageNums,
        nextPage: data.nextPage,
        pageNum: data.pageNum,
        pageSize: data.pageSize,
        pages: data.pages,
        prePage: data.prePage,
        size: data.size,
        startRow: data.startRow,
        total: data.total
      }
      this.total = this.pageInfo.total
    },
    /**
     * 生成搜索对象
     */
    generatorFormObj(formModelArray = []) {
      const form = {}
      form['pageNum'] = this.page
      form['pageSize'] = this.pageSize
      formModelArray.forEach(it => {
        const name = it.name
        const value = it.value
        if (value instanceof Array) {
          value.forEach((i, index) => {
            form[it.name[index]] = i
          })
        } else {
          form[name] = value
        }
      })
      return form
    },
    onSearch(url) {
      this.loading = true
      const form = this.generatorFormObj(this.formModelArray)
      this.$http({
        url,
        methods: this.HTTP_GET,
        data: form
      }).then(res => {
        this.onSuccess(res.obj)
      }).catch(error => {
        console.log(error)
        this.loading = false
      })
    },
    /**
     * 统一封装禁用、解除用户状态的方法
     * @example: {item: scope.row, statusField: 'status', data: { schoolId: scope.row.schoolId }, lockUrl: $urlPath.lockSchool, unLockUrl: $urlPath.unLockSchool}
     */
    changeLockStatus({ item, statusField = 'isLock', data = {}, lockUrl, unLockUrl, methods = 'POST' }) {
      this.$warningConfirm('是否要' + (item[statusField] === 0 ? '禁用' : '解锁') + '此信息？', _ => {
        this.$http({
          url: item[statusField] === 0 ? lockUrl : unLockUrl,
          methods,
          data
        }).then(res => {
          this.$successMsg('操作成功')
          item[statusField] = item[statusField] === 0 ? 1 : 0
        })
      })
    }
  }
}
