<!--
 * @Author: your name
 * @Date: 2020-06-13 10:35:14
 * @LastEditTime: 2020-06-13 17:58:52
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /YXYX_NEW/src/views/membership/vipstudent.vue
-->
<template>
  <div class="container">
    <table-header
      ref="tableHeader"
      title="查询内容"
      :form-model-array="formModelArray"
      :show-search="true"
      :show-add="true"
      :show-delete="false"
      @onadd="onAdd"
      @onsearch="onSearch"
    />
    <el-card
      :body-style="{ padding: '2px' }"
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
          prop="studentId"
          fixed="left"
        />
        <el-table-column
          align="center"
          label="学生姓名"
          prop="studentName"
          fixed="left"
        />
        <el-table-column
          align="center"
          label="学号"
          prop="schoolNo"
        >
          <template slot-scope="scope">
            <div>
              {{ scope.row.studentNo ? scope.row.studentNo : '暂无' }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="手机号码"
          width="160"
          prop="studentPhone"
        />
        <el-table-column
          align="center"
          label="性别"
          show-overflow-tooltip
        >
          <template slot-scope="scope">{{
            scope.row.sex === 0 ? "男" : "女"
          }}</template>
        </el-table-column>
        <el-table-column
          align="center"
          label="在线状态"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <div>
              {{ scope.row.isOnLine === 1 ? "线上" : "线下" }}
            </div>
            <el-link
              v-if="scope.row.isOnLine === 0"
              style="font-size: 14px"
              type="danger"
              @click.native="assginTextbook(scope.row)"
            >分配教材</el-link>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="学生属性"
          show-overflow-tooltip
        >
          <template slot-scope="scope">{{
            scope.row.isTeacher === 0 ? "普通学生" : "老师"
          }}</template>
        </el-table-column>
        <el-table-column
          align="center"
          label="家庭地址"
          prop="address"
          width="200"
          show-overflow-tooltip
        />
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
        <el-table-column
          align="center"
          label="状态"
          prop="status"
        >
          <template slot-scope="scope">
            <table-status :status="statusFormat(scope.row)" />
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="操作"
          fixed="right"
          min-width="250"
        >
          <template slot-scope="scope">
            <el-button
              :size="$style.tableButtonSize"
              :type="scope.row.status === 0 ? 'danger' : 'warning'"
              @click="changeLockStatus({
                item: scope.row,
                statusField: 'status',
                data: { studentId: scope.row.studentId },
                lockUrl: $urlPath.lockStudent,
                unLockUrl: $urlPath.unLockStudent
              })"
            >{{ scope.row.status === 0 ? "禁用" : "正常" }}</el-button>
            <el-button
              :size="$style.tableButtonSize"
              type="primary"
              @click="handlerUpdate(scope.row)"
            >编辑</el-button>
            <el-button
              :size="$style.tableButtonSize"
              type="success"
              @click="initPassword(scope.row)"
            >重置密码</el-button>
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
    <!-- 增加学生对话框 -->
    <el-dialog
      :title="mode === 'add' ? '添加学生' : '编辑学生信息'"
      :visible.sync="dialogFormVisible"
      top="10vh"
    >
      <el-form class="dialog-container">
        <el-form-item label="学校名称">
          <el-col :span="$style.dialogColSpan">
            <el-select
              v-model="studentModel.schoolId"
              style="width: 100%"
              class="filter-item"
              placeholder="请选择学校名称"
            >
              <el-option
                v-for="item of schoolList"
                :key="item.schoolId"
                :label="item.schoolName"
                :value="item.schoolId"
              />
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="班级名称">
          <el-col :span="$style.dialogColSpan">
            <el-select
              v-model="studentModel.classId"
              style="width: 100%"
              class="filter-item"
              placeholder="请选择班级名称"
            >
              <el-option
                v-for="item of classList"
                :key="item.classId"
                :label="item.className"
                :value="item.classId"
              />
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="学生姓名">
          <el-col :span="$style.dialogColSpan">
            <el-input
              v-model="studentModel.studentName"
              placeholder="请输入学生姓名（必填）"
              maxlength="6"
            />
          </el-col>
        </el-form-item>
        <el-form-item label="手机号码">
          <el-col :span="$style.dialogColSpan">
            <el-input
              v-model="studentModel.studentPhone"
              placeholder="请输入手机号码（必填）"
              maxlength="11"
            />
          </el-col>
        </el-form-item>
        <el-form-item label="登录密码">
          <el-col :span="$style.dialogColSpan">
            <el-link
              :underline="false"
              type="danger"
            >默认密码为手机号码的后六位</el-link>
          </el-col>
        </el-form-item>
        <el-form-item label="家庭住址">
          <el-col :span="$style.dialogColSpan">
            <el-input
              v-model="studentModel.address"
              type="textarea"
              :rows="3"
              maxlength="100"
              placeholder="请输入家庭住址（必填）"
            />
          </el-col>
        </el-form-item>
        <el-form-item label="学生性别">
          <el-col :span="$style.dialogColSpan">
            <el-radio-group v-model="studentModel.sex">
              <el-radio :label="0">男</el-radio>
              <el-radio :label="1">女</el-radio>
            </el-radio-group>
          </el-col>
        </el-form-item>
        <el-form-item label="学生属性">
          <el-col :span="$style.dialogColSpan">
            <el-radio-group v-model="studentModel.isTeacher">
              <el-radio :label="0">普通学生</el-radio>
              <el-radio :label="1">老师</el-radio>
            </el-radio-group>
          </el-col>
        </el-form-item>
        <el-form-item label="是否线上">
          <el-col :span="$style.dialogColSpan">
            <el-radio-group v-model="studentModel.isOnLine">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-col>
        </el-form-item>
        <el-form-item label="学生状态">
          <el-col :span="$style.dialogColSpan">
            <el-radio-group v-model="studentModel.status">
              <el-radio :label="0">正常</el-radio>
              <el-radio :label="1">禁用</el-radio>
            </el-radio-group>
          </el-col>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          :size="$style.dialogButtonSize"
          @click="dialogFormVisible = false"
        >取消</el-button>
        <el-button
          :size="$style.dialogButtonSize"
          type="primary"
          @click="handlerFormConfirm"
        >确定</el-button>
      </div>
    </el-dialog>
    <!-- 增加班级对话框 -->
  </div>
