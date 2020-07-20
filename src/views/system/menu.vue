<template>
  <div class="container">
    <table-header
      title="基本操作"
      :show-delete="false"
      @onadd="onAdd"
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
        default-expand-all
        row-key="menuId"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      >
        <el-table-column
          align="center"
          prop="menuName"
          label="菜单名称"
        >
          <template slot-scope="scope">
            <el-link
              v-if="scope.row.parentMenuId === null"
              :underline="false"
              type="primary"
            >{{ scope.row.menuName }}</el-link>
            <div v-else>{{ scope.row.menuName }}</div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="menuSequence"
          label="序号"
        />
        <el-table-column
          align="center"
          prop="menuUrl"
          label="菜单地址"
          width
        />
        <el-table-column
          align="center"
          prop="createTime"
          label="创建时间"
        />
        <el-table-column
          align="center"
          label="操作"
          width="250"
        >
          <template slot-scope="scope">
            <el-button
              type="primary"
              :size="$style.tableButtonSize"
              @click="handleUpdate(scope.row)"
            >编辑</el-button>
            <el-button
              type="danger"
              :size="$style.tableButtonSize"
              @click="handleDelete(scope.row)"
            >删除</el-button>
            <el-button
              :disabled="scope.row.parentMenuId === null"
              type="success"
              :size="$style.tableButtonSize"
              @click="buttonManger(scope.row)"
            >按钮管理</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog
      :title="mode === 'add' ? '添加菜单' : '编辑菜单'"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        :model="tempItem"
        class="dialog-container"
      >
        <el-form-item
          label="父级菜单"
          prop="parentDeptId"
        >
          <el-col :span="$style.dialogColSpan">
            <el-select
              v-model="tempItem.parentMenuId"
              style="width: 100%"
              class="filter-item"
              placeholder="请选择父级菜单"
              @change="parentMenuIdChange"
            >
              <el-option
                v-for="item of parentMenuIds"
                :key="item.menuId"
                :label="item.menuName"
                :value="item.menuId"
              />
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item
          label="菜单名称"
          prop="menuName"
        >
          <el-col :span="$style.dialogColSpan">
            <el-input
              v-model="tempItem.menuName"
              maxlength="15"
              placeholder="请输入菜单名称"
              clearable
            />
          </el-col>
        </el-form-item>
        <el-form-item
          label="菜单序号"
          prop="menuSequence"
        >
          <el-col :span="$style.dialogColSpan">
            <el-input-number
              v-model="tempItem.menuSequence"
              style="width: 100%"
              :min="1"
              label="菜单序号"
            />
          </el-col>
        </el-form-item>
        <el-form-item label="菜单地址">
          <el-col :span="$style.dialogColSpan">
            <el-input
              v-model="tempItem.menuUrl"
              placeholder="请输入菜单地址"
              maxlength="15"
            >
              <template slot="prepend">{{ prefixUrl }}</template>
            </el-input>
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
  name: 'Menu',
  mixins: [TableMixins],
  data() {
    return {
      parentMenuIds: [],
      mode: 'add',
      dialogFormVisible: false,
      prefixUrl: '/',
      tempItem: {
        parentMenuId: '',
        menuName: '',
        menuUrl: '',
        menuSequence: 1
      }
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    onAdd() {
      if (!this.checkButtonPermission('add')) {
        return
      }
      this.mode = 'add'
      this.tempItem = {
        parentMenuId: '',
        menuName: '',
        menuUrl: '',
        menuSequence: 1
      }
      this.prefixUrl = '/'
      this.dialogFormVisible = true
    },
    handleUpdate(item) {
      if (!this.checkButtonPermission('edit')) {
        return
      }
      this.mode = 'edit'
      let url = ''
      const urls = item.menuUrl.split('/')
      if (urls.length === 3) {
        url = urls[2]
        this.prefixUrl = '/' + urls[1]
      } else if (urls.length === 2) {
        url = item.menuUrl.split('/')[1]
        this.prefixUrl = '/'
      }
      this.tempItem = {
        menuId: item.menuId,
        parentMenuId: item.parentMenuId,
        menuName: item.menuName,
        menuUrl: url,
        menuSequence: item.menuSequence
      }
      this.dialogFormVisible = true
    },
    handleDelete(item) {
      if (!this.checkButtonPermission('delete')) {
        return
      }
      if (item.parentMenuId === null) {
        if (item.children && item.children.length > 0) {
          this.$errorMsg('此菜单下包含子菜单，不可以执行删除操作')
          return
        }
      }
      this.confirmDeleteSingle(_ => {
        this.$http({
          url: this.$urlPath.deleteMenu,
          data: {
            menuId: item.menuId
          }
        }).then(res => {
          this.$successMsg('删除成功')
          this.getData()
        })
      })
    },
    buttonManger(item) {
      if (!this.checkButtonPermission('btn_manager')) {
        return
      }
      this.$router.push({
        name: 'MenuButton',
        params: {
          menuId: item.menuId,
          menuName: item.menuName
        }
      })
    },
    handleDialogConfirm() {
      if (!this.tempItem.menuName) {
        this.$errorMsg('菜单名称不能为空')
        return
      }
      if (!this.tempItem.menuUrl) {
        this.$errorMsg('菜单地址不能为空')
        return
      }
      this.dialogFormVisible = false
      this.tempItem.menuUrl =
        (this.prefixUrl === '/' ? '/' : this.prefixUrl + '/') +
        this.tempItem.menuUrl
      if (this.mode === 'add') {
        this.$http({
          url: this.$urlPath.saveMenu,
          data: this.tempItem
        }).then(res => {
          this.$successMsg('添加成功')
          this.getData()
        })
      } else {
        this.$http({
          url: this.$urlPath.updateMenu,
          data: this.tempItem
        }).then(res => {
          this.$successMsg('修改成功')
          this.getData()
        })
      }
    },
    parentMenuIdChange(value) {
      this.prefixUrl = this.parentMenuIds.filter(
        it => it.menuId === value
      )[0].menuUrl
    },
    getData() {
      this.$http({
        url: this.$urlPath.queryAllMenu,
        methods: this.HTTP_GET
      }).then(res => {
        this.loading = false
        this.tableData = res.obj
        if (this.tableData && this.tableData.length > 0) {
          this.parentMenuIds = this.tableData.filter(
            it => it.parentMenuId === null
          )
        }
      })
    }
  }
}
</script>
