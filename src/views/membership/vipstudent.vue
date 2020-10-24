<template>
  <div class="container">
    <table-header
      ref="tableHeader"
      title="查询内容"
      :form-model-array="formModelArray"
      :show-search="true"
      :show-add="isSuperAdmin || !isOnLineSchool"
      :show-delete="false"
      :can-collapse="true"
      @onadd="onAdd"
      @onsearch="onSearch"
      @table-header-collapse="onCollapsed"
    />
    <el-card
      ref="tableContainer"
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
        :height="tableConfig.style.myHeight"
      >
        <el-table-column
          align="center"
          label="序号"
          fixed="left"
        >
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="学生姓名"
          prop="studentName"
          width="120"
        />
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
          width="100"
        >
          <template slot-scope="scope">
            <div v-if="scope.row.isTeacher === 6">
              <el-tag
                type="warning"
                size="mini"
                effect="dark"
              >特殊用户</el-tag>
            </div>
            <div v-else>
              <el-tag
                :type="scope.row.isOnLine === 1 ? 'primary' : 'success'"
                size="mini"
                effect="dark"
              >{{ scope.row.isOnLine === 1 ? "线上" : "线下" }}</el-tag>
            </div>
            <!-- 线下用户或者是特殊用户都可以分配教材 -->
            <el-link
              v-if="scope.row.isOnLine === 0 || scope.row.isTeacher === 6"
              style="font-size: 14px"
              type="danger"
              @click.native="assginTextbook(scope.row)"
            >分配教材</el-link>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="学生属性"
          width="100"
        >
          <template slot-scope="scope">{{ studentTypeStatus(scope.row) }}</template>
        </el-table-column>
        <el-table-column
          align="center"
          label="家庭地址"
          prop="address"
          width="200"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <div>{{ scope.row.address || '----' }}</div>
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
        <el-table-column
          align="center"
          label="视频状态"
        >
          <template slot-scope="scope">
            <table-status :status="jumpVideoStatus(scope.row)" />
          </template>
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
          width="120"
        >
          <template slot-scope="scope">
            <el-dropdown
              split-button
              type="danger"
              size="mini"
              @command="handler"
            >
              操作
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :command="{type: 0, item: scope.row}">{{ scope.row.status === 0 ? "禁用" : "正常" }}</el-dropdown-item>
                <el-dropdown-item :command="{type: 1, item: scope.row}">编辑</el-dropdown-item>
                <el-dropdown-item :command="{type: 2, item: scope.row}">重置密码</el-dropdown-item>
                <el-dropdown-item :command="{type: 3, item: scope.row}">查看陪伴号</el-dropdown-item>
                <el-dropdown-item :command="{type: 4, item: scope.row}">{{ scope.row.isJumpVideo === 0 ? "跳过视频" : "恢复视频" }}</el-dropdown-item>
                <el-dropdown-item
                  v-if="scope.row.isOnLine === 1"
                  :command="{type: 5, item: scope.row}"
                >查看已分配的学习卡</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
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
      width="60%"
      top="10vh"
    >
      <el-form class="dialog-container">
        <el-form-item label="学校名称">
          <el-col :span="$style.dialogColSpan">
            <el-select
              v-model="studentModel.schoolId"
              :disabled="mode === 'edit'"
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
            <div v-show="isOnLineSchoolTip">
              <el-link type="danger">{{ isOnLineSchoolTip }}</el-link>
            </div>
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
                v-for="item of myClassList"
                :key="item.classId"
                :label="item.className"
                :value="item.classId"
              />
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item
          v-if="isSuperAdmin"
          label="学生属性"
        >
          <el-col :span="$style.dialogColSpan">
            <el-radio-group v-model="studentModel.isTeacher">
              <el-radio
                v-for="item of tempStudentTypes"
                :key="item.value"
                :label="item.value"
                :disabled="!item.isEnable"
              >{{ item.label }}</el-radio>
            </el-radio-group>
            <span class="text-red margin-left">（注：请谨慎选择账号类型）</span>
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
              :readonly="mode === 'edit'"
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
    <!-- 增加学生对话框 -->
    <!-- 查看陪伴号对话框 -->
    <el-dialog
      title="陪伴账号"
      :visible.sync="dialogCompanyVisible"
    >
      <el-form class="dialog-container">
        <el-form-item label="账号名称">
          <el-col :span="$style.dialogColSpan">
            <el-link type="danger">{{ companyItem ? companyItem.studentName : '' }}</el-link>
          </el-col>
        </el-form-item>
        <el-form-item label="手机号码">
          <el-col :span="$style.dialogColSpan">
            <el-link type="danger">{{ companyItem ? companyItem.studentPhone : '' }}</el-link>
          </el-col>
        </el-form-item>
        <el-form-item label="家庭地址">
          <el-col :span="$style.dialogColSpan">
            <el-link type="danger">{{ companyItem ? companyItem.address : '' }}</el-link>
          </el-col>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          :size="$style.dialogButtonSize"
          type="primary"
          @click="dialogCompanyVisible = false"
        >知道了</el-button>
      </div>
    </el-dialog>
    <!-- 查看陪伴号对话框 -->

    <!-- 查看线上学生已经分配的学习卡 -->
    <el-drawer
      :visible.sync="openDrawer"
      direction="rtl"
      :with-header="false"
      size="60%"
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
          v-loading="studyCardListLoading"
          :stripe="tableConfig.stripe"
          :header-cell-style="tableConfig.headerCellStyle"
          :data="studyCardList"
          :border="tableConfig.border"
          :size="tableConfig.size"
          :default-sort="tableConfig.defalutSort"
          :style="tableConfig.style"
          height="90vh"
        >
          <el-table-column
            align="center"
            label="学习卡编码"
            prop="className"
            width="120"
          >
            <template slot-scope="scope">
              <div>{{ scope.row.cardType + scope.row.cardCode }}</div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="二维码"
            prop="className"
          >
            <template slot-scope="scope">
              <el-link
                type="primary"
                @click="showQrcode(scope.row.cardErcode)"
              >{{ scope.row.cardErcode }}</el-link>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="有效期（月）"
            prop="validityMonth"
            width="100"
          />
          <el-table-column
            align="center"
            label="到期日期"
            prop="endTime"
            width="100"
          />
        </el-table>
      </div>
    </el-drawer>
    <!-- 查看线上学生已经分配的学习卡 -->
    <Qrcode ref="qrcode" />
  </div>
