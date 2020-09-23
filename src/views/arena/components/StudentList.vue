<template>
  <div>
    <el-drawer
      :visible.sync="openDrawer"
      direction="rtl"
      :with-header="false"
      :size="$isPhone ? '70%' : '40%'"
    >
      <div class="padding">
        <div class="flex justify-between align-center">
          <el-button
            type="danger"
            size="mini"
            @click="openDrawer = false"
          >关闭</el-button>
          <div v-if="mode === 'choose'">
            <span>请选择班级：</span>
            <el-select
              v-model="classId"
              placeholder="请选择班级"
              size="small"
            >
              <el-option
                v-for="item of classList"
                :key="item.classId"
                :label="item.className"
                :value="item.classId"
              />
            </el-select>
          </div>
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
            label="姓名"
            prop="studentName"
          />
          <el-table-column
            align="center"
            label="手机号"
            prop="studentPhone"
          />
        </el-table>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import tableMixins from '@/mixins/table-mixins'
export default {
  name: 'StudentList',
  mixins: [tableMixins],
  data() {
    return {
      openDrawer: false,
      mode: 'choose',
      classList: [],
      choosedStudentList: [],
      classId: ''
    }
  },
  watch: {
    classId(newVal) {
      if (!newVal) return
      this.getSutdentList()
    }
  },
  methods: {
    show(mode = 'choose', examId = 0, classOrStudent = 0) {
      this.mode = mode
      this.openDrawer = true
      this.loading = false
      if (mode === 'choose') {
        this.classList = []
        this.classId = ''
        this.choosedStudentList = []
        this.tableData = []
        this.getClassList()
        this.$nextTick(_ => {
          this.$refs.multipleTable.clearSelection()
        })
      } else {
        this.getChoosedStudentList(examId, classOrStudent)
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
        this.classList = res.obj.list
      })
    },
    getSutdentList() {
      this.loading = true
      this.$http({
        url: this.$urlPath.queryStudentListLike,
        methods: this.HTTP_GET,
        data: {
          pageNum: 1,
          pageSize: 1000,
          schoolId: this.$store.getters.schoolId,
          classId: this.classId
        }
      }).then(res => {
        this.onSuccess(res.obj)
      })
    },
    getChoosedStudentList(examId, classOrStudent) {
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
      this.choosedStudentList = val
    },
    confirm() {
      if (this.choosedStudentList.length === 0) {
        this.$errorMsg('请至少选择一个学生')
        return
      }
      this.openDrawer = false
      this.$emit('confirm', this.choosedStudentList)
    }
  }
}
</script>

<style>
</style>
