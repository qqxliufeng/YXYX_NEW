<template>
  <div>
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
    >
      <template slot="other">
        <el-button
          type="danger"
          size="mini"
          @click="downExcel"
        >下载题库模板</el-button>
        <el-button
          type="success"
          size="mini"
          @click="importExcel"
        >导入Excel数据</el-button>
      </template>
    </table-header>
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
          width="50"
        >
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="subject"
          label="题目"
          width="520"
        >
          <template slot-scope="scope">
            <div style="white-space: pre-wrap; word-wrap:break-word;">{{ scope.row.questionContent }}</div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="answer"
          label="答案"
          width="80"
        >
          <template slot-scope="scope">
            <div v-if="scope.row.subjectType === 1">{{ scope.row.answer }}</div>
            <el-link
              v-else
              type="primary"
              size="mini"
              @click="showAnswerList(scope.row)"
            >{{ scope.row.answer }}</el-link>
          </template>
        </el-table-column>
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
          width="80"
        >
          <template slot-scope="scope">
            <table-status :status="statusFormatter(scope.row)" />
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
              type="primary"
              :size="$style.tableButtonSize"
              @click="handlerUpdate(scope.row)"
            >编辑</el-button>
            <el-button
              type="danger"
              :size="$style.tableButtonSize"
              @click="deleteItem(scope.row)"
            >删除</el-button>
            <el-button
              :type="scope.row.status === 0 ? 'warning' : 'success'"
              :size="$style.tableButtonSize"
              @click="changeStatus(scope.row)"
            >{{ scope.row.status === 0 ? '禁用' : '启用' }}</el-button>
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
    <!-- 显示答案选项列表 -->
    <el-dialog
      title="答案解析"
      :visible.sync="dialogAnswerListVisible"
    >
      <div
        v-if="tempItem"
        class="padding"
      >
        <h3 style="margin-bottom: 20px; white-space: pre-wrap; over-flow:">{{ tempItem.questionContent }}</h3>
        <h4 :style="{ color: tempItem.answer.indexOf('A') !== -1 ? '#67C23A' : '#909399', marginLeft: '20px' }">
          A：{{ tempItem && tempItem.aOption }}
        </h4>
        <h4 :style="{ color: tempItem.answer.indexOf('B') !== -1 ? '#67C23A' : '#909399', marginLeft: '20px' }">
          B：{{ tempItem && tempItem.bOption }}
        </h4>
        <h4 :style="{ color: tempItem.answer.indexOf('C') !== -1 ? '#67C23A' : '#909399', marginLeft: '20px' }">
          C：{{ tempItem && tempItem.cOption }}
        </h4>
        <h4 :style="{ color: tempItem.answer.indexOf('D') !== -1 ? '#67C23A' : '#909399', marginLeft: '20px' }">
          D：{{ tempItem && tempItem.dOption }}
        </h4>
        <h4 class="text-red">解析：{{ tempItem.analysis }}</h4>
      </div>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          :size="$style.dialogButtonSize"
          type="primary"
          @click="dialogAnswerListVisible = false"
        >我知道了</el-button>
      </div>
    </el-dialog>
    <!-- 显示答案选项列表 -->
    <!-- 添加练习 -->
    <el-dialog
      :title="mode === 'add' ? '添加题目' : '编辑题目'"
      :visible.sync="dialogFormVisible"
      top="8vh"
    >
      <el-form
        :model="subjectModel"
        label-width="80px"
        class="dialog-container"
      >
        <el-form-item label="题目内容">
          <el-col :span="20">
            <el-input
              v-model="subjectModel.questionContent"
              placeholder="请输入题目内容（必填）"
              type="textarea"
              rows="3"
            />
          </el-col>
        </el-form-item>
        <el-form-item label="题目答案">
          <el-col :span="20">
            <el-input
              v-model="subjectModel.answer"
              placeholder="请输入题目答案（必填）"
            />
          </el-col>
        </el-form-item>
        <el-form-item label="答案解析">
          <el-col :span="20">
            <el-input
              v-model="subjectModel.analysis"
              placeholder="请输入答案解析（必填）"
              type="textarea"
              rows="3"
            />
          </el-col>
        </el-form-item>
        <el-form-item label="选项A">
          <el-col :span="20">
            <el-input
              v-model="subjectModel.aOption"
              placeholder="请输入选项 A 内容"
            />
          </el-col>
        </el-form-item>
        <el-form-item label="选项B">
          <el-col :span="20">
            <el-input
              v-model="subjectModel.bOption"
              placeholder="请输入选项 B 内容"
            />
          </el-col>
        </el-form-item>
        <el-form-item label="选项C">
          <el-col :span="20">
            <el-input
              v-model="subjectModel.cOption"
              placeholder="请输入选项 C 内容"
            />
          </el-col>
        </el-form-item>
        <el-form-item label="选项D">
          <el-col :span="20">
            <el-input
              v-model="subjectModel.dOption"
              placeholder="请输入选项 D 内容"
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
        >取 消</el-button>
        <el-button
          :size="$style.dialogButtonSize"
          type="primary"
          :loading="submitLoading"
          @click="submitSubject"
        >确 定</el-button>
      </div>
    </el-dialog>
    <!-- 添加练习 -->
    <!-- 上传Excel -->
    <el-dialog
      title="上传教材"
      :visible.sync="dialogUploadFormVisible"
    >
      <el-form class="dialog-container">
        <el-form-item>
          <el-col :span="22">
            <el-upload
              ref="excelUpload"
              class="upload-wrapper text-center"
              drag
              action="http://"
              :on-change="changeWordExcel"
              :on-remove="removeWordExcel"
              :auto-upload="false"
            >
              <i class="el-icon-upload" />
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            </el-upload>
          </el-col>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          :size="$style.dialogButtonSize"
          @click="dialogUploadFormVisible = false"
        >取消</el-button>
        <el-button
          :size="$style.dialogButtonSize"
          type="primary"
          :loading="uploadExcelLoading"
          @click="handlerUploadFormConfirm"
        >确定</el-button>
      </div>
    </el-dialog>
    <!-- 上传Excel -->
  </div>
