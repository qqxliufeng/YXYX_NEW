<template>
  <div>
    <el-drawer
      :visible.sync="openSchoolDrawer"
      direction="rtl"
      :with-header="false"
      :size="$isPhone ? '70%' : '40%'"
    >
      <div class="padding">
        <div class="flex justify-between align-center">
          <el-button
            type="danger"
            size="mini"
            @click="openSchoolDrawer = false"
          >关闭</el-button>
          <el-button
            type="primary"
            size="mini"
            @click="confirmSchool"
          >确定</el-button>
        </div>
        <el-table
          ref="multipleSchoolTable"
          v-loading="schoolLoading"
          :stripe="tableConfig.stripe"
          :header-cell-style="tableConfig.headerCellStyle"
          :data="schoolList"
          :border="tableConfig.border"
          :size="tableConfig.size"
          :default-sort="tableConfig.defalutSort"
          :style="tableConfig.style"
          height="90vh"
          @selection-change="handleSchoolSelectionChange"
        >
          <el-table-column
            type="selection"
            width="55"
          />
          <el-table-column
            align="center"
            label="学校名称"
            prop="schoolName"
          />
          <el-table-column
            v-if="mode !== 0"
            align="center"
            label="操作"
            width="120"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="danger"
                @click="chooseClass(scope.row)"
              >选择班级</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-drawer>
    <el-drawer
      :visible.sync="openClassDrawer"
      direction="rtl"
      :with-header="false"
      :size="$isPhone ? '70%' : '40%'"
    >
      <div class="padding">
        <div class="flex justify-between align-center">
          <el-button
            type="danger"
            size="mini"
            @click="openClassDrawer = false"
          >关闭</el-button>
          <el-button
            type="primary"
            size="mini"
            @click="confirmClass"
          >确定</el-button>
        </div>
        <el-table
          ref="multipleClassTable"
          v-loading="classLoading"
          :stripe="tableConfig.stripe"
          :header-cell-style="tableConfig.headerCellStyle"
          :data="classList"
          :border="tableConfig.border"
          :size="tableConfig.size"
          :default-sort="tableConfig.defalutSort"
          :style="tableConfig.style"
          height="90vh"
          @selection-change="handleClassSelectionChange"
        >
          <el-table-column
            type="selection"
            width="55"
          />
          <el-table-column
            align="center"
            label="班级名称"
            prop="className"
          />
          <el-table-column
            v-if="mode === 2"
            align="center"
            label="操作"
            width="120"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="danger"
                @click="chooseStudent(scope.row)"
              >选择学生</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-drawer>
    <el-drawer
      :visible.sync="openStudentDrawer"
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
          <el-button
            type="primary"
            size="mini"
            @click="confirmStudent"
          >确定</el-button>
        </div>
        <el-table
          ref="multipleStudentTable"
          v-loading="studentLoading"
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
            type="selection"
            width="55"
          />
          <el-table-column
            align="center"
            label="姓名"
            prop="studentName"
          />
        </el-table>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import tableMixins from '@/mixins/table-mixins'
import schoolMixins from '@/mixins/school-mixins'
export default {
  name: 'SelectTargetList',
  mixins: [tableMixins, schoolMixins],
  data() {
    return {
      mode: 0, // 0学校 1班级 2个人,
      openSchoolDrawer: false,
      openClassDrawer: false,
      openStudentDrawer: false,
      schoolLoading: false,
      classLoading: false,
      studentLoading: false,
      studentList: [],
      selectedSchool: null,
      selectClass: null
    }
  },
  methods: {
    showSchoolList(mode = 0) {
      this.openSchoolDrawer = true
      this.schoolLoading = true
      this.mode = mode
      this.getSchoolList(_ => {
        this.schoolLoading = false
      })
    },
    handleSchoolSelectionChange() { },
    chooseClass(schoolItem) {
      this.selectedSchool = schoolItem
      this.classLoading = true
      this.openClassDrawer = true
      this.getClassListBySchoolId(_ => {
        this.classLoading = false
      }, schoolItem.schoolId)
    },
    handleClassSelectionChange() { },
    chooseStudent(classItem) {
      this.selectClass = classItem
    },
    confirmSchool() { },
    confirmClass() { },
    confirmStudent() { }
  }
}
</script>
