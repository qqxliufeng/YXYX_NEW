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
      >
        <el-table-column
          align="center"
          label="序号"
          prop="userId"
          fixed="left"
        >
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="username"
          label="用户名称"
          fixed="left"
          width="100"
        >
          <template slot-scope="scope">
            <el-link
              type="primary"
              @click="logUserList(scope.row)"
            >{{ scope.row.username }}</el-link>
            <div
              style="font-size: 10px;"
              @click="logUserList(scope.row)"
            >查看更多</div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="endTime"
          label="耗时"
          width="160"
        >
          <template slot-scope="scope">
            {{ scope.row.useTime / 1000 + 's' }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="username"
          label="耗时级别"
          width="100"
        >
          <template slot-scope="scope">
            <el-link :type="getWarningLevelName(scope.row)">{{ getWarningName(scope.row) }}</el-link>
          </template>
        </el-table-column>
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
import logMixins from '../../mixins/log-mixins'
export default {
  name: 'Logmanagement',
  mixins: [tableMixins, logMixins],
  mounted() {
    this.getData()
  },
  methods: {
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
    logUserList(item) {
      this.$router.push({
        name: 'LogmanagementUserList',
        params: {
          userId: item.userId
        }
      })
    }
  }
}
</script>
