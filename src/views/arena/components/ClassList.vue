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
          <el-button
            v-if="mode === 'choose'"
            type="primary"
            size="mini"
            @click="confirm"
          >确定</el-button>
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
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            v-if="mode === 'choose'"
            type="selection"
            width="55"
          />
          <el-table-column
            align="center"
            label="名称"
            prop="className"
          />
          <el-table-column
            align="center"
            label="年级"
            prop="classLevel"
          />
        </el-table>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import tableMixins from '@/mixins/table-mixins'
export default {
  name: 'ClassList',
  mixins: [tableMixins],
  data() {
    return {
      openDrawer: false,
      mode: 'choose',
      choosedClassList: []
    }
  },
  methods: {
    show(mode = 'choose', examId = 0, classOrStudent = 0) {
      this.mode = mode
      this.openDrawer = true
      if (mode === 'choose') {
        this.choosedClassList = []
        this.$nextTick(_ => {
          this.$refs.multipleTable.clearSelection()
        })
        this.getClassList()
      } else {
        this.getChoosedClassList(examId, classOrStudent)
      }
    },
    getClassList() {
      if (this.tableData.length > 0) return
      this.$http({
        url: this.$urlPath.querySchoolClass,
        methods: this.HTTP_GET,
        data: {
          schoolId: this.$store.getters.schoolId,
          pageNum: 1,
          pageSize: 1000
        }
      }).then(res => {
        this.onSuccess(res.obj)
      })
    },
    getChoosedClassList(examId, classOrStudent) {
      this.$http({
        url: this.$urlPath.queryExamToClassOrStudent,
        methods: this.HTTP_GET,
        data: {
          examId,
          classOrStudent
        }
      }).then(res => {
        this.loading = false
        this.tableData = res.obj
      })
    },
    handleSelectionChange(val) {
      this.choosedClassList = val
    },
    confirm() {
      if (this.choosedClassList.length === 0) {
        this.$errorMsg('请至少选择一个班级')
        return
      }
      this.openDrawer = false
      this.$emit('confirm', this.choosedClassList)
    }
  }
}
</script>

<style>
</style>
