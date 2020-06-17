<template>
  <div
    class="container"
    style="padding: 2px"
  >
    <table-header
      :form-model-array="formModelArray"
      :show-search="true"
      :show-add="true"
      :show-delete="true"
      @onsearch="onSearch"
      @onadd="onAdd"
      @ondelete="onDelete"
    />
    <el-card :body-style="{padding: 0}">
      <el-table
        v-loading="loading"
        :stripe="tableConfig.stripe"
        :header-cell-style="tableConfig.headerCellStyle"
        :data="tableData"
        :border="tableConfig.border"
        :size="tableConfig.size"
        :default-sort="tableConfig.defalutSort"
        :style="tableConfig.style"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          align="center"
          type="selection"
          width="55"
        />
        <el-table-column
          align="center"
          label="序号"
          prop="userId"
          width="80"
        />
        <el-table-column
          align="center"
          prop="phone"
          label="手机号码"
          width="120"
        />
        <el-table-column
          align="center"
          prop="username"
          label="用户名"
          width
        />
        <el-table-column
          align="center"
          prop="dept.deptName"
          label="所属部门"
          show-overflow-tooltip
        />
        <el-table-column
          align="center"
          prop="roles[0].roleName"
          label="用户角色"
          width="100"
          show-overflow-tooltip
        />
        <el-table-column
          align="center"
          prop="isSchoolLeader"
          label="是否校长"
          show-overflow-tooltip
        >
          <template slot-scope="scope">{{ scope.row.isSchoolLeader === 1 ? '是' : '否' }}</template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="isSalesLeader"
          label="是否主管"
          show-overflow-tooltip
        >
          <template slot-scope="scope">{{ scope.row.isSalesLeader===1?'是':'否' }}</template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="accountNonLocked"
          label="状态"
          show-overflow-tooltip
        >
          <template slot-scope="scope">{{ !!(scope.row.accountNonLocked)?'正常':'禁用' }}</template>
        </el-table-column>
        <el-table-column
          align="center"
          label="操作"
          width="200"
          fixed="right"
        >
          <template slot-scope="scope">
            <el-button
              type="primary"
              :size="$style.tableButtonSize"
              @click="handleUpdate(scope.row)"
            >编辑</el-button>
            <el-button
              type="success"
              :size="$style.tableButtonSize"
              @click="grantMenuButton(scope.row)"
            >分配按钮</el-button>
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
    <el-dialog
      title="编辑信息"
      :visible.sync="dialogFormVisible"
    >
      <el-form>
        <el-form-item label="所属部门">
          <el-col :span="10">
            <el-select
              v-model="tempItem.deptId"
              placeholder="请选择所属部门"
              style="width: 100%"
              @change="onDeptChange"
            >
              <el-option
                v-for="item of deptList"
                :key="item.deptId"
                :label="item.deptName"
                :value="item.deptId"
              />
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="用户角色">
          <el-col :span="10">
            <el-select
              v-model="tempItem.roleId"
              placeholder="请选择用户角色"
              style="width: 100%"
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
        <el-form-item label="是否校长">
          <el-col :span="10">
            <el-radio-group v-model="tempItem.isSchoolLeader">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-col>
        </el-form-item>
        <el-form-item label="是否主管">
          <el-col :span="10">
            <el-radio-group v-model="tempItem.isSalesLeader">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-col>
        </el-form-item>
        <el-form-item label="真实姓名">
          <el-col :span="10">
            <el-input
              v-model="tempItem.userName"
              placeholder="请输入真实姓名（必填）"
              maxlength="10"
            />
          </el-col>
        </el-form-item>
        <el-form-item label="用户昵称">
          <el-col :span="10">
            <el-input
              v-model="tempItem.userNickName"
              placeholder="请输入用户昵称（必填）"
              maxlength="10"
            />
          </el-col>
        </el-form-item>
        <el-form-item label="用户性别">
          <el-col :span="10">
            <el-radio-group v-model="tempItem.sex">
              <el-radio :label="1">男</el-radio>
              <el-radio :label="0">女</el-radio>
            </el-radio-group>
          </el-col>
        </el-form-item>
        <el-form-item label="手机号码">
          <el-col :span="10">
            <el-input
              v-model="tempItem.phone"
              placeholder="请输入手机号码（必填）"
              readonly
            />
          </el-col>
        </el-form-item>
        <el-form-item label="登录密码">
          <el-col :span="10">
            <el-link
              :underline="false"
              type="success"
            >默认密码为手机号码的后六位</el-link>
            <el-link
              :underline="false"
              type="danger"
              @click="resetPassword"
            >重置密码？</el-link>
          </el-col>
        </el-form-item>
        <el-form-item label="详细地址">
          <el-col :span="10">
            <el-input
              v-model="tempItem.address"
              type="textarea"
              :rows="2"
              placeholder="请输入详细地址（必填）"
            />
          </el-col>
        </el-form-item>
        <el-form-item label="备注说明">
          <el-col :span="10">
            <el-input
              v-model="tempItem.note"
              type="textarea"
              :rows="2"
              placeholder="请输入备注"
            />
          </el-col>
        </el-form-item>
        <el-form-item label="用户状态">
          <el-col :span="10">
            <el-radio-group v-model="tempItem.isLock">
              <el-radio :label="0">正常</el-radio>
              <el-radio :label="1">禁用</el-radio>
            </el-radio-group>
          </el-col>
        </el-form-item>
        <el-form-item label="集团用户">
          <el-col :span="10">
            <el-radio-group v-model="tempItem.isyxuser">
              <el-radio :label="0">否</el-radio>
              <el-radio :label="1">是</el-radio>
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
          @click="handleDialogConfirm"
        >确定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="修改密码"
      :visible.sync="dialogResetPasswordVisible"
    >
      <el-form>
        <el-form-item label="新的密码">
          <el-col :span="10">
            <el-input
              v-model="passwordModel.newPassword"
              maxlength="6"
              placeholder="请输入新的密码"
            />
          </el-col>
        </el-form-item>
        <el-form-item label="确认密码">
          <el-col :span="10">
            <el-input
              v-model="passwordModel.confirmPassword"
              maxlength="6"
              placeholder="请输入确认密码"
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
          @click="dialogResetPasswordVisible = false"
        >取消</el-button>
        <el-button
          :size="$style.dialogButtonSize"
          type="primary"
          @click="handlePasswordConfirm"
        >确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import TableMixins from '../../mixins/table-mixins'
