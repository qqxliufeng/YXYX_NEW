<template>
  <div>
    <el-drawer
      :visible.sync="openDrawer"
      direction="rtl"
      :with-header="false"
      size="40%"
    >
      <div class="padding">
        <div class="flex justify-between align-center">
          <el-button
            type="danger"
            size="mini"
            @click="openDrawer = false"
          >关闭</el-button>
        </div>
        <el-table
          ref="multipleTable"
          v-loading="loading"
          :stripe="tableConfig.stripe"
          :header-cell-style="tableConfig.headerCellStyle"
          :data="tableData"
          :border="tableConfig.border"
          :size="tableConfig.size"
          :default-sort="tableConfig.defalutSort"
          :style="tableConfig.style"
          height="90vh"
        >
          <el-table-column
            align="center"
            label="学生姓名"
            prop="studentName"
          />
          <el-table-column
            align="center"
            label="成绩"
            prop="score"
          />
          <el-table-column
            align="center"
            label="正确率"
            prop="accuracy"
          >
            <template slot-scope="scope">
              {{ scope.row.accuracy * 100 + '%' }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="考试用时"
            prop="accuracy"
          >
            <template slot-scope="scope">
              {{ scope.row.useTime / 1000 + '秒' }}
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import tableMixins from '@/mixins/table-mixins'
export default {
  name: 'StudentScore',
  mixins: [tableMixins],
  props: {
    examItem: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      openDrawer: false
    }
  },
  methods: {
    show() {
      this.openDrawer = true
      this.getData()
    },
    getData() {
      if (!this.examItem) return
      this.$http({
        url: this.$urlPath.queryExamStudentRecord,
        methods: this.HTTP_GET,
        data: {
          examId: this.examItem.examId
        }
      }).then(res => {
        this.loading = false
        this.tableData = res.obj
      })
    }
  }
}
</script>

<style>
</style>
