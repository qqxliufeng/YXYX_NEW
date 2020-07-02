<template>
  <div class="container">
    <table-header
      ref="tableHeader"
      title="基本操作"
      :show-delete="false"
      @onadd="onAdd"
    />
    <el-card
      :body-style="{padding: 0}"
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
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          align="center"
          label="ID"
          prop="roleId"
        />
        <el-table-column
          align="center"
          prop="roleName"
          label="角色名称"
        />
        <el-table-column
          align="center"
          prop="roleCode"
          label="角色编码"
        />
        <el-table-column
          align="center"
          label="所属部门"
        >
          <template slot-scope="scope">
            <el-link>{{ scope.row.dept.deptName | emptyFormat }}</el-link>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="createTime"
          width="160"
          label="创建时间"
        />
        <el-table-column
          align="center"
          prop="dr"
          label="删除状态"
          :formatter="statusFormatter"
        />
        <el-table-column
          align="center"
          label="操作"
          width="270"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-button
              type="primary"
              :size="$style.dialogButtonSize"
              :disabled="scope.row.roleCode === 'ROLE_admin'"
              @click="handleUpdate(scope.row)"
            >编辑</el-button>
            <el-button
              type="warning"
              :size="$style.dialogButtonSize"
              style="width:90px;"
              @click="handleRoleMenus(scope.row)"
            >菜单权限</el-button>
            <el-button
              :size="$style.dialogButtonSize"
              type="danger"
              :disabled="scope.row.roleCode === 'ROLE_admin'"
              @click="handleDelete(scope.row)"
            >删除</el-button>
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
    <el-dialog
      :visible.sync="dialogMenuVisible"
      title="角色菜单权限"
    >
      <el-tree
        ref="menuTree"
        :data="menuObj.roleMenus"
        show-checkbox
        node-key="menuId"
        :default-expanded-keys="menuObj.defalutExpandedKeys"
        :default-checked-keys="menuObj.defalutCheckedKeys"
        :props="menuObj.defaultProps"
        class="dialog-container"
      />
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          :size="$style.dialogButtonSize"
          @click="dialogMenuVisible = false"
        >取消</el-button>
        <el-button
          :size="$style.dialogButtonSize"
          type="primary"
          @click="roleMenusConfirm"
        >确认</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :title="modeObj.mode === 'add' ? '添加角色' : '编辑角色'"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        ref="dataForm"
        :model="modeObj.temp"
        class="dialog-container"
      >
        <el-form-item
          label="角色名称"
          prop="roleName"
        >
          <el-col :span="$style.dialogColSpan">
            <el-input
              v-model="modeObj.temp.roleName"
              placeholder="请输入角色名称"
            />
          </el-col>
        </el-form-item>
        <el-form-item
          label="角色编码"
          prop="roleCode"
        >
          <el-col :span="$style.dialogColSpan">
            <el-input
              v-model="modeObj.temp.roleCode"
              placeholder="请输入角色编码"
            >
              <template slot="prepend">ROLE_</template>
            </el-input>
          </el-col>
        </el-form-item>
        <el-form-item
          label="所属部门"
          prop="deptId"
        >
          <el-col :span="$style.dialogColSpan">
            <el-select
              v-model="modeObj.temp.deptId"
              class="filter-item"
              style="width: 100%"
              placeholder="请选择部门"
            >
              <el-option
                v-for="item of allDepts"
                :key="item.deptId"
                :label="item.deptName"
                :value="item.deptId"
              />
            </el-select>
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
  </div>
</template>

