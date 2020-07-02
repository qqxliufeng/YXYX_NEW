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
          label="ID"
          prop="prizedrawId"
          fixed="left"
        />
        <el-table-column
          align="center"
          prop="prizeName"
          label="抽奖标题"
          fixed="left"
          width="150"
        />
        <el-table-column
          align="center"
          prop="studentName"
          label="学生名称"
          width="160"
        />
        <el-table-column
          align="center"
          prop="studentPhone"
          label="电话号码"
        />
        <el-table-column
          align="center"
          label="发放状态"
          width="140"
        >
          <template slot-scope="scope">
            <table-status :status="{label: scope.row.isGrant === 0 ? '未发放' : '已发放', type: scope.row.isGrant === 0 ? 'danger' : 'success'}" />
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="createTime"
          label="创建时间"
          width="160"
        >
          <template slot-scope="scope">
            {{ scope.row.createTime | parseTime }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="createTime"
          label="操作"
          fixed="right"
        >
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.isGrant === 0"
              :size="$style.tableButtonSize"
              type="primary"
              @click="setGrant(scope.row)"
            >发放奖品</el-button>
            <el-button
              v-else
              :size="$style.tableButtonSize"
              type="success"
              @click="$errorMsg('奖品已发放')"
            >
              已发放奖品
            </el-button>
          </template>
        </el-table-column>
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
  name: 'LuckList',
  mixins: [tableMixins],
  mounted() {
    this.getData()
  },
  methods: {
    setGrant(item) {
      if (!this.checkButtonPermission('grant_luckdraw')) {
        return
      }
      this.$warningConfirm('确定要发放该奖品吗？', _ => {
        this.$showLoading(closeLoading => {
          this.$http({
            url: this.$urlPath.setIsGrant,
            data: {
              prizedrawId: item.prizedrawId
            }
          }).then(res => {
            closeLoading()
            this.$successMsg('奖品发放成功')
            item.isGrant = 1
          }).catch(_ => {
            closeLoading()
          })
        })
      })
    },
    getData() {
      this.$http({
        url: this.$urlPath.queryPrizeDrawList,
        methods: this.HTTP_GET,
        data: {
          schoolId: this.$store.getters.schoolId,
          pageNum: this.page,
          pageSize: this.pageSize
        }
      }).then(res => {
        this.onSuccess(res.obj)
      })
    }
  }
}
</script>