</template>

<script>
import tableMixins from '../../mixins/table-mixins'
import schoolMixins from '../../mixins/school-mixins'
export default {
  name: 'VIPClass',
  mixins: [tableMixins, schoolMixins],
  data() {
    return {
      formModelArray: [
        {
          id: 1,
          value: '',
          label: '学校名称',
          name: 'schoolId',
          span: 5,
          type: 'select',
          selectOptions: []
        },
        {
          id: 2,
          value: '',
          label: '班级列表',
          name: 'classId',
          span: 5,
          type: 'select',
          selectOptions: []
        },
        {
          id: 3,
          value: '',
          label: '学生类型',
          name: 'isOnLine',
          span: 5,
          type: 'select',
          selectOptions: [
            {
              label: '线下',
              value: 0
            },
            {
              label: '线上',
              value: 1
            }
          ]
        },
        {
          id: 4,
          value: '',
          label: '学生姓名',
          name: 'studentName',
          span: 5,
          type: 'input'
        },
        {
          id: 5,
          value: '',
          label: '联系方式',
          name: 'studentPhone',
          span: 5,
          type: 'input'
        },
        {
          id: 6,
          value: '',
          label: '老师姓名',
          name: 'teacherName',
          span: 5,
          type: 'input'
        }
      ],
      dialogFormVisible: false,
      mode: 'add',
      studentModel: {
        schoolId: '', // 学校ID
        classId: '', // 班级ID
        studentName: '', // 学生姓名
        studentPhone: '', // 学生联系方式(登录密码为手机号后6位)
        address: '', // 家庭地址
        sex: 0, // 性别 0男 1女
        isTeacher: 0, // 学生属性 0普通学生 1老师
        isOnLine: 1, // 是否线上 0否 1是，和学校线上线下一致
        status: 0 // 状态，0正常 1禁用
      },
      dialogTableVisible: false,
      textbookList: []
    }
  },
  mounted() {
    this.getData()
    this.getSchoolList(_ => {
      if (this.schoolList && this.schoolList.length > 0) {
        this.formModelArray[0].selectOptions = this.schoolList.map(it => {
          return {
            label: it.schoolName,
            value: it.schoolId
          }
        })
      }
    })
    this.getClassList(_ => {
      if (this.classList && this.classList.length > 0) {
        this.formModelArray[1].selectOptions = this.classList.map(it => {
          return {
            label: it.className,
            value: it.classId
          }
        })
      }
    })
  },
  methods: {
    initData() {
      this.likeSearchUrl = this.$urlPath.queryStudentListLike
    },
    statusFormat(item) {
      return {
        label: item.status === 0 ? '正常' : '禁用',
        type: item.status === 0 ? 'primary' : 'danger'
      }
    },
    getData() {
      this.$http({
        url: this.$urlPath.queryStudentList,
        methods: this.HTTP_GET,
        data: {
          pageNum: this.page,
          pageSize: this.pageSize
        },
        withRoleId: true,
        withUserId: false
      })
        .then(res => {
          this.onSuccess(res.obj)
        })
        .catch(error => {
          this.onError(error)
        })
    },
    onAdd() {
      this.dialogFormVisible = true
      this.mode = 'add'
      this.studentModel = {
        schoolId: '', // 学校ID
        classId: '', // 班级ID
        studentName: '', // 学生姓名
        studentPhone: '', // 学生联系方式(登录密码为手机号后6位)
        address: '', // 家庭地址
        sex: 0, // 性别 0男 1女
        isTeacher: 0, // 学生属性 0普通学生 1老师
        isOnLine: 1, // 是否线上 0否 1是，和学校线上线下一致
        status: 0 // 状态，0正常 1禁用
      }
    },
    handlerUpdate(item) {
      this.dialogFormVisible = true
      this.mode = 'edit'
      this.studentModel.studentId = item.studentId
      this.studentModel.schoolId = item.schoolId
      this.studentModel.classId = item.classId
      this.studentModel.studentName = item.studentName
      this.studentModel.studentPhone = item.studentPhone
      this.studentModel.address = item.address
      this.studentModel.sex = item.sex
      this.studentModel.isTeacher = item.isTeacher
      this.studentModel.isOnLine = item.isOnLine
      this.studentModel.status = item.status
    },
    handlerFormConfirm() {
      if (!this.studentModel.schoolId) {
        this.$errorMsg('请选择学校')
        return
      }
      if (!this.studentModel.classId) {
        this.$errorMsg('请输入年级名称')
        return
      }
      if (!this.studentModel.studentName) {
        this.$errorMsg('请输入学生姓名')
        return
      }
      if (!this.studentModel.studentPhone) {
        this.$errorMsg('请选择学生联系方式')
        return
      }
      if (!this.studentModel.address) {
        this.$errorMsg('请输入学生家庭地址')
        return
      }
      if (this.mode === 'add') {
        this.$http({
          url: this.$urlPath.saveStudent,
          data: this.studentModel
        }).then(res => {
          this.dialogFormVisible = false
          this.$successMsg('学生添加成功')
          this.getData()
        })
      } else {
        this.$http({
          url: this.$urlPath.updateStudent,
          data: this.studentModel
        }).then(res => {
          this.dialogFormVisible = false
          this.$successMsg('学生信息修改成功')
          this.getData()
        })
      }
    },
    initPassword(item) {
      this.$warningConfirm('是否要重新设置密码为手机号后六位？', _ => {
        this.$http({
          url: this.$urlPath.initStudentPassword,
          data: {
            studentId: item.studentId,
            studentPhone: item.studentPhone
          }
        }).then(res => {
          this.$successMsg('密码重置成功')
        })
      })
    },
    assginTextbook(item) {
      this.$router.push({
        name: 'GrantTextBookToStudent',
        params: {
          studentId: item.studentId
        }
      })
    }
  }
}
</script>