</template>

<script>
import tableMixins from '@/mixins/table-mixins'
import checkLoadMixin from '@/mixins/check-load-mixin'
import { blobToExecl } from '@/api/common'
import { baseIp } from '@/api/url-path'
import axios from 'axios'
import { getToken } from '@/utils/auth'
export default {
  name: 'EveryDaySubject',
  mixins: [tableMixins, checkLoadMixin],
  data() {
    return {
      formModelArray: [
        {
          id: 1,
          value: '',
          label: '题目内容',
          name: 'questionContent',
          span: 20,
          type: 'input'
        }
      ],
      subjectModel: {
        questionContent: '', // 题干内容
        aOption: '', // A选项
        bOption: '', // B选项
        cOption: '', // C选项
        dOption: '', // D选项
        answer: '', // 答案
        analysis: ''// 解析
      },
      mode: 'add',
      dialogFormVisible: false,
      dialogAnswerListVisible: false,
      dialogUploadFormVisible: false,
      tempItem: null,
      uploadExcelLoading: false,
      headers: {
        'Authorization': `Bearer ${getToken()}`
      },
      fileList: [],
      excelFormData: new FormData()
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    initData() {
      this.likeSearchUrl = this.$urlPath.queryQuestionStoreList
    },
    statusFormatter(item) {
      return {
        type: item.status === 0 ? 'primary' : 'danger',
        label: item.status === 0 ? '正常' : '禁用'
      }
    },
    onAdd() {
      if (!this.checkButtonPermission('add')) {
        return
      }
      this.subjectModel = {
        questionContent: '', // 题干内容
        aOption: '', // A选项
        bOption: '', // B选项
        cOption: '', // C选项
        dOption: '', // D选项
        answer: '', // 答案
        analysis: ''// 解析
      }
      this.closeSubmitLoading()
      this.dialogFormVisible = true
    },
    getData() {
      this.$http({
        url: this.$urlPath.queryQuestionStoreList,
        methods: this.HTTP_GET,
        data: {
          pageNum: this.page,
          pageSize: this.pageSize
        }
      }).then(res => {
        this.onSuccess(res.obj)
      })
    },
    showAnswerList(item) {
      this.tempItem = item
      this.dialogAnswerListVisible = true
    },
    handlerUpdate(item) {
      if (!this.checkButtonPermission('edit')) {
        return
      }
      this.subjectModel = item
      this.mode = 'edit'
      this.closeSubmitLoading()
      this.dialogFormVisible = true
    },
    deleteItem(item) {
      if (!this.checkButtonPermission('delete')) {
        return
      }
      this.$warningConfirm('是否要删除此此题目，删除后不可恢复', _ => {
        this.$showLoading(closeLoading => {
          this.$http({
            url: this.$urlPath.deleteQuestionStore,
            data: {
              questionStoreId: item.questionStoreId
            }
          }).then(res => {
            this.$successMsg('删除成功')
            closeLoading()
            this.getData()
          }).catch(_ => {
            closeLoading()
          })
        })
      })
    },
    changeStatus(item) {
      if (item.status === 0 && !this.checkButtonPermission('disable')) {
        return
      }
      if (item.status === 1 && !this.checkButtonPermission('enable')) {
        return
      }
      this.$warningConfirm('是否要' + (item.status === 0 ? '禁用' : '启用') + '此题目？', _ => {
        this.$showLoading(closeLoading => {
          this.$http({
            url: this.$urlPath.updateQuestionStoreStatus,
            data: {
              questionStoreId: item.questionStoreId,
              status: item.status === 0 ? 1 : 0
            }
          }).then(res => {
            this.$successMsg('状态修改成功')
            closeLoading()
            this.getData()
          }).catch(_ => {
            closeLoading()
          })
        })
      })
    },
    submitSubject() {
      if (this.submitLoading) return
      if (!this.subjectModel.questionContent) {
        this.$errorMsg('请输入题目内容')
        return
      }
      if (!this.subjectModel.answer) {
        this.$errorMsg('请输入题目答案')
        return
      }
      if (!this.subjectModel.analysis) {
        this.$errorMsg('请输入题目解析')
        return
      }
      if (!this.subjectModel.aOption && !this.subjectModel.bOption && !this.subjectModel.cOption && !this.subjectModel.dOption) {
        this.$errorMsg('请输入至少一个题目选项')
        return
      }
      this.startSubmitLoading()
      if (this.mode === 'add') {
        this.$http({
          url: this.$urlPath.saveQuestionStore,
          data: {
            questionContent: this.subjectModel.questionContent, // 题干内容
            aOption: this.subjectModel.aOption, // A选项
            bOption: this.subjectModel.bOption, // B选项
            cOption: this.subjectModel.cOption, // C选项
            dOption: this.subjectModel.dOption, // D选项
            answer: this.subjectModel.answer, // 答案
            analysis: this.subjectModel.analysis// 解析
          }
        }).then(res => {
          this.closeSubmitLoading()
          this.$successMsg('添加成功')
          this.dialogFormVisible = false
          this.getData()
        }).catch(_ => {
          this.closeSubmitLoading()
        })
      } else {
        this.$http({
          url: this.$urlPath.editQuestionStore,
          data: {
            questionStoreId: this.subjectModel.questionStoreId,
            questionContent: this.subjectModel.questionContent, // 题干内容
            aOption: this.subjectModel.aOption, // A选项
            bOption: this.subjectModel.bOption, // B选项
            cOption: this.subjectModel.cOption, // C选项
            dOption: this.subjectModel.dOption, // D选项
            answer: this.subjectModel.answer, // 答案
            analysis: this.subjectModel.analysis// 解析
          }
        }).then(res => {
          this.closeSubmitLoading()
          this.$successMsg('修改成功')
          this.dialogFormVisible = false
          this.getData()
        }).catch(_ => {
          this.closeSubmitLoading()
        })
      }
    },
    downExcel() {
      if (!this.checkButtonPermission('down')) {
        return
      }
      this.$http({
        url: this.$urlPath.uploadQuestionStoreExcelTemplate,
        methods: this.HTTP_GET,
        data: {},
        responseType: `blob`
      }).then(res => {
        blobToExecl(res, '题库模板')
      })
    },
    importExcel() {
      if (!this.checkButtonPermission('upload')) {
        return
      }
      this.dialogUploadFormVisible = true
      this.uploadExcelLoading = false
      this.$nextTick(_ => {
        this.$refs.excelUpload.clearFiles()
        this.excelFormData.delete('excelFile')
      })
    },
    changeWordExcel(file, fileList) {
      this.excelFormData.append('excelFile', file.raw)
    },
    removeWordExcel(file, fileList) {
      this.excelFormData.delete('excelFile')
    },
    handlerUploadFormConfirm() {
      if (this.excelFormData.get('excelFile') === null) {
        this.$errorMsg('请上传数据文件')
        return
      }
      this.uploadExcelLoading = true
      axios.post(baseIp + this.$urlPath.importExcelQuestionStore, this.excelFormData, {
        headers: this.headers
      }).then(res => {
        this.dialogUploadFormVisible = false
        this.uploadExcelLoading = false
        if (res.status === 200) {
          if (res.data.status === 200) {
            this.$successMsg('文件上传成功')
            this.getData()
          } else {
            this.$errorMsg(res.data.msg)
          }
        } else {
          this.$errorMsg('文件上传失败')
        }
      }).catch(_ => {
        this.uploadExcelLoading = false
        this.$errorMsg('文件上传失败')
      })
    }
  }
}
</script>
