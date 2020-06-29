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
        <!-- dr: 0
feedbackId: 5
replyParentId: null
replySatisfaction: 2 -->
        <el-table-column
          align="center"
          label="回复ID"
          prop="feedbackreplyId"
          fixed="left"
        />
        <el-table-column
          align="center"
          prop="replyUserName"
          label="回复人名称"
          fixed="left"
        />
        <el-table-column
          align="center"
          prop="replyContext"
          label="回复内容"
          min-width="100"
        />
        <el-table-column
          align="center"
          prop="createTime"
          label="回复时间"
          width="160"
        >
          <template slot-scope="scope">
            <div>{{ scope.row.replyTime | parseTime }}</div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="endTime"
          label="评分"
        >
          <template slot-scope="scope">
            <el-rate
              v-model="scope.row.replySatisfaction"
              disabled
              text-color="#ff9900"
            />
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="操作"
        >
          <template slot-scope="scope">
            <el-button
              type="danger"
              :size="$style.tableButtonSize"
              @click="replayFeedBack(scope.row)"
            >继续回复</el-button>
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
  name: 'FeedBackInfo',
  mixins: [tableMixins],
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      this.$http({
        url: this.$urlPath.queryFeedBackReplyList,
        methods: this.HTTP_GET,
        data: {
          pageNum: this.page,
          pageSize: this.pageSize,
          feedbackId: this.$route.params.feedbackId
        }
      }).then(res => {
        this.onSuccess(res.obj)
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