</template>

<script>
import tableMixins from '../../mixins/table-mixins'
import schoolMixins from '../../mixins/school-mixins'
import userMixins from '../../mixins/user-mixins'
import { isvalidPhone } from '../../utils/validate'
export default {
  name: 'VIPStudent',
  mixins: [tableMixins, schoolMixins, userMixins],
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
        }
      ],
      studentTypes: [
        {
          label: '线上非VIP',
          value: 0,
          group: 1,
          isEnable: false
        },
        {
          label: '陪伴号',
          value: 1,
          group: 1,
          isEnable: false
        },
        {
          label: '线上VIP',
          value: 2,
          group: 1,
          isEnable: false
        },
        {
          label: '校长',
          value: 3,
          group: 2,
          isEnable: true
        },
        // {
        //   label: '老师',
        //   value: 4,
        //   group: 2,
        //   isEnable: true
        // },
        {
          label: '线下学生',
          value: 5,
          group: 0,
          isEnable: true
        },
        {
          label: '特殊用户',
          value: 6,
          group: 2,
          isEnable: true
        }
      ],
      tempStudentTypes: [],
      dialogFormVisible: false,
      mode: 'add',
      studentModel: {
        schoolId: '', // 学校ID
        classId: '', // 班级ID
        studentName: '', // 学生姓名
        studentPhone: '', // 学生联系方式(登录密码为手机号后6位)
        address: '', // 家庭地址
        sex: 0, // 性别 0男 1女
        isTeacher: 5, // 学生属性 0普通学生 1老师
        isOnLine: 1, // 是否线上 0否 1是，和学校线上线下一致
        status: 0 // 状态，0正常 1禁用
      },
      dialogTableVisible: false,
      textbookList: [],
      tempWacherItem: {},
      myClassList: [],
      isOnLineSchoolTip: '',
      dialogCompanyVisible: false,
      companyItem: null,
      openDrawer: false,
      studyCardList: [],
      studyCardListLoading: false
    }
  },
  watch: {
    'tempWacherItem.value'(newVal, oldVal) {
      if (newVal) {
        this.getClassListBySchoolId(_ => {
          if (this.classList && this.classList.length > 0) {
            this.formModelArray[1].selectOptions = this.classList.map(it => {
              return {
                label: it.className,
                value: it.classId
              }
            })
          }
        }, newVal)
      } else {
        this.classList = []
        this.formModelArray[1].selectOptions = []
        this.formModelArray[1].value = ''
      }
    },
    'studentModel.schoolId'(newVal, oldVal) {
      if (newVal) {
        const schoolItem = this.schoolList.find(it => it.schoolId === newVal)
        this.studentModel.isOnLine = schoolItem.isOnLine
        this.isOnLineSchoolTip = schoolItem.isOnLine === 1 ? '当前学校为线上学校' : '当前学校为线下学校'
        this.tempStudentTypes = this.studentTypes.filter(it => it.group === schoolItem.isOnLine || it.group === 2)
        if (schoolItem.isOnLine === 1) {
          this.tempStudentTypes.forEach(it => { it.isEnable = it.value === 3 || it.value === 6 })
        } else {
          this.tempStudentTypes.forEach(it => { it.isEnable = true })
        }
        this.getMyCalssList(newVal)
      } else {
        this.isOnLineSchoolTip = ''
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
        this.tempWacherItem = this.formModelArray[0]
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
    jumpVideoStatus(item) {
      return {
        label: item.isJumpVideo === 0 ? '未跳过' : '已跳过',
        type: item.isJumpVideo === 0 ? 'primary' : 'danger'
      }
    },
    studentTypeStatus(item) {
      switch (item.isTeacher) {
        case 0:
          return '线上非VIP'
        case 1:
          return '陪伴号'
        case 2:
          return '线上VIP'
        case 3:
          return '校长'
        case 4:
          return '老师'
        case 5:
          return '线下学生'
        case 6:
          return '特殊用户'
      }
    },
    getMyCalssList(schoolId = this.$store.getters.schoolId) {
      this.$showLoading(closeLoading => {
        this.myClassList = []
        this.$http({
          url: this.$urlPath.querySchoolClassBySchool,
          methods: this.HTTP_GET,
          data: {
            schoolId
          }
        }).then(res => {
          closeLoading()
          this.myClassList = res.obj
          if (this.myClassList) {
            if (!this.myClassList.find(it => it.classId === this.studentModel.classId)) {
              this.studentModel.classId = ''
            }
          }
        }).catch(_ => {
          closeLoading()
        })
      })
    },
    getData() {
      this.$http({
        url: this.$urlPath.queryStudentList,
        methods: this.HTTP_GET,
        data: {
          pageNum: this.page,
          pageSize: this.pageSize,
          schoolId: this.$store.getters.schoolId
        }
      })
        .then(res => {
          this.onSuccess(res.obj)
        })
        .catch(error => {
          this.onError(error)
        })
    },
    showQrcode(code) {
      this.$refs.qrcode.show(code)
    },
    onAdd() {
      if (!this.checkButtonPermission('add')) {
        return
      }
      this.dialogFormVisible = true
      this.mode = 'add'
      this.studentModel = {
        schoolId: '', // 学校ID
        classId: '', // 班级ID
        studentName: '', // 学生姓名
        studentPhone: '', // 学生联系方式(登录密码为手机号后6位)
        address: '', // 家庭地址
        sex: 0, // 性别 0男 1女
        isTeacher: 5, // 学生属性 0普通学生 1老师
        isOnLine: 1, // 是否线上 0否 1是，和学校线上线下一致
        status: 0 // 状态，0正常 1禁用
      }
    },
    handler({ type, item }) {
      switch (type) {
        case 0:
          this.changeLockStatus({
            item,
            statusField: 'status',
            data: { studentId: item.studentId },
            lockUrl: this.$urlPath.lockStudent,
            unLockUrl: this.$urlPath.unLockStudent
          })
          break
        case 1:
          this.handlerUpdate(item)
          break
        case 2:
          this.initPassword(item)
          break
        case 3:
          this.company(item)
          break
        case 4:
          this.hanlderJumpVideo(item)
          break
        case 5:
          if (item.isOnLine !== 1) {
            this.$errorMsg('只有线上学生才生查看学习卡列表')
            return
          }
          this.openDrawer = true
          this.studyCardListLoading = true
          this.$http({
            url: this.$urlPath.queryStudentStudyCardList,
            methods: this.HTTP_GET,
            data: {
              studentId: item.studentId
            }
          }).then(res => {
            this.studyCardListLoading = false
            this.studyCardList = res.obj
          }).catch(_ => {
            this.studyCardListLoading = false
          })
          break
      }
    },
    hanlderJumpVideo(item) {
      if (!this.checkButtonPermission('set_jump_video')) {
        return
      }
      this.$warningConfirm(`是否要设置此学生${item.isJumpVideo === 0 ? '跳过' : '恢复'}视频功能？`, () => {
        this.$showLoading(closeLoading => {
          this.$http({
            url: this.$urlPath.updateStudentIsJumpVideo,
            data: {
              studentId: item.studentId,
              isJumpVideo: item.isJumpVideo === 0 ? 1 : 0
            }
          }).then(res => {
            this.$successMsg('设置成功')
            closeLoading()
            item.isJumpVideo = item.isJumpVideo === 0 ? 1 : 0
          }).catch(_ => {
            closeLoading()
          })
        })
      })
    },
    handlerUpdate(item) {
      if (!this.checkButtonPermission('edit')) {
        return
      }
      this.tempStudentTypes = this.studentTypes.filter(it => it.group === item.isOnLine || it.group === 2)
      this.tempStudentTypes.forEach(it => { it.isEnable = item.isOnLine !== 1 })
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
      if (this.mode === 'add') {
        if (!this.studentModel.schoolId) {
          this.$errorMsg('请选择学校')
          return
        }
        if (!this.studentModel.classId) {
          this.$errorMsg('请输入年级名称')
          return
        }
      }
      if (!this.studentModel.studentName) {
        this.$errorMsg('请输入学生姓名')
        return
      }
      if (!this.studentModel.studentPhone) {
        this.$errorMsg('请选择学生联系方式')
        return
      }
      if (!isvalidPhone(this.studentModel.studentPhone)) {
        this.$errorMsg('请输入合法的手机号码')
        return
      }
      if (!this.studentModel.address) {
        this.$errorMsg('请输入学生家庭地址')
        return
      }
      if (!this.isSuperAdmin) {
        delete this.studentModel.isTeacher
      }
      if (this.mode === 'add') {
        this.$http({
          url: this.$urlPath.saveStudent,
          data: this.studentModel
        }).then(res => {
          this.dialogFormVisible = false
          this.isOnLineSchoolTip = ''
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
      if (!this.checkButtonPermission('reset_stu_pwd')) {
        return
      }
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
      if (!this.checkButtonPermission('gra_off_stu_mat')) {
        return
      }
      this.$router.push({
        name: 'GrantTextBookToStudent',
        params: {
          studentId: item.studentId
        }
      })
    },
    company(item) {
      this.$showLoading(closeLoading => {
        this.$http({
          url: this.$urlPath.queryStudentCompanion,
          methods: this.HTTP_GET,
          data: {
            studentId: item.studentId,
            isTeacher: item.isTeacher,
            isOnLine: item.isOnLine
          }
        }).then(res => {
          closeLoading()
          this.companyItem = res.obj[0]
          this.dialogCompanyVisible = true
        }).catch(_ => {
          closeLoading()
        })
      })
    }
  }
}
</script>
