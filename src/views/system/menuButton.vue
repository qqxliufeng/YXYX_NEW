<template>
  <div class="container">
    <table-header
      :title="$route.params.menuName + '菜单下的按钮'"
      :show-add="true"
      :show-delete="false"
      :show-search="false"
      @onadd="onAdd"
    />
    <el-card :body-style="{padding: '0'}">
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
          prop="buttonId"
          label="ID"
        />
        <el-table-column
          align="center"
          prop="buttonSequence"
          label="序号"
          show-overflow-tooltip
        />
        <el-table-column
          align="center"
          prop="buttonName"
          label="菜单名称"
        />
        <el-table-column
          align="center"
          prop="buttonCode"
          label="菜单编码"
        />
        <el-table-column
          align="center"
          prop="createTime"
          label="创建时间"
        >
          <template slot-scope="scope">
            <div>
              {{ scope.row.createTime | parseTime }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="操作"
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
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加编辑按钮对话框 -->
    <el-dialog
      :title="mode === 'add' ? '添加菜单' : '编辑菜单'"
      :visible.sync="dialogFormVisible"
    >
      <el-form class="dialog-container">
        <el-form-item label="按钮名称">
          <el-col :span="$style.dialogColSpan">
            <el-input
              v-model="tempItem.buttonName"
              maxlength="15"
              placeholder="请输入按钮名称"
              clearable
            />
          </el-col>
        </el-form-item>
        <el-form-item label="按钮编码">
          <el-col :span="$style.dialogColSpan">
            <el-input
              v-model="tempItem.buttonCode"
              placeholder="请输入按钮编码"
              maxlength="15"
              :disabled="mode === 'edit'"
            />
          </el-col>
        </el-form-item>
        <el-form-item
          label="按钮序号"
          prop="menuSequence"
        >
          <el-col :span="$style.dialogColSpan">
            <el-input-number
              v-model="tempItem.buttonSequence"
              style="width: 100%"
              :min="1"
              label="按钮序号"
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
          @click="handleDialogConfirm"
        >确定</el-button>
      </div>
    </el-dialog>
    <!-- 添加编辑按钮对话框 -->
  </div>
</template>

<script>
import tableMixins from '../../mixins/table-mixins'
export default {
  name: 'MenuButton',
  mixins: [tableMixins],
  data() {
    return {
      mode: 'add',
      dialogFormVisible: false,
      tempItem: {
        buttonId: '',
        buttonCode: '',
        buttonName: '',
        buttonSequence: 1
      }
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    onAdd() {
      this.mode = 'add'
      this.dialogFormVisible = true
      this.tempItem = {
        buttonCode: '',
        buttonName: '',
        buttonSequence: 1
      }
    },
    handleDelete(item) {
      this.$warningConfirm('是否要删除此按钮？', _ => {
        this.$http({
          url: this.$urlPath.deleteMenuButton,
          data: {
            buttonId: item.buttonId
          }
        }).then(res => {
          this.$successMsg('删除成功')
          this.getData()
        })
      })
    },
    handleUpdate(item) {
      this.mode = 'edit'
      this.dialogFormVisible = true
      this.tempItem.buttonId = item.buttonId
      this.tempItem.buttonCode = item.buttonCode
      this.tempItem.buttonName = item.buttonName
      this.tempItem.buttonSequence = item.buttonSequence
    },
    handleDialogConfirm() {
      if (!this.tempItem.buttonName) {
        this.$errorMsg('请输入按钮名称')
        return
      }
      if (!this.tempItem.buttonCode) {
        this.$errorMsg('请输入按钮编码')
        return
      }
      this.dialogFormVisible = false
      if (this.mode === 'add') {
        this.$http({
          url: this.$urlPath.saveMenuButton,
          data: {
            menuId: this.$route.params.menuId,
            buttonName: this.tempItem.buttonName,
            buttonCode: this.tempItem.buttonCode,
            buttonSequence: this.tempItem.buttonSequence,
            buttonUrl: ''
          }
        }).then(res => {
          this.$successMsg('添加成功')
          this.getData()
        })
      } else {
        this.$http({
          url: this.$urlPath.updateMenuButton,
          data: {
            buttonId: this.tempItem.buttonId,
            menuId: this.$route.params.menuId,
            buttonName: this.tempItem.buttonName,
            buttonCode: this.tempItem.buttonCode,
            buttonSequence: this.tempItem.buttonSequence,
            buttonUrl: ''
          }
        }).then(res => {
          this.$successMsg('修改成功')
          this.getData()
        })
      }
    },
    getData() {
      this.$http({
        url: this.$urlPath.queryAllButtonInMenu,
        methods: this.HTTP_GET,
        data: {
          menuId: this.$route.params.menuId
        }
      }).then(res => {
        this.loading = false
        this.tableData = res.obj
      })
    }
  }
}
</script>
