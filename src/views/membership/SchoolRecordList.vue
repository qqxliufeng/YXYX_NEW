<template>
  <div class="container">
    <el-card :body-style="{ padding: '2px' }">
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
          width="50"
          prop="recordId"
        />
        <el-table-column
          align="center"
          label="服务内容"
          prop="record"
        >
          <template slot-scope="scope">
            <div v-html="scope.row.record" />
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="创建时间"
          width="160"
          prop="createTime"
        >
          <template slot-scope="scope">{{
            scope.row.createTime | parseTime
          }}</template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import tableMixins from '../../mixins/table-mixins'
export default {
  name: 'SchoolRecordList',
  mixins: [tableMixins],
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      this.$http({
        url: this.$urlPath.querySchoolRecordList,
        methods: this.HTTP_GET,
        data: {
          schoolId: this.$route.params.schoolId,
          pageNum: this.page,
          pageSize: this.pageSize
        }
      }).then(res => {
        this.loading = false
        this.tableData = res.obj
      })
    }
  }
}
</script>
