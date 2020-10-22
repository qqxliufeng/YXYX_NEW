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
          fixed="left"
          prop="knowledgeExamId"
          width="100"
        />
        <el-table-column
          align="center"
          prop="knowledgeExamCode"
          label="编码"
        />
        <el-table-column
          align="center"
          label="名称"
          prop="knowledgeExamName"
        />
        <el-table-column
          align="center"
          label="所属知识点"
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
      :title="mode === 'add' ? '添加考点' : '编辑考点'"
      :visible.sync="dialogFormVisible"
    >
      <el-form class="dialog-container">
        <el-form-item label="考点名称">
          <el-col :span="$style.dialogColSpan">
            <el-input
              v-model="examPointModel.knowledgeExamName"
              placeholder="请输入考点名称（必填）"
              maxlength="20"
            />
          </el-col>
        </el-form-item>
        <el-form-item label="考点编码">
          <el-col :span="$style.dialogColSpan">
            <el-input
              v-model="examPointModel.knowledgeExamCode"
              placeholder="请输入6位数的考点编码，只能输入字母和数字（必填）"
              maxlength="6"
            >
              <template slot="prepend">exam_</template>
            </el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="所属知识">
          <el-col :span="$style.dialogColSpan">
            <el-select
              v-model="examPointModel.knowledgeId"
              style="width: 100%"
              placeholder="请选择所属知识点"
            >
              <el-option
                v-for="item of formModelArray[1].selectOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
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
  name: 'ExamPoint',
  mixins: [tableMixins, userMixins],
  data() {
    return {
      formModelArray: [
        {
          id: 1,
          value: '',
          label: '考点名称',
          name: 'knowledgeName',
          span: 5,
          type: 'input'
        },
        {
          id: 2,
          value: '',
          label: '知识点名称',
          name: 'knowledgeId',
          span: 5,
          type: 'select',
          selectOptions: []
        }
      ],
      dialogFormVisible: false,
      mode: 'add',
      examPointModel: {
        knowledgeExamId: '', // 考点主键ID
        knowledgeId: '', // 所属知识点ID
        knowledgeExamCode: '', // 考点编码
        knowledgeExamName: ''// 考点名称
      }
    }
  },
  mounted() {
    this.getKnowledgeList()
    this.getData()
  },
  methods: {
    initData() {
      this.likeSearchUrl = this.$urlPath.queryKnowledgeExamList
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
      this.examPointModel.knowledgeExamId = ''
      this.examPointModel.knowledgeId = ''
      this.examPointModel.knowledgeExamCode = ''
      this.examPointModel.knowledgeExamName = ''
    },
    getData() {
      this.$http({
        url: this.$urlPath.queryKnowledgeExamList,
        methods: this.HTTP_GET,
        data: {
          pageNum: this.page,
          pageSize: this.pageSize
        }
      }).then(res => {
        this.onSuccess(res.obj)
      })
    },
    getKnowledgeList() {
      this.$http({
        url: this.$urlPath.queryKnowledgeList,
        methods: this.HTTP_GET,
        data: {
          pageNum: 1,
          pageSize: 1000
        }
      }).then(res => {
        res.obj.list && res.obj.list.forEach(it => {
          this.formModelArray[1].selectOptions.push({
            label: it.knowledgeName,
            value: it.knowledgeId
          })
        })
      })
    },
    handlerUpdate(item) {
      if (!this.checkButtonPermission('edit')) {
        return
      }
      this.dialogFormVisible = true
      this.mode = 'edit'
      this.examPointModel.knowledgeExamId = item.knowledgeExamId
      this.examPointModel.knowledgeId = item.knowledgeId
      this.examPointModel.knowledgeExamCode = item.knowledgeExamCode.replace('exam_', '')
      this.examPointModel.knowledgeExamName = item.knowledgeExamName
    },
    deleteItem(item) {
      if (!this.checkButtonPermission('delete')) {
        return
      }
      this.$warningConfirm('确定要删除此考点吗，删除后不可恢复？', _ => {
        this.$showLoading(closeLoading => {
          this.$http({
            url: this.$urlPath.deleteKnowledgeExam,
            data: {
              knowledgeExamId: item.knowledgeExamId
            }
          }).then(res => {
            closeLoading()
            this.$successMsg('删除成功')
            this.getData()
          }).catch(_ => {
            closeLoading()
          })
        })
      })
    },
    handlerFormConfirm() {
      if (!this.examPointModel.knowledgeExamName) {
        this.$errorMsg('请输入考点名称')
        return
      }
      if (!this.examPointModel.knowledgeExamCode) {
        this.$errorMsg('请输入6位数的考点编码，只能输入字母和数字')
        return
      }
      if (!/^[a-zA-Z0-9]{6}$/.test(this.examPointModel.knowledgeExamCode)) {
        this.$errorMsg('请输入6位数的考点编码，只能输入字母和数字')
        return
      }
      if (!this.examPointModel.knowledgeId) {
        this.$errorMsg('请选择所属知识点')
        return
      }
      this.dialogFormVisible = false
      this.$showLoading(closeLoading => {
        if (this.mode === 'add') {
          this.$http({
            url: this.$urlPath.saveKnowledgeExam,
            data: {
              knowledgeExamName: this.examPointModel.knowledgeExamName.trim(),
              knowledgeExamCode: 'exam_' + this.examPointModel.knowledgeExamCode.trim(),
              knowledgeId: this.examPointModel.knowledgeId
            }
          }).then(res => {
            closeLoading()
            this.$successMsg('考点添加成功')
            this.reloadData()
          }).catch(_ => {
            closeLoading()
          })
        } else {
          this.$http({
            url: this.$urlPath.editKnowledgeExam,
            data: {
              knowledgeExamId: this.examPointModel.knowledgeExamId,
              knowledgeExamName: this.examPointModel.knowledgeExamName.trim(),
              knowledgeExamCode: 'exam_' + this.examPointModel.knowledgeExamCode.trim(),
              knowledgeId: this.examPointModel.knowledgeId
            }
          }).then(res => {
            closeLoading()
            this.$successMsg('考点编辑成功')
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
