<template>
  <div class="container">
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
  name: 'LogmanagementUserList',
  mixins: [tableMixins],
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      this.$http({
        url: this.$urlPath.queryUserLogsByUserId,
        methods: this.HTTP_GET,
        data: {
          userId: this.$route.params.userId,
          pageNum: this.page,
          pageSize: this.pageSize
        },
        withRoleId: false,
        withUserId: false
      }).then(res => {
        this.loading = false
        this.tableData = res.content
        this.total = res.totalElements
      })
    }
  }
}
</script>
