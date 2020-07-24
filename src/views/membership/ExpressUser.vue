<template>
  <div class="container">
    <table-header
      v-if="isSuperAdmin || !isOnLineSchool"
      ref="tableHeader"
      title="基本操作"
      :show-search="false"
      :show-add="true"
      :show-delete="false"
      @onadd="onAdd"
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
          label="序号"
          fixed="left"
          width="55"
        >
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="账号"
          prop="studentNo"
          fixed="left"
        />
        <el-table-column
          align="center"
          label="所属学校"
          prop="school.schoolName"
        />
        <el-table-column
          align="center"
          prop="isLock"
          label="状态"
        >
          <template slot-scope="scope">
            <table-status :status="statusFormat(scope.row)" />
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="创建时间"
          prop="createTime"
        >
          <template slot-scope="scope">{{
            scope.row.createTime | parseTime
          }}</template>
        </el-table-column>
        <el-table-column
          align="center"
          label="到期时间"
        >
          <template slot-scope="scope">
            <div v-if="scope.row.endTime">{{ scope.row.endTime | parseTime }}</div>
            <div v-else>--</div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="操作"
          fixed="right"
          width="220"
        >
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.status === 0"
              :size="$style.tableButtonSize"
              type="danger"
              @click="disableAccount(scope.row)"
            >禁用</el-button>
            <el-dropdown
              v-if="scope.row.status === 1"
              style="display: inline-block; margin-left: 10px"
              :size="$style.tableButtonSize"
              type="primary"
              split-button
              @command="handleActivityAccountCommand"
            >
              激活
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :command="{tag: 3, item: scope.row}">三天</el-dropdown-item>
                <el-dropdown-item :command="{tag: 5, item: scope.row}">五天</el-dropdown-item>
                <el-dropdown-item :command="{tag: 7, item: scope.row}">七天</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-dropdown
              v-if="isSuperAdmin"
              style="display: inline-block; margin-left: 10px"
              :size="$style.tableButtonSize"
              type="success"
              split-button
              @command="handleExpressUserCommand"
            >
              更多
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :command="{tag: 1, item: scope.row}">编辑教材</el-dropdown-item>
                <el-dropdown-item :command="{tag: 2, item: scope.row}">延长时间</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-button
              v-else
              :size="$style.tableButtonSize"
              type="success"
              @click="editTextBook(scope.row)"
            >
              编辑教材
            </el-button>
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
    <!-- 添加体验账号对话框 -->
    <el-dialog
      title="添加体验账号"
      :visible.sync="dialogFormVisible"
    >
      <el-form class="dialog-container">
        <el-form-item label="学校名称">
          <el-col :span="$style.dialogColSpan">
            <el-select
              v-model="addExpressUserModel.schoolId"
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
        <el-form-item label="账户数量">
          <el-col :span="$style.dialogColSpan">
            <el-input-number
              v-model="addExpressUserModel.experNum"
              :min="1"
              :max="100"
              style="width: 100%"
            />
          </el-col>
        </el-form-item>
        <el-form-item label="选择教材">
          <el-col :span="$style.dialogColSpan">
            <el-select
              v-model="addExpressUserModel.textbookIds"
              style="width: 100%"
              class="filter-item"
              placeholder="请选择教材"
              multiple
            >
              <el-option
                v-for="item of textBookList"
                :key="item.textbookId"
                :label="item.textbookName"
                :value="item.textbookId"
              />
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="教材数量">
          <el-col :span="$style.dialogColSpan">
            <el-input-number
              v-model="addExpressUserModel.textbookNum"
              :min="1"
              :max="10"
              style="width: 80%"
            />
            <el-link :underline="false">校长可授权的</el-link>
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
    <!-- 添加体验账号对话框 -->
    <!-- 编辑教材对话框 -->
    <el-dialog
      title="编辑教材"
      :visible.sync="editTextBookModel.dialogEditTextBookVisible"
    >
      <el-table
        ref="grantTextBookMultiTable"
        v-loading="loading"
        :stripe="tableConfig.stripe"
        :header-cell-style="tableConfig.headerCellStyle"
        :data="editTextBookModel.itemTextBookList"
        :border="tableConfig.border"
        :size="tableConfig.size"
        :default-sort="tableConfig.defalutSort"
        :style="tableConfig.style"
        @selection-change="editTextBookModel.handleSelectionChange"
      >
        <el-table-column
          align="center"
          type="selection"
          fixed="left"
        />
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
          label="教材名称"
          prop="textbookName"
          fixed="left"
        />
        <el-table-column
          align="center"
          label="教材版本"
          prop="textbookVersion"
        />
        <el-table-column
          align="center"
          prop="isLock"
          label="状态"
        >
          <template slot-scope="scope">
            <table-status :status="editTextBookModel.grantStatusFormatter(scope.row)" />
          </template>
        </el-table-column>
      </el-table>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          :size="$style.dialogButtonSize"
          @click="editTextBookModel.dialogEditTextBookVisible = false"
        >取消</el-button>
        <el-button
          :size="$style.dialogButtonSize"
          type="primary"
          @click="handlerEditTextBookConfirm"
        >确定</el-button>
      </div>
    </el-dialog>
    <!-- 添加体验账号对话框 -->
    <!-- 延期对话框 -->
    <el-dialog
      title="延长时间"
      :visible.sync="addTimeModel.dialogAddTimeVisible"
    >
      <el-form class="dialog-container">
        <el-form-item label="选择时间">
          <el-col :span="$style.dialogColSpan">
            <el-date-picker
              v-model="addTimeModel.timeValue"
              type="datetime"
              placeholder="选择日期时间"
              style="width: 100%"
              value-format="timestamp"
              :picker-options="datePickerOptions"
            />
          </el-col>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          :size="$style.dialogButtonSize"
          @click="addTimeModel.dialogAddTimeVisible = false"
        >取消</el-button>
        <el-button
          :size="$style.dialogButtonSize"
          type="primary"
          @click="handlerAddTimeConfirm"
        >确定</el-button>
      </div>
    </el-dialog>
    <!-- 延期对话框 -->
  </div>