<script>
import TableMixins from '../../mixins/table-mixins'
export default {
  name: 'Roles',
  mixins: [TableMixins],
  data() {
    return {
      allDepts: [],
      dialogMenuVisible: false,
      dialogFormVisible: false,
      menuObj: {
        roleMenus: [],
        defalutExpandedKeys: [],
        defalutCheckedKeys: [],
        defaultProps: {
          label: 'menuName',
          children: 'children'
        }
      },
      modeObj: {
        mode: 'edit',
        temp: {
          roleName: '',
          roleCode: '',
          deptId: ''
        }
      },
      tempItem: null
    }
  },
  mounted() {
    this.getData()
    this.getAllDepts()
  },
  methods: {
    statusFormatter(item) {
      return item.dr === 0 ? '未删除' : '已删除'
    },
    onAdd() {
      if (!this.checkButtonPermission('add')) {
        return
      }
      this.dialogFormVisible = true
      this.modeObj.mode = 'add'
      this.modeObj.temp = {
        roleName: '',
        roleCode: '',
        deptId: ''
      }
    },
    handleUpdate(item) {
      if (!this.checkButtonPermission('edit')) {
        return
      }
      this.tempItem = item
      this.dialogFormVisible = true
      this.modeObj.mode = 'edit'
      this.modeObj.temp = {
        roleId: item.roleId,
        roleName: item.roleName,
        roleCode: item.roleCode.split('ROLE_')[1],
        deptId: item.deptId
      }
    },
    handleDelete(item) {
      if (!this.checkButtonPermission('delete')) {
        return
      }
      this.confirmDeleteSingle(_ => {
        this.$http({
          url: this.$urlPath.deleteRole,
          data: {
            roleId: item.roleId
          }
        }).then(res => {
          this.$successMsg('删除成功')
          this.getData()
        })
      })
    },
    handleRoleMenus(item) {
      if (!this.checkButtonPermission('menu_per')) {
        return
      }
      this.tempItem = item
      this.$http({
        url: this.$urlPath.queryAllMenuByRole,
        methods: this.HTTP_GET,
        data: {
          roleId: item.roleId
        }
      }).then(res => {
        this.menuObj.roleMenus = res.obj
        if (this.menuObj.roleMenus && this.menuObj.roleMenus.length > 0) {
          this.menuObj.defalutCheckedKeys = []
          this.menuObj.defalutExpandedKeys = []
          this.handleRoleMenusSelected(this.menuObj.roleMenus)
          this.dialogMenuVisible = true
        }
      })
    },
    getData() {
      this.$http({
        url: this.$urlPath.queryRoles,
        methods: this.HTTP_GET,
        data: {
          pageNum: this.page,
          pageSize: this.pageSize
        }
      }).then(res => {
        this.onSuccess(res.obj)
      })
    },
    getAllDepts() {
      this.$http({
        url: this.$urlPath.queryDepts,
        methods: this.HTTP_GET,
        data: {
          pageNum: 0,
          pageSize: 10000
        }
      }).then(res => {
        this.allDepts = res.obj.list
      })
    },
    handleRoleMenusSelected(menus) {
      menus.forEach(it => {
        if (it.parentMenuId) {
          if (it.select) {
            this.menuObj.defalutCheckedKeys.push(it.menuId)
          }
        } else {
          this.menuObj.defalutExpandedKeys.push(it.menuId)
        }
        if (
          it.hasOwnProperty('children') &&
          it.children != null &&
          it.children.length > 0
        ) {
          this.handleRoleMenusSelected(it.children)
        }
      })
    },
    roleMenusConfirm() {
      this.dialogMenuVisible = false
      const halfKeys = this.$refs.menuTree.getHalfCheckedKeys()
      const checkedKeys = this.$refs.menuTree.getCheckedKeys()
      const allKeys = halfKeys.concat(checkedKeys)
      this.$http({
        url: this.$urlPath.saveRoleMenus,
        data: {
          roleId: this.tempItem.roleId,
          menuIds: allKeys.join(',')
        }
      }).then(res => {
        this.$successMsg('操作成功')
      })
    },
    handleDialogConfirm() {
      if (!this.modeObj.temp.roleName) {
        this.$errorMsg('请输入角色名称')
        return
      }
      if (!this.modeObj.temp.roleCode) {
        this.$errorMsg('请输入角色编码')
        return
      }
      if (!this.modeObj.temp.deptId) {
        this.$errorMsg('请选择所属部门')
        return
      }
      this.dialogFormVisible = false
      const postData = { ...this.modeObj.temp }
      if (!postData.roleCode.startsWith('ROLE_')) {
        postData.roleCode = 'ROLE_' + postData.roleCode
      }
      if (this.modeObj.mode === 'add') {
        this.$http({
          url: this.$urlPath.saveRole,
          data: postData
        }).then(res => {
          this.$successMsg('添加成功')
          this.getData()
        })
      } else {
        this.modeObj.temp.roleId = this.tempItem.roleId
        this.$http({
          url: this.$urlPath.updateRole,
          data: postData
        }).then(res => {
          this.$successMsg('修改成功')
          this.getData()
        })
      }
    }
  }
}
</script>
