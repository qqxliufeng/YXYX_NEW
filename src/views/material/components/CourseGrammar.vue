<template>
  <div>
    <material-table-header
      ref="tableHeader"
      :show-course="false"
      :show-level="false"
      material-type="grammar"
      @on-change-value="onChangeValue"
    />
    <el-card
      ref="tableContainer"
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
        :height="tableConfig.style.myHeight"
      >
        <el-table-column
          align="center"
          label="课程编号"
          prop="courseCode"
          fixed="left"
        />
        <el-table-column
          align="center"
          label="课程名称"
          prop="courseName"
          width="150"
          fixed="left"
          show-overflow-tooltip
        />
        <el-table-column
          align="center"
          label="关卡数量"
          prop="levelNum"
        />
        <el-table-column
          align="center"
          label="创建时间"
          prop="createTime"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <div class="text-cut">
              {{ scope.row.createTime | parseTime }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="状态"
          prop="status"
        >
          <template slot-scope="scope">
            <table-status :status="{label: scope.row.status === 0 ? '正常' : '禁用', type: scope.row.status === 0 ? 'primary' : 'danger'}" />
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
import tableMixins from '@/mixins/table-mixins'
import MaterialTableHeader from './MaterialTableHeader'
export default {
  name: 'CourseGrammar',
  components: {
    MaterialTableHeader
  },
  mixins: [tableMixins],
  data() {
    return {
      textbookId: 0
    }
  },
  methods: {
    onChangeValue({ textbookId }) {
      this.page = 0
      this.loading = true
      this.textbookId = textbookId
      this.getData()
    },
    getData() {
      if (!this.textbookId) {
        this.loading = false
        return
      }
      this.$http({
        url: this.$urlPath.queryCourseByTextBook,
        methods: this.HTTP_GET,
        data: {
          textbookId: this.textbookId,
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