</template>

<script>
import tableMixins from '../../mixins/table-mixins'
import userMixins from '../../mixins/user-mixins'
import schoolMixins from '../../mixins/school-mixins'
export default {
  name: 'ExpressUser',
  mixins: [tableMixins, userMixins, schoolMixins],
  data() {
    return {
      addExpressUserModel: {
        isOnline: '', // 线上线下
        schoolId: '', // 学校主键ID
        experNum: 1, // 生成的体验账户数量
        textbookIds: '', // 账号可授权的教材主键，逗号隔开
        textbookNum: 1 // 校长可授权的教材数量
      },
      isOnLineSchoolTip: '',
      dialogFormVisible: false,
      textBookList: [],
      editTextBookModel: {
        tempItem: null,
        dialogEditTextBookVisible: false,
        itemTextBookList: [],
        selectTextBookList: [],
        grantStatusFormatter(item) {
          return { label: item.experTextBookId ? '已绑定' : '未绑定', type: item.experTextBookId ? 'primary' : 'warning' }
        },
        handleSelectionChange: (val) => {
          this.editTextBookModel.selectTextBookList = val
        }
      },
      addTimeModel: {
        dialogAddTimeVisible: false,
        timeValue: ''
      },
      datePickerOptions: {
        disabledDate(date) {
          return date < new Date()
        }
      }
    }
  },
  watch: {
    'addExpressUserModel.schoolId'(newVal, oldVal) {
      if (newVal) {
        const schoolItem = this.schoolList.find(it => it.schoolId === newVal)
        this.addExpressUserModel.isOnline = schoolItem.isOnLine
        this.isOnLineSchoolTip = schoolItem.isOnLine === 1 ? '当前学校为线上学校' : '当前学校为线下学校'
      } else {
        this.isOnLineSchoolTip = ''
      }
    }
  },
  mounted() {
    this.getData()
    if (this.isSuperAdmin) {
      this.getSchoolList()
      this.getExpressTextBookList()
    }
  },
  methods: {
    statusFormat(item) {
      switch (item.status) {
        case 1:
          return { label: '未激活', type: 'warning' }
        case 0:
          return { label: '已激活', type: 'primary' }
        case 2:
          return { label: '已禁用', type: 'danger' }
      }
    },
    onAdd() {
      if (!this.checkButtonPermission('add')) {
        return
      }
      this.dialogFormVisible = true
    },
    getData() {
      this.$http({
        url: this.$urlPath.queryExperience,
        methods: this.HTTP_GET,
        data: {
          pageNum: this.page,
          pageSize: this.pageSize,
          schoolId: this.$store.getters.schoolId
        }
      }).then(res => {
        this.onSuccess(res.obj)
      })
    },
    getExpressTextBookList() {
      this.$http({
        url: this.$urlPath.queryAllExperienceTextBook,
        methods: this.HTTP_GET,
        data: {
          pageNum: 0,
          pageSize: 1000
        }
      }).then(res => {
        this.textBookList = res.obj.list
      })
    },
    handlerFormConfirm() {
      if (!this.addExpressUserModel.schoolId) {
        this.$errorMsg('请选择一个学校')
        return
      }
      if (!this.addExpressUserModel.textbookIds || this.addExpressUserModel.textbookIds.length === 0) {
        this.$errorMsg('请选择教材')
        return
      }
      this.$showLoading(closeLoading => {
        this.$http({
          url: this.$urlPath.createExperience,
          data: {
            isOnline: this.addExpressUserModel.isOnline,
            schoolId: this.addExpressUserModel.schoolId,
            experNum: this.addExpressUserModel.experNum, // 生成的体验账户数量
            textbookIds: this.addExpressUserModel.textbookIds.join(','), // 账号可授权的教材主键，逗号隔开
            textbookNum: this.addExpressUserModel.textbookNum// 校长可授权的教材数量
          }
        }).then(res => {
          this.dialogFormVisible = false
          closeLoading()
          this.$successMsg('添加成功')
          this.getData()
        }).catch(_ => {
          closeLoading()
        })
      })
    },
    getCanGrantTextBookList(item) {
      this.$http({
        url: this.$urlPath.queryExperienceTextBookById,
        methods: this.HTTP_GET,
        data: {
          studentId: item.studentId,
          experTextBookIds: item.experTextBookIds
        }
      }).then(res => {
        this.editTextBookModel.itemTextBookList = res.obj
        this.$nextTick(_ => {
          this.editTextBookModel.itemTextBookList.forEach(it => {
            this.$refs.grantTextBookMultiTable.toggleRowSelection(it, it.experTextBookId !== null)
          })
        })
      })
    },
    disableAccount(item) {
      if (!this.checkButtonPermission('disable')) {
        return
      }
      this.$warningConfirm('是否要禁用此体验账号？', _ => {
        this.$showLoading(closeLoading => {
          this.$http({
            url: this.$urlPath.disableExperStudent,
            data: {
              studentId: item.studentId
            }
          }).then(res => {
            this.$successMsg('禁用成功')
            closeLoading()
            this.getData()
          }).catch(_ => {
            closeLoading()
          })
        })
      })
    },
    handlerEditTextBookConfirm() {
      if (this.editTextBookModel.selectTextBookList.length > this.editTextBookModel.tempItem.textbookNum) {
        this.$errorMsg('当前账号最多只能添加' + this.editTextBookModel.tempItem.textbookNum + '本教材')
        return
      }
      this.$http({
        url: this.$urlPath.grantTextBookToExperience,
        data: {
          studentId: this.editTextBookModel.tempItem.studentId,
          textBookIds: this.editTextBookModel.selectTextBookList.map(it => it.textbookId).join(',')
        }
      }).then(res => {
        this.$successMsg('操作成功')
        this.editTextBookModel.dialogEditTextBookVisible = false
      })
    },
    handleActivityAccountCommand({ tag, item }) {
      if (!this.checkButtonPermission('activate')) {
        return
      }
      this.$warningConfirm('是否要激活此账号，有效期' + tag + '天', _ => {
        this.$http({
          url: this.$urlPath.activationExperience,
          data: {
            studentId: item.studentId,
            endTimeDate: tag
          }
        }).then(res => {
          this.$successMsg('激活成功')
          this.getData()
        })
      })
    },
    handleExpressUserCommand({ tag, item }) {
      switch (tag) {
        case 1:
          this.editTextBook(item)
          return
        case 2:
          if (!this.checkButtonPermission('delayTime')) {
            return
          }
          this.editTextBookModel.tempItem = item
          this.addTimeModel.dialogAddTimeVisible = true
          return
      }
    },
    editTextBook(item) {
      if (!this.checkButtonPermission('edit')) {
        return
      }
      if (item.status !== 1) {
        this.$errorMsg('只有在账号未被激活的状态下可编辑教材')
        return
      }
      this.editTextBookModel.tempItem = item
      this.editTextBookModel.dialogEditTextBookVisible = true
      this.getCanGrantTextBookList(item)
    },
    handlerAddTimeConfirm() {
      if (!this.addTimeModel.timeValue) {
        this.$errorMsg('请选择延长日期')
        return
      }
      this.$showLoading(closeLoading => {
        this.$http({
          url: this.$urlPath.delayExperStudent,
          data: {
            studentId: this.editTextBookModel.tempItem.studentId,
            delayDate: this.addTimeModel.timeValue
          }
        }).then(res => {
          closeLoading()
          this.getData()
          this.addTimeModel.dialogAddTimeVisible = false
        }).catch(_ => {
          closeLoading()
        })
      })
    }
  }
}
</script>
