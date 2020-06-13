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
      title="查询内容"
      :form-model-array="formModelArray"
      :show-search="true"
      :show-add="true"
      :show-delete="false"
      @onadd="onAdd"
      @onsearch="onSearch($urlPath.queryStudentListLike)"
    />
    <el-card :body-style="{padding: '2px'}">
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
        <el-table-column align="center" label="学校名称" prop="schoolName" />
        <el-table-column align="center" label="账号" prop="schoolTel" />
        <el-table-column align="center" label="管理员">
          <template slot-scope="scope">{{ scope.row.schoolLeaderName | emptyFormat }}</template>
        </el-table-column>
        <el-table-column align="center" label="联系方式" prop="schoolTel" />
        <el-table-column align="center" label="地区" show-overflow-tooltip>
          <template slot-scope="scope">
            <span
              class="text-cut"
            >{{ scope.row.province + '/' + scope.row.city + '/' + scope.row.area }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="详细地址" prop="addressDetail" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="text-cut">{{ scope.row.addressDetail }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="创建时间" prop="createTime">
          <template slot-scope="scope">{{ scope.row.createTime | parseTime }}</template>
        </el-table-column>
        <el-table-column align="center" label="到期时间">
          <template slot-scope="scope">{{ scope.row.endTime | parseTime }}</template>
        </el-table-column>
        <el-table-column align="center" label="状态" prop="status" />
        <el-table-column align="center" label="操作" fixed="right" min-width="150">
          <template slot-scope="scope">
            <el-button
              :size="$style.tableButtonSize"
              :type="scope.row.status === 0 ? 'danger' : 'warning'"
              @click="changeLockStatus(scope.row)"
            >{{ scope.row.status === 0 ? '禁用' : '正常' }}</el-button>
            <el-button
              :size="$style.tableButtonSize"
              type="primary"
              @click="initPassword(scope.row)"
            >重置密码</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <table-foot
      :total="total"
      :page-size="pageSize"
      @prev-click="prevClick"
      @next-click="nextClick"
      @current-change="currentChange"
      @refresh="reloadData"
    />
    <!-- 增加学生对话框 -->
    <el-dialog :title="mode === 'add' ? '添加学生' : '编辑学生信息'" :visible.sync="dialogFormVisible">
      <el-form label-position="right" label-width="120px" style="width: 90%; ">
        <el-form-item label="学校名称">
          <el-col :span="24">
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
          <el-col :span="24">
            <el-select
              v-model="studentModel.schoolId"
              style="width: 100%"
              class="filter-item"
              placeholder="请选择班级名称"
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
        <el-form-item label="学生姓名">
          <el-col :span="24">
            <el-input v-model="studentModel.studentName" placeholder="请输入学生姓名（必填）" maxlength="6" />
          </el-col>
        </el-form-item>
        <el-form-item label="手机号码">
          <el-col :span="24">
            <el-input v-model="studentModel.studentPhone" placeholder="请输入手机号码（必填）" maxlength="11" />
          </el-col>
        </el-form-item>
        <el-form-item label="登录密码">
          <el-col :span="24">
            <el-link :underline="false" type="danger">默认密码为手机号码的后六位</el-link>
          </el-col>
        </el-form-item>
        <el-form-item label="家庭住址">
          <el-col :span="24">
            <el-input v-model="studentModel.address" type="textarea" :rows="3" maxlength="100" placeholder="请输入家庭住址（必填）" />
          </el-col>
        </el-form-item>
        <el-form-item label="学生性别">
          <el-col :span="24">
            <el-radio-group v-model="studentModel.sex">
              <el-radio :label="0">男</el-radio>
              <el-radio :label="1">女</el-radio>
            </el-radio-group>
          </el-col>
        </el-form-item>
        <el-form-item label="学生属性">
          <el-col :span="24">
            <el-radio-group v-model="studentModel.isTeacher">
              <el-radio :label="0">普通学生</el-radio>
              <el-radio :label="1">老师</el-radio>
            </el-radio-group>
          </el-col>
        </el-form-item>
        <el-form-item label="是否线上">
          <el-col :span="24">
            <el-radio-group v-model="studentModel.isOnLine">
              <el-radio :label="0">否</el-radio>
              <el-radio :label="1">是</el-radio>
            </el-radio-group>
          </el-col>
        </el-form-item>
        <el-form-item label="学生状态">
          <el-col :span="24">
            <el-radio-group v-model="studentModel.status">
              <el-radio :label="0">正常</el-radio>
              <el-radio :label="1">禁用</el-radio>
            </el-radio-group>
          </el-col>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :size="$style.dialogButtonSize" @click="dialogFormVisible = false">取消</el-button>
        <el-button :size="$style.dialogButtonSize" type="primary" @click="handlerFormConfirm">确定</el-button>
      </div>
    </el-dialog>
    <!-- 增加班级对话框 -->
  </div>
</template>

<script>
import tableMixins from '../../mixins/table-mixins'
import schoolMixins from '../../mixins/school-mixins'
export default {
  name: 'VipClass',
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
          selectOptions: [
            {
              label: '正常',
              value: 0
            },
            {
              label: '禁用',
              value: 1
            }
          ]
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
          label: '学生联系方式',
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
        isOnLine: 0, // 是否线上 0否 1是，和学校线上线下一致
        status: 0 // 状态，0正常 1禁用
      }
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
  },
  methods: {
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
      }).then(res => {
        this.onSuccess(res.obj)
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
        isOnLine: 0, // 是否线上 0否 1是，和学校线上线下一致
        status: 0 // 状态，0正常 1禁用
      }
    },
    handlerUpdate(item) {
      this.dialogFormVisible = true
      this.mode = 'edit'
      this.classModel.classId = item.classId
      this.classModel.schoolId = item.schoolId
      this.classModel.classLevel = item.classLevel
      this.classModel.className = item.className
      this.classModel.classLeaderId = item.classLeaderId
      this.classModel.classLeaderName = item.classLeaderName
      this.classModel.status = item.status
      this.classModel.note = item.note
    },
    handlerFormConfirm() {
      if (!this.classModel.schoolId) {
        this.$errorMsg('请选择学校')
        return
      }
      if (!this.classModel.classLevel) {
        this.$errorMsg('请输入年级名称')
        return
      }
      if (!this.classModel.className) {
        this.$errorMsg('请输入班级名称')
        return
      }
      if (!this.classModel.classLeaderId) {
        this.$errorMsg('请选择班级负责人')
        return
      }
      if (!this.classModel.classLeaderName) {
        this.$errorMsg('请输入班级负责人姓名')
        return
      }
      if (this.mode === 'add') {
        this.$http({
          url: this.$urlPath.saveSchoolClass,
          data: this.classModel
        }).then(res => {
          this.$successMsg('班级添加成功')
          this.getData()
        })
      } else {
        this.$http({
          url: this.$urlPath.editSchoolClass,
          data: this.classModel
        }).then(res => {
          this.$successMsg('班级信息修改成功')
          this.getData()
        })
      }
    }
  }
}
</script>

