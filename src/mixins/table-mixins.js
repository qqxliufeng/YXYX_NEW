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
      tableCardStyle: {
        top: '0'
      },
      page: 1,
      pageSize: 10,
      total: 0,
      loading: true,
      multipleSelection: [],
      searchInfo: '',
      likeSearchUrl: '',
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
    this.tableCardStyle.top = this.$refs.tableHeader ? (this.$refs.tableHeader.$el.offsetHeight + 10 + 'px') : '0'
    if (this.initData) {
      this.initData()
    }
    this.$root.$on('refresh_table', _ => {
      this.reloadData()
    })
  },
  beforeDestroy() {
    this.$root.$off('refresh_table')
    console.log('消息取消监听')
  },
  methods: {
    onCollapsed() {
      console.log('123')
      this.tableCardStyle.top = this.$refs.tableHeader ? (this.$refs.tableHeader.$el.offsetHeight + 10 + 'px') : '0'
    },
    resetData() {
      this.tableData = []
      this.page = 1
      this.total = 0
    },
    reloadData() {
      this.resetData()
      this.getData()
    },
    currentChange(currentPage) {
      this.loading = true
      this.page = currentPage
      if (this.canSearch()) {
        this.likeSearch()
      } else {
        this.getData()
      }
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
     * 判断是否可以操作多个条目
     */
    canHandlerItems() {
      if (this.multipleSelection.length === 0) {
        this.$errorMsg('还未选择任何条目')
        return false
      }
      return true
    },
    /**
     * 批量操作多个条目
     * @idFieldName要删除的id
     * @callback回调函数
     */
    confirmHandlerMultiItems(msg = '确定要下载此记录吗？', idFieldName, callback) {
      this.$warningConfirm(msg, () => {
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
      // const form = {}
      // form['pageNum'] = this.page
      // form['pageSize'] = this.pageSize
      // formModelArray.forEach(it => {
      //   const name = it.name
      //   const value = it.value
      //   if (value instanceof Array) {
      //     value.forEach((i, index) => {
      //       form[it.name[index]] = i
      //     })
      //   } else {
      //     form[name] = value
      //   }
      // })
      // return form
      return formModelArray.reduce((acc, cur) => {
        if (cur.name instanceof Array) {
          cur.name.reduce((a, c, index) => {
            a[c] = cur.value[index] || ''
            return a
          }, acc)
        } else {
          acc[cur.name] = cur.value
        }
        return acc
      }, {
        pageNum: this.page,
        pageSize: this.pageSize
      })
    },
    onSearch() {
      if (!this.checkButtonPermission('select')) {
        return
      }
      this.page = 1
      this.likeSearch()
    },
    canSearch() {
      if (!this.formModelArray) {
        return false
      }
      if (this.formModelArray.length === 0) {
        return false
      }
      const result = this.formModelArray.some(it => {
        if (it.value !== '') {
          return true
        }
        if (it.value instanceof Array && it.value.length > 0) {
          return true
        }
        return false
      })
      return result
    },
    likeSearch() {
      this.loading = true
      const form = this.generatorFormObj(this.formModelArray)
      if (!form.hasOwnProperty('schoolId') || !form.schoolId) {
        form.schoolId = this.$store.getters.schoolId || ''
      }
      if (this.externalParam) {
        this.externalParam(form)
      }
      this.$http({
        url: this.likeSearchUrl,
        methods: this.HTTP_GET,
        data: form
      }).then(res => {
        this.onSuccess(res.obj)
      }).catch(error => {
        console.log(error)
        this.loading = false
      })
    },
    checkButtonPermission(btnCode) {
      if (!btnCode) {
        this.$errorMsg('按钮编码不能为空')
        return false
      }
      const checkResult = this.$menuButtonModel.checkPermission(this.$route.name, btnCode)
      if (!checkResult) {
        this.$errorMsg('当前账号权限不足，无法操作此功能，请联系管理员')
        return false
      }
      return true
    },
    /**
     * 统一封装禁用、解除用户状态的方法
     * @example: {item: scope.row, statusField: 'status', data: { schoolId: scope.row.schoolId }, lockUrl: $urlPath.lockSchool, unLockUrl: $urlPath.unLockSchool}
     */
    changeLockStatus({ item, statusField = 'isLock', data = {}, lockUrl, unLockUrl, methods = 'POST' }) {
      if (item[statusField] === 0) {
        if (!this.checkButtonPermission('lock')) {
          return
        }
      } else {
        if (!this.checkButtonPermission('unlock')) {
          return
        }
      }
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
