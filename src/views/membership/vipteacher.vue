<!--
 * @Author: your name
 * @Date: 2020-06-13 10:34:43
 * @LastEditTime: 2020-06-13 17:16:51
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /YXYX_NEW/src/views/membership/vipteacher.vue
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
          label="序号"
          fixed="left"
        >
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="老师姓名"
          prop="username"
          fixed="left"
        />
        <el-table-column
          align="center"
          label="手机号码"
          prop="phone"
          width="120"
        />
        <el-table-column
          align="center"
          prop="roles[0].roleName"
          label="老师角色"
          width="100"
        />
        <el-table-column
          align="center"
          label="性别"
        >
          <template slot-scope="scope">{{
            scope.row.sex === 1 ? "男" : "女"
          }}</template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="isSchoolLeader"
          label="是否校长"
          show-overflow-tooltip
        >
          <template slot-scope="scope">{{
            scope.row.isSchoolLeader === 1 ? "是" : "否"
          }}</template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="isSalesLeader"
          label="是否主管"
          show-overflow-tooltip
        >
          <template slot-scope="scope">{{
            scope.row.isSalesLeader === 1 ? "是" : "否"
          }}</template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="address"
          label="家庭地址"
          width="150"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <div class="text-cut">
              {{ scope.row.address ? scope.row.address : "暂无" }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="isLock"
          label="状态"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <table-status :status="statusFormat(scope.row)" />
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="创建时间"
          prop="createTime"
          width="170"
        >
          <template slot-scope="scope">{{
            scope.row.createTime | parseTime
          }}</template>
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
              :type="scope.row.isLock === 0 ? 'danger' : 'warning'"
              @click="
                changeLockStatus({
                  item: scope.row,
                  statusField: 'isLock',
                  data: { userId: scope.row.userId },
                  lockUrl: $urlPath.lockTeacher,
                  unLockUrl: $urlPath.unLockTeacher
                })
              "
            >{{ scope.row.isLock === 0 ? "禁用" : "解锁" }}</el-button>
            <el-button
              :size="$style.tableButtonSize"
              type="primary"
              @click="hanlderUpdate(scope.row)"
            >编辑</el-button>
            <el-dropdown
              v-if="$store.getters.roleId !== 12"
              style="display: inline-block; margin-left: 10px"
              :size="$style.tableButtonSize"
              type="success"
              split-button
              @command="handleTeacherCommand"
            >
              更多
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :command="{tag: 1, item: scope.row}">重置密码</el-dropdown-item>
                <el-dropdown-item :command="{tag: 2, item: scope.row}">分配按钮</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-button
              v-else
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
    <!-- 增加老师对话框 -->
    <el-dialog
      :title="mode === 'add' ? '添加老师' : '编辑老师信息'"
      :visible.sync="dialogFormVisible"
      top="10vh"
    >
      <el-form class="dialog-container">
        <el-form-item label="学校名称">
          <el-col :span="$style.dialogColSpan">
            <el-select
              v-model="teacherModel.schoolId"
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
        <el-form-item label="老师角色">
          <el-col :span="$style.dialogColSpan">
            <el-select
              v-model="teacherModel.roleId"
              style="width: 100%"
              class="filter-item"
              placeholder="请选择老师角色"
              @change="selectTeacher"
            >
              <el-option
                v-for="item of roleList"
                :key="item.roleId"
                :label="item.roleName"
                :value="item.roleId"
              />
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="老师名称">
          <el-col :span="$style.dialogColSpan">
            <el-input
              v-model="teacherModel.userName"
              placeholder="请输入老师姓名（必填）"
              maxlength="6"
            />
          </el-col>
        </el-form-item>
        <el-form-item label="手机号码">
          <el-col :span="$style.dialogColSpan">
            <el-input
              v-model="teacherModel.phone"
              placeholder="请输入老师手机号码（必填）"
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
              v-model="teacherModel.address"
              type="textarea"
              :rows="3"
              maxlength="100"
              placeholder="请输入老师家庭住址（必填）"
            />
          </el-col>
        </el-form-item>
        <el-form-item label="是否校长">
          <el-col :span="$style.dialogColSpan">
            <el-radio-group
              v-model="teacherModel.isSchoolLeader"
              disabled
            >
              <el-radio :label="0">否</el-radio>
              <el-radio :label="1">是</el-radio>
            </el-radio-group>
          </el-col>
        </el-form-item>
        <el-form-item label="老师性别">
          <el-col :span="$style.dialogColSpan">
            <el-radio-group v-model="teacherModel.sex">
              <el-radio :label="1">男</el-radio>
              <el-radio :label="0">女</el-radio>
            </el-radio-group>
          </el-col>
        </el-form-item>
        <el-form-item label="用户状态">
          <el-col :span="$style.dialogColSpan">
            <el-radio-group v-model="teacherModel.isLock">
              <el-radio :label="0">正常</el-radio>
              <el-radio :label="1">禁用</el-radio>
            </el-radio-group>
          </el-col>
        </el-form-item>
        <el-form-item
          v-if="mode === 'edit'"
          label="备注说明"
        >
          <el-col :span="$style.dialogColSpan">
            <el-input
              v-model="teacherModel.note"
              type="textarea"
              :rows="3"
              maxlength="100"
              placeholder="请输入备注说明"
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
          @click="dialogFormVisible = false"
        >取消</el-button>
        <el-button
          :size="$style.dialogButtonSize"
          type="primary"
          @click="handlerFormConfirm"
        >确定</el-button>
      </div>
    </el-dialog>
    <!-- 增加老师对话框 -->
  </div>
</template>

<script>
import tableMixins from '../../mixins/table-mixins'
import { isvalidPhone } from '../../utils/validate'
import schoolMixins from '../../mixins/school-mixins'
import userMixins from '../../mixins/user-mixins'
export default {
  name: 'VIPTeacher',
  mixins: [tableMixins, schoolMixins, userMixins],
  data() {
    return {
      schoolList: [],
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
          label: '状态',
          name: 'isLock',
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
          label: '姓名',
          name: 'userName',
          span: 5,
          type: 'input'
        },
        {
          id: 4,
          value: '',
          label: '手机号码',
          name: 'phone',
          span: 5,
          type: 'input'
        }
      ],
      teacherModel: {
        schoolId: '', // 学校ID
        userName: '', // 老师姓名
        phone: '', // 老师手机(默认登录密码为手机号后6位)
        address: '', // 家庭住址
        sex: 1, // 性别，1男 0女
        isLock: 0, // 状态，0正常 1禁用
        isSchoolLeader: 0, // 是否校长 0否 1是
        roleId: '', // 角色id
        note: ''
      },
      dialogFormVisible: false,
      mode: 'add',
      selectTeacherId: 0
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
    this.getRoleList()
  },
  methods: {
    initData() {
      this.likeSearchUrl = this.$urlPath.queryTeacherListLike
    },
    statusFormat(item) {
      return {
        label: item.isLock === 0 ? '正常' : '禁用',
        type: item.isLock === 0 ? 'primary' : 'danger'
      }
    },
    getData() {
      this.$http({
        url: this.$urlPath.queryTeacherList,
        methods: this.HTTP_GET,
        data: {
          pageNum: this.page,
          pageSize: this.pageSize,
          schoolId: this.$store.getters.schoolId
        },
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
      if (!this.checkButtonPermission('add')) {
        return
      }
      this.dialogFormVisible = true
      this.mode = 'add'
      this.teacherModel = {
        schoolId: '',
        roleId: '',
        userName: '',
        phone: '',
        address: '',
        isSchoolLeader: 0,
        sex: 1,
        isLock: 0
      }
    },
    selectTeacher(val) {
      this.selectTeacherId = val
      if (val === 12) { // 12代表着是校长，当选择校长的时候，下面的单选框不能再变了
        this.teacherModel.isSchoolLeader = 1
      } else {
        this.teacherModel.isSchoolLeader = 0
      }
    },
    hanlderUpdate(item) {
      if (!this.checkButtonPermission('edit')) {
        return
      }
      this.dialogFormVisible = true
      this.mode = 'edit'
      this.teacherModel.schoolId = item.schoolId
      this.teacherModel.roleId = item.roleId
      this.teacherModel.userName = item.username
      this.teacherModel.phone = item.phone
      this.teacherModel.address = item.address
      this.teacherModel.sex = item.sex
      this.teacherModel.isSchoolLeader = item.isSchoolLeader
      this.teacherModel.isLock = item.isLock
      this.teacherModel.note = item.note
    },
    handlerFormConfirm() {
      if (!this.teacherModel.schoolId) {
        this.$errorMsg('请选择学校')
        return
      }
      if (!this.teacherModel.userName) {
        this.$errorMsg('请输入老师名称')
        return
      }
      if (!this.teacherModel.phone) {
        this.$errorMsg('请输入老师手机号码')
        return
      }
      if (!isvalidPhone(this.teacherModel.phone)) {
        this.$errorMsg('请输入合法的老师手机号码')
        return
      }
      if (!this.teacherModel.address) {
        this.$errorMsg('请输入老师家庭地址')
        return
      }
      if (this.mode === 'add') {
        this.checkPhoneIsExist(this.teacherModel.phone, res => {
          if (res.obj === 1) { // 手机号已经存在
            this.$errorMsg('该手机号已经存在')
          } else {
            this.$http({
              url: this.$urlPath.saveTeacher,
              data: this.teacherModel,
              withRoleId: false,
              withUserId: false
            }).then(res => {
              this.dialogFormVisible = false
              this.$successMsg('添加成功')
              this.getData()
            })
          }
        })
      } else {
        this.$http({
          url: this.$urlPath.updateTeacher,
          data: this.teacherModel
        }).then(res => {
          this.dialogFormVisible = false
          this.$successMsg('修改成功')
          this.getData()
        })
      }
    },
    handleTeacherCommand({ tag, item }) {
      switch (tag) {
        case 1:
          this.initPassword(item)
          break
        case 2:
          this.grantMenuButton(item)
          break
      }
    },
    initPassword(item) {
      if (!this.checkButtonPermission('reset_pwd')) {
        return
      }
      this.$warningConfirm('是否要重新设置密码为手机号后六位？', _ => {
        this.$http({
          url: this.$urlPath.initPassword,
          data: {
            userId: item.userId,
            phone: item.phone
          }
        }).then(res => {
          this.$successMsg('密码重置成功')
        })
      })
    },
    grantMenuButton(item) {
      if (!this.checkButtonPermission('dis_teacher_btn')) {
        return
      }
      this.$router.push({
        name: 'GrantMenuButton',
        params: {
          userId: item.userId,
          roleId: item.roleId
        }
      })
    }
  }
}
</script>
