<template>
  <div class="container">
    <table-header
      ref="tableHeader"
      title="基本操作"
      @onadd="onAdd"
      @ondelete="onDelete"
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
          type="selection"
          width="55"
        />
        <el-table-column
          align="center"
          label="序号"
        >
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="deptName"
          label="部门名称"
        />
        <el-table-column
          align="center"
          prop="deptCode"
          label="部门编码"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.deptCode | emptyFormat }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="createTime"
          label="创建时间"
        />
        <el-table-column
          align="center"
          prop="status"
          label="状态"
          :formatter="statusFormatter"
        >
          <template slot-scope="scope">
            <table-status :status="{label: scope.row.status === 0 ? '正常' : '禁用', type: scope.row.status === 0 ? 'primary' : 'danger'}" />
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="操作"
          width="180"
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
              @click="deleteItem(scope.row)"
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
      :title="mode === 'add' ? '添加部门' : '编辑部门'"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        ref="dataForm"
        :model="tempItem"
        class="dialog-container"
      >
        <el-form-item
          label="部门名称"
          prop="deptName"
        >
          <el-col :span="$style.dialogColSpan">
            <el-input
              v-model="tempItem.deptName"
              placeholder="请输入部门名称"
              clearable
            />
          </el-col>
        </el-form-item>
        <el-form-item
          label="部门编码"
          prop="deptCode"
        >
          <el-col :span="$style.dialogColSpan">
            <el-input
              v-model="tempItem.deptCode"
              placeholder="请输入部门编码"
              clearable
            />
          </el-col>
        </el-form-item>
        <el-form-item
          label="上级部门"
          prop="parentDeptId"
        >
          <el-col :span="$style.dialogColSpan">
            <el-select
              v-model="tempItem.parentDeptId"
              class="filter-item"
              style="width: 100%"
              placeholder="请选择上级部门"
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
        <el-form-item
          label="部门状态"
          prop="status"
        >
          <el-col :span="$style.dialogColSpan">
            <el-radio-group v-model="tempItem.status">
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
          @click="handleDialogConfirm"
        >确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import TableMixins from '../../mixins/table-mixins'
export default {
  name: 'Department',
  mixins: [TableMixins],
  data() {
    return {
      allDepts: [],
      mode: 'edit',
      dialogFormVisible: false,
      tempItem: {
        parentDeptId: '',
        deptName: '',
        deptCode: '',
        status: 0
      }
    }
  },
  mounted() {
    this.getData()
    this.getAllDepts()
  },
  methods: {
    statusFormatter(item) {
      return item.status === 0 ? '正常' : '禁用'
    },
    getData() {
      this.$http({
        url: this.$urlPath.queryDepts,
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
    onAdd() {
      if (!this.checkButtonPermission('add')) {
        return
      }
      this.mode = 'add'
      this.dialogFormVisible = true
      this.tempItem = {
        parentDeptId: '',
        deptName: '',
        deptCode: '',
        status: 0
      }
    },
    onDelete() {
      if (!this.checkButtonPermission('delete')) {
        return
      }
      if (this.canDeleteItems()) {
        this.confirmDelete('deptId', ids => {
          this.$http({
            url: this.$urlPath.deleteDepts,
            data: {
              deptIds: ids
            }
          }).then(res => {
            this.$successMsg(res.msg)
            this.getData()
          })
        })
      }
    },
    deleteItem(item) {
      if (!this.checkButtonPermission('delete')) {
        return
      }
      this.$warningConfirm('是否要删除此部门，删除后不可恢复。', _ => {
        this.$showLoading(closeDialog => {
          this.$http({
            url: this.$urlPath.deleteDepts,
            data: {
              deptIds: item.deptId
            }
          }).then(res => {
            closeDialog()
            this.$successMsg(res.msg)
            this.getData()
          }).catch(_ => {
            closeDialog()
          })
        })
      })
    },
    handleUpdate(item) {
      if (!this.checkButtonPermission('edit')) {
        return
      }
      this.mode = 'edit'
      this.dialogFormVisible = true
      this.tempItem = {
        deptId: item.deptId,
        parentDeptId: item.parentDeptId,
        deptName: item.deptName,
        deptCode: item.deptCode,
        status: item.status
      }
    },
    handleDialogConfirm() {
      if (!this.tempItem.deptName) {
        this.$errorMsg('请输入部门名称')
        return
      }
      if (!this.tempItem.deptCode) {
        this.$errorMsg('请输入部门编码')
        return
      }
      this.dialogFormVisible = false
      if (this.mode === 'edit') {
        this.$http({
          url: this.$urlPath.updateDept,
          data: this.tempItem
        }).then(res => {
          this.$successMsg('修改成功')
          this.getData()
        })
      } else {
        this.$http({
          url: this.$urlPath.saveDept,
          data: this.tempItem
        }).then(res => {
          this.$successMsg('保存成功')
          this.getData()
        })
      }
    }
  }
}
</script>
