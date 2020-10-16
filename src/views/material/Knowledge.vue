<template>
  <div class="container">
    <table-header
      ref="tableHeader"
      title="查询内容"
      :form-model-array="formModelArray"
      :show-delete="false"
      :show-add="true"
      :show-search="true"
      :can-collapse="true"
      @onsearch="onSearch"
      @onadd="onAdd"
      @table-header-collapse="onCollapsed"
    />
    <el-card
      ref="tableContainer"
      :body-style="{padding: 0}"
      class="table-container"
      :style="tableCardStyle"
    >
      <el-table
        ref="table"
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
          width="100"
        >
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="唯一标识符"
          prop="knowledgeId"
          fixed="left"
          width="100"
        />
        <el-table-column
          align="center"
          prop="knowledgeCode"
          label="编码"
        />
        <el-table-column
          align="center"
          label="名称"
          prop="knowledgeName"
        />
        <el-table-column
          align="center"
          prop="createTime"
          label="创建时间"
          width="160"
        >
          <template slot-scope="scope">
            <div>{{ scope.row.createTime | parseTime }}</div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="status"
          label="状态"
        >
          <template slot-scope="scope">
            <table-status :status="statusFormatter(scope.row)" />
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="操作"
          fixed="right"
          width="200"
        >
          <template slot-scope="scope">
            <el-button
              type="primary"
              :size="$style.tableButtonSize"
              @click="handlerUpdate(scope.row)"
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
    <!-- 增加教材对话框 -->
    <el-dialog
      :title="mode === 'add' ? '添加知识点' : '编辑知识点'"
      :visible.sync="dialogFormVisible"
    >
      <el-form class="dialog-container">
        <el-form-item label="知识点名称">
          <el-col :span="$style.dialogColSpan">
            <el-input
              v-model="knowledgeModel.knowledgeName"
              placeholder="请输入知识点名称（必填）"
              maxlength="20"
            />
          </el-col>
        </el-form-item>
        <el-form-item label="知识点编码">
          <el-col :span="$style.dialogColSpan">
            <el-input
              v-model="knowledgeModel.knowledgeCode"
              placeholder="请输入6位数的知识点编码，只能输入字母和数字（必填）"
              maxlength="6"
            >
              <template slot="prepend">konw_</template>
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
          @click="handlerFormConfirm"
        >确定</el-button>
      </div>
    </el-dialog>
    <!-- 增加教材对话框 -->
  </div>
</template>

<script>
import tableMixins from '@/mixins/table-mixins'
import userMixins from '@/mixins/user-mixins'
export default {
  name: 'Knowledge',
  mixins: [tableMixins, userMixins],
  data() {
    return {
      formModelArray: [{
        id: 1,
        value: '',
        label: '知识点名称',
        name: 'knowledgeName',
        span: 5,
        type: 'input'
      }],
      dialogFormVisible: false,
      mode: 'add',
      knowledgeModel: {
        knowledgeId: 0,
        knowledgeCode: '',
        knowledgeName: ''
      }
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    initData() {
      this.likeSearchUrl = this.$urlPath.queryKnowledgeList
    },
    statusFormatter(item) {
      if (item.dr === 0) {
        return {
          type: 'success',
          label: '正常'
        }
      } else {
        return {
          type: 'danger',
          label: '删除'
        }
      }
    },
    onAdd() {
      if (!this.checkButtonPermission('add')) {
        return
      }
      this.dialogFormVisible = true
      this.knowledgeModel.knowledgeId = 0
      this.knowledgeModel.knowledgeCode = ''
      this.knowledgeModel.knowledgeName = ''
    },
    getData() {
      this.$http({
        url: this.$urlPath.queryKnowledgeList,
        methods: this.HTTP_GET,
        data: {
          pageNum: this.page,
          pageSize: this.pageSize
        }
      }).then(res => {
        this.onSuccess(res.obj)
      })
    },
    handlerUpdate(item) {
      if (!this.checkButtonPermission('edit')) {
        return
      }
      this.dialogFormVisible = true
      this.mode = 'edit'
      this.knowledgeModel.knowledgeId = item.knowledgeId
      this.knowledgeModel.knowledgeCode = item.knowledgeCode.replace('know_', '')
      this.knowledgeModel.knowledgeName = item.knowledgeName
    },
    deleteItem(item) {
      if (!this.checkButtonPermission('delete')) {
        return
      }
      this.$warningConfirm('确定要删除此知识点吗？', _ => {
        console.log('删除')
      })
    },
    handlerFormConfirm() {
      if (!this.knowledgeModel.knowledgeName) {
        this.$errorMsg('请输入知识点名称')
        return
      }
      if (!this.knowledgeModel.knowledgeCode) {
        this.$errorMsg('请输入6位数的知识点编码，只能输入字母和数字')
        return
      }
      if (!/^[a-zA-Z0-9]{6}$/.test(this.knowledgeModel.knowledgeCode)) {
        this.$errorMsg('请输入6位数的知识点编码，只能输入字母和数字')
        return
      }
      this.dialogFormVisible = false
      this.$showLoading(closeLoading => {
        if (this.mode === 'add') {
          this.$http({
            url: this.$urlPath.saveKnowledge,
            data: {
              knowledgeName: this.knowledgeModel.knowledgeName.trim(),
              knowledgeCode: 'know_' + this.knowledgeModel.knowledgeCode.trim()
            }
          }).then(res => {
            closeLoading()
            this.$successMsg('知识点添加成功')
            this.reloadData()
          }).catch(_ => {
            closeLoading()
          })
        } else {
          this.$http({
            url: this.$urlPath.editKnowledge,
            data: {
              knowledgeId: this.knowledgeModel.knowledgeId,
              knowledgeName: this.knowledgeModel.knowledgeName.trim(),
              knowledgeCode: 'know_' + this.knowledgeModel.knowledgeCode.trim()
            }
          }).then(res => {
            closeLoading()
            this.$successMsg('知识点编辑成功')
            this.getData()
          }).catch(_ => {
            closeLoading()
          })
        }
      })
    }
  }
}
</script>

<style>

</style>
