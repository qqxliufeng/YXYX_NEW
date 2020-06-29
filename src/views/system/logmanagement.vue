<template>
  <div class="container">
    <table-header
      ref="tableHeader"
      title="用户操作日志信息"
      :form-model-array="formModelArray"
      :show-delete="false"
      :show-add="false"
      @onsearch="onSearch"
    />
    <el-card
      :body-style="{ padding: 0 }"
      class="table-container"
      :style="tableCardStyle"
    >
      <el-table
        v-loading="loading"
        :stripe="tableConfig.stripe"
        :header-cell-style="tableConfig.headerCellStyle"
        :data="tableData"
        :border="tableConfig.border"
        :size="tableConfig.size"
        :default-sort="tableConfig.defalutSort"
        :style="tableConfig.style"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          align="center"
          label="用户ID"
          prop="userId"
          fixed="left"
        />
        <el-table-column
          align="center"
          prop="username"
          label="用户名称"
          fixed="left"
          width="100"
        />
        <el-table-column
          align="center"
          prop="phone"
          label="手机号码"
          width="150"
        />
        <el-table-column
          align="center"
          prop="moduleName"
          label="操作模块"
          width="120"
        />
        <el-table-column
          align="center"
          prop="optionName"
          label="具体说明"
          width="160"
        />
        <el-table-column
          align="center"
          prop="ip"
          label="IP地址"
          width="140"
        >
          <template slot-scope="scope">
            <el-link
              :underline="false"
              type="primary"
            >{{ scope.row.ip }}</el-link>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="createTime"
          label="操作时间"
          width="160"
        />
        <el-table-column
          align="center"
          prop="endTime"
          label="结束时间"
          width="160"
        />
      </el-table>
    </el-card>
    <table-foot
      :total="total"
      :page-size="pageSize"
      :page-num="page"
      @prev-click="prevClick"
      @next-click="nextClick"
      @current-change="currentChange"
      @refresh="reloadData"
    />
  </div>
</template>

<script>
import tableMixins from '../../mixins/table-mixins'
export default {
  name: 'Logmanagement',
  mixins: [tableMixins],
  data() {
    return {
      formModelArray: [
        {
          id: 1,
          value: '',
          label: '选择用户',
          name: 'userId',
          span: 5,
          type: 'select',
          selectOptions: []
        }
      ]
    }
  },
  mounted() {
    this.getData()
    this.getAllUserList()
  },
  methods: {
    initData() {
      this.likeSearchUrl = this.$urlPath.queryUserLogsByUserId
    },
    getData() {
      this.$http({
        url: this.$urlPath.queryUserLogs,
        methods: this.HTTP_GET,
        data: {
          pageNum: this.page,
          pageSize: this.pageSize
        },
        withUserId: false,
        withRoleId: false
      }).then(res => {
        this.loading = false
        this.tableData = res.content
        this.total = res.totalElements
      })
    },
    likeSearch() {
      this.loading = true
      const form = this.generatorFormObj(this.formModelArray)
      this.$http({
        url: this.likeSearchUrl,
        methods: this.HTTP_GET,
        data: form,
        withRoleId: false,
        withUserId: false
      }).then(res => {
        this.loading = false
        this.tableData = res.content
        this.total = res.totalElements
      }).catch(error => {
        console.log(error)
        this.loading = false
      })
    },
    getAllUserList() {
      this.$http({
        url: this.$urlPath.queryAllUser,
        methods: this.HTTP_GET,
        data: {
          pageNum: 1,
          pageSize: 1000
        },
        withUserId: false,
        withRoleId: false
      }).then(res => {
        res.obj.list.forEach(it => {
          this.formModelArray[0].selectOptions.push({
            label: it.username,
            value: it.userId
          })
        })
      })
    }
  }
}
</script>