export default {
  name: 'Group',
  mixins: [TableMixins],
  data() {
    return {
      formModelArray: [
        {
          id: 1,
          value: '',
          label: '用户名/手机号',
          name: 'userNameOrPhone',
          span: 5,
          type: 'input'
        }
      ],
      dialogFormVisible: false,
      dialogResetPasswordVisible: false,
      deptList: [],
      roleList: [],
      tempItem: {
        deptId: 0,
        roleId: '',
        isSchoolLeader: 0, // 是否校长 0否 1是
        isSalesLeader: 0, // 是否主管 0否 1是
        userName: '', //      用户真实姓名
        userNickName: '', //    用户昵称
        schoolId: '', //    所属学校ID
        isLock: 0, //       用户状态：0正常 1禁用
        photo: '', //       用户头像
        phone: '', //       手机号
        password: '', //     用户密码
        sex: 1, //      性别 1男 0女
        address: '', //     家庭住址
        note: '', //     备注
        isyxuser: 0 //     是否集团用户 0否 1是
      },
      passwordModel: {
        newPassword: '',
        confirmPassword: ''
      }
    }
  },
  mounted() {
    this.getData()
    this.getDept()
  },
  methods: {
    onAdd() {
      this.$router.push({ name: 'AddGroupInfo' })
    },
    onDelete() {
      if (this.canDeleteItems()) {
        this.confirmDelete('userId', ids => {
          this.$http({
            url: this.$urlPath.deleteUsers,
            data: {
              userIds: ids
            }
          }).then(res => {
            this.$successMsg(res.msg)
            this.getData()
          })
        })
      }
    },
    onSearch() {
      this.$http({
        url: this.$urlPath.queryYouXingUserListByLike,
        methods: this.HTTP_GET,
        data: this.generatorFormObj(this.formModelArray)
      }).then(res => {
        this.onSuccess(res.obj)
      })
    },
    handleUpdate(item) {
      this.dialogFormVisible = true
      this.tempItem = {
        userId: item.userId,
        deptId: item.deptId,
        roleId: item.roleId,
        isSchoolLeader: item.isSchoolLeader,
        isSalesLeader: item.isSalesLeader,
        userName: item.username,
        userNickName: item.userNickName,
        schoolId: item.schoolId,
        isLock: item.isLock,
        photo: item.photo,
        phone: item.phone,
        sex: item.sex,
        address: item.address,
        note: item.note,
        isyxuser: item.isyxuser
      }
    },
    handleDialogConfirm() {
      if (!this.tempItem.deptId) {
        this.$errorMsg('请选择所属部门')
        return
      }
      if (!this.tempItem.roleId) {
        this.$errorMsg('请选择角色')
        return
      }
      if (!this.tempItem.userName) {
        this.$errorMsg('请输入真实用户姓名')
        return
      }
      if (!this.tempItem.userNickName) {
        this.$errorMsg('请输入用户昵称')
        return
      }
      if (!this.tempItem.address) {
        this.$errorMsg('请输入详细地址')
        return
      }
      this.dialogFormVisible = false
      this.$http({
        url: this.$urlPath.updateUser,
        data: this.tempItem
      }).then(res => {
        this.$successMsg('保存成功')
        this.getData()
      })
    },
    onDeptChange(value) {
      this.tempItem.roleId = ''
      this.roleList = []
      this.queryRoleByDeptId()
    },
    queryRoleByDeptId() {
      this.$http({
        url: this.$urlPath.queryRolesByDeptId,
        methods: this.HTTP_GET,
        data: {
          deptId: this.tempItem.deptId
        }
      }).then(res => {
        this.roleList = res.obj
        if (this.roleList && this.roleList.length > 0) {
          this.tempItem.roleId = this.roleList[0].roleId
        } else {
          this.$errorMsg('当前部门没有角色信息，请重新选择')
        }
      })
    },
    resetPassword() {
      this.passwordModel.userId = this.tempItem.userId
      this.dialogFormVisible = false
      this.$warningConfirm('默认密码为手机号后六位，确定要重置密码吗？', _ => {
        this.dialogResetPasswordVisible = true
      })
    },
    handlePasswordConfirm() {
      if (!this.passwordModel.newPassword) {
        this.$errorMsg('请输入6位数新密码')
        return
      }
      if (this.passwordModel.newPassword !== this.passwordModel.confirmPassword) {
        this.$errorMsg('两次密码不一致')
        return
      }
      this.dialogResetPasswordVisible = false
      this.$http({
        url: this.$urlPath.editPassword,
        data: this.passwordModel
      }).then(res => {
        this.$successMsg('密码重置成功')
      })
    },
    getDept() {
      this.$http({
        url: this.$urlPath.queryDepts,
        methods: this.HTTP_GET,
        data: {
          pageNum: 0,
          pageSize: 100
        }
      }).then(res => {
        this.deptList = res.obj.list
        if (this.deptList && this.deptList.length > 0) {
          this.tempItem.deptId = this.deptList[0].deptId
          this.queryRoleByDeptId()
        }
      })
    },
    grantMenuButton(item) {
      this.$router.push({
        name: 'GrantMenuButton',
        params: {
          userId: item.userId,
          roleId: item.roleId
        }
      })
    },
    getData() {
      this.$http({
        url: this.$urlPath.queryYouXingUserList,
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
    }
  }
}
</script>

