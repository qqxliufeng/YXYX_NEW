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
          label="ID"
          prop="feedbackId"
          fixed="left"
        />
        <el-table-column
          align="center"
          prop="feedbackUserName"
          label="反馈人名称"
          fixed="left"
        />
        <el-table-column
          align="center"
          prop="feedbackPhone"
          label="反馈内容"
          min-width="100"
        />
        <el-table-column
          align="center"
          prop="createTime"
          label="反馈时间"
          width="160"
        >
          <template slot-scope="scope">
            <div>{{ scope.row.createTime | parseTime }}</div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="endTime"
          label="回复状态"
        >
          <template slot-scope="scope">
            <table-status :status="{ label: scope.row.isReply === 0 ? '未回复' : '已回复', type: scope.row.isReply === 0 ? 'warning' : 'success' }" />
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="操作"
        >
          <template slot-scope="scope">
            <el-button
              type="primary"
              :size="$style.tableButtonSize"
              @click="feedBackInfo(scope.row)"
            >详情</el-button>
            <el-button
              type="danger"
              :size="$style.tableButtonSize"
              @click="replayFeedBack(scope.row)"
            >回复</el-button>
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
  name: 'FeedBack',
  mixins: [tableMixins],
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      this.$http({
        url: this.$urlPath.queryAllFeedBackList,
        methods: this.HTTP_GET,
        data: {
          pageNum: this.page,
          pageSize: this.pageSize
        }
      }).then(res => {
        this.onSuccess(res.obj)
      })
    },
    feedBackInfo(item) {
      if (!this.checkButtonPermission('feed_info')) {
        return
      }
      this.$router.push({
        name: 'FeedBackInfo',
        params: {
          feedbackId: item.feedbackId
        }
      })
    },
    replayFeedBack(item) {
      if (!this.checkButtonPermission('feed_replay')) {
        return
      }
      this.$router.push({
        name: 'FeedBackReply',
        params: {
          feedbackId: item.feedbackId
        }
      })
    }
  }
}
</script>
