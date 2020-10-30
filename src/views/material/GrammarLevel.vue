<template>
  <div class="container">
    <table-header
      ref="tableHeader"
      title="选择教材"
      :form-model-array="formModelArray"
      :show-delete="false"
      :show-add="true"
      :show-search="true"
      :can-collapse="true"
      @onsearch="onSearch"
      @onadd="onAdd"
      @table-header-collapse="onCollapsed"
    >
      <template slot="center">
        <el-select
          v-model="textBookId"
          class="margin-left"
          size="small"
          style="width: 40%"
          placeholder="请选择教材"
        >
          <el-option
            v-for="item of materialList"
            :key="item.textbookId"
            :label="item.textbookName"
            :value="item.textbookId"
          />
        </el-select>
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
            <div style="white-space: pre-wrap; word-wrap:break-word;">{{ scope.row.subject }}</div>
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
          prop="levelName"
          label="关卡名称"
          width="180"
        />
        <el-table-column
          align="center"
          prop="levelCode"
          label="关卡编码"
          width="80"
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
        <h3 style="margin-bottom: 20px; white-space: pre-wrap; over-flow:">{{ tempItem && (tempItem.subject + '(' + subjectTypeFormat(tempItem) + ')') }}</h3>
        <h4 style="margin-bottom: 20px; white-space: pre-wrap; over-flow:">{{ tempItem.meaning }}</h4>
        <h4 style="margin-bottom: 40px; ">{{ '题目来源：' + tempItem.source }}</h4>
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
      :title="mode === 'add' ? '添加练习' : '编辑练习'"
      :visible.sync="dialogFormVisible"
      top="8vh"
    >
      <el-form
        :model="practicePassModel"
        label-width="80px"
        class="dialog-container"
      >
        <el-form-item label="选择教材">
          <el-col :span="20">
            <el-select
              v-model="practicePassModel.textBookId"
              style="width: 100%"
              placeholder="请选择教材"
            >
              <el-option
                v-for="item of materialList"
                :key="item.textbookId"
                :label="item.textbookName"
                :value="item.textbookId"
              />
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="选择课程">
          <el-col :span="20">
            <el-select
              v-model="practicePassModel.courseCode"
              style="width: 100%"
              placeholder="请选择教材"
            >
              <el-option
                v-for="item of courseList"
                :key="item.courseId"
                :label="item.courseName"
                :value="item.courseCode"
              />
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="选择关卡">
          <el-col :span="20">
            <el-select
              v-model="practicePassModel.levelCode"
              style="width: 100%"
              placeholder="请选择关卡"
            >
              <el-option
                v-for="item of levelList"
                :key="item.levelId"
                :label="item.levelName"
                :value="item.levelCode"
              />
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="知识点">
          <el-col :span="20">
            <el-select
              v-model="practicePassModel.knowledgeId"
              style="width: 100%"
              placeholder="请选择知识点"
            >
              <el-option
                v-for="item of knowledgeList"
                :key="item.knowledgeId"
                :label="item.knowledgeName"
                :value="item.knowledgeId"
              />
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="选择考点">
          <el-col :span="20">
            <el-select
              v-model="practicePassModel.knowledgeExamId"
              style="width: 100%"
              placeholder="请选择考点"
            >
              <el-option
                v-for="item of knowledgeExamList"
                :key="item.knowledgeExamId"
                :label="item.knowledgeExamName"
                :value="item.knowledgeExamId"
              />
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="选择题型">
          <el-col :span="20">
            <el-radio-group
              v-model="practicePassModel.subjectType"
              size="mini"
            >
              <el-radio-button
                v-for="item of subjectTypes"
                :key="item.value"
                :label="item.value"
              >
                {{ item.name }}
              </el-radio-button>
            </el-radio-group>
          </el-col>
        </el-form-item>
        <el-form-item label="题目来源">
          <el-col :span="20">
            <el-input
              v-model="practicePassModel.source"
              placeholder="请输入题目题目来源（必填）"
            />
          </el-col>
        </el-form-item>
        <el-form-item label="题目名称">
          <el-col :span="20">
            <el-input
              v-model="practicePassModel.subject"
              placeholder="请输入题目名称（必填）"
              type="textarea"
              rows="3"
            />
          </el-col>
        </el-form-item>
        <el-form-item label="题目句意">
          <el-col :span="20">
            <el-input
              v-model="practicePassModel.meaning"
              placeholder="请输入题目句意（必填）"
              type="textarea"
              rows="3"
            />
          </el-col>
        </el-form-item>
        <el-form-item label="题目答案">
          <el-col :span="20">
            <el-input
              v-model="practicePassModel.answer"
              placeholder="请输入题目答案（必填）"
            />
          </el-col>
        </el-form-item>
        <el-form-item label="答案解析">
          <el-col :span="20">
            <el-input
              v-model="practicePassModel.analysis"
              placeholder="请输入答案解析（必填）"
            />
          </el-col>
        </el-form-item>
        <el-form-item
          v-show="practicePassModel.subjectType !== 1"
          label="选项A"
        >
          <el-col :span="20">
            <el-input
              v-model="practicePassModel.aOption"
              placeholder="请输入选项 A 内容"
            />
          </el-col>
        </el-form-item>
        <el-form-item
          v-show="practicePassModel.subjectType !== 1"
          label="选项B"
        >
          <el-col :span="20">
            <el-input
              v-model="practicePassModel.bOption"
              placeholder="请输入选项 B 内容"
            />
          </el-col>
        </el-form-item>
        <el-form-item
          v-show="practicePassModel.subjectType !== 1"
          label="选项C"
        >
          <el-col :span="20">
            <el-input
              v-model="practicePassModel.cOption"
              placeholder="请输入选项 C 内容"
            />
          </el-col>
        </el-form-item>
        <el-form-item
          v-show="practicePassModel.subjectType !== 1"
          label="选项D"
        >
          <el-col :span="20">
            <el-input
              v-model="practicePassModel.dOption"
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
          @click="submitPractice"
        >确 定</el-button>
      </div>
    </el-dialog>
    <!-- 添加练习 -->
  </div>
</template>

<script>
import tableMixins from '@/mixins/table-mixins'
import materialMixins from '@/mixins/material-mixins'
export default {
  name: 'GrammarPractise',
  mixins: [tableMixins, materialMixins],
  data() {
    return {
      courseSelectModel: {
        id: 1,
        value: '',
        label: '课程编码',
        name: 'courseCode',
        span: 3,
        type: 'select',
        selectOptions: []
      },
      levelSelectModel: {
        id: 2,
        value: '',
        label: '关卡编码',
        name: 'levelCode',
        span: 3,
        type: 'select',
        selectOptions: []
      },
      knowledgeSelectModel: {
        id: 3,
        value: '',
        label: '知识点',
        name: 'knowledgeId',
        span: 3,
        type: 'select',
        selectOptions: []
      },
      knowledgeExamSelectModel: {
        id: 4,
        value: '',
        label: '选择考点',
        name: 'knowledgeExamId',
        span: 3,
        type: 'select',
        selectOptions: []
      },
      formModelArray: [],
      textBookId: '',
      dialogAnswerListVisible: false,
      tempItem: null,
      dialogFormVisible: false,
      mode: 'add',
      subjectTypes: [
        {
          name: '填空',
          value: 1
        },
        {
          name: '单选',
          value: 2
        },
        {
          name: '有序多选',
          value: 3
        },
        {
          name: '无序多选',
          value: 4
        }
      ],
      practicePassModel: {
        textBookId: '', // 所属教材主键ID
        courseCode: '', // 所属课程编码
        levelCode: '', // 所属关卡编码
        knowledgeId: '', // 所属知识点主键ID
        knowledgeExamId: '', // 所属考点ID
        source: '', // 来源
        subject: '', // 题目
        answer: '', // 答案
        meaning: '', // 句意
        analysis: '', // 解析
        aOption: '', // A选项
        bOption: '', // B选项
        cOption: '', // C选项
        dOption: '', // D选项
        eOption: '', // E选项
        subjectType: 2 // 题目类型(1填空，2单选，3有序多选，4无序多选
      }
    }
  },
  watch: {
    textBookId(newVal, oldVal) {
      if (!newVal) return
      this.courseSelectModel.selectOptions = []
      this.levelSelectModel.selectOptions = []
      this.getData()
      this.getCourseList(this.textBookId, _ => {
        this.courseSelectModel.selectOptions = this.courseList.map(it => {
          return {
            label: it.courseName,
            value: it.courseCode
          }
        })
      })
    },
    'practicePassModel.textBookId'(newVal, oldVal) {
      this.getCourseList(this.textBookId)
    },
    'courseSelectModel.value'(newVal, oldVal) {
      if (newVal) {
        this.levelSelectModel.selectOptions = []
        this.getLevelList(this.textBookId, newVal, _ => {
          this.levelSelectModel.selectOptions = this.levelList.map(it => {
            return {
              label: it.levelName,
              value: it.levelCode
            }
          })
        })
      }
    },
    'practicePassModel.courseCode'(newVal, oldVal) {
      this.getLevelList(this.textBookId, newVal)
    }
  },
  created() {
    this.formModelArray.push(this.courseSelectModel)
    this.formModelArray.push(this.levelSelectModel)
    this.formModelArray.push(this.knowledgeSelectModel)
    this.formModelArray.push(this.knowledgeExamSelectModel)
  },
  mounted() {
    this.getMaterialList(this.$urlPath.queryGrammarTextBookList, _ => {
      if (!this.materialList || this.materialList.length === 0) {
        this.loading = false
        return
      }
      this.textBookId = this.materialList[0].textbookId
      this.getCourseList(this.textBookId, _ => {
        this.courseSelectModel.selectOptions = this.courseList.map(it => {
          return {
            label: it.courseName,
            value: it.courseCode
          }
        })
      })
      this.getKnowledgeList(_ => {
        this.knowledgeSelectModel.selectOptions = this.knowledgeList.map(it => {
          return {
            label: it.knowledgeName,
            value: it.knowledgeId
          }
        })
      })
      this.getKnowledgeExamList(_ => {
        this.knowledgeExamSelectModel.selectOptions = this.knowledgeExamList.map(it => {
          return {
            label: it.knowledgeExamName,
            value: it.knowledgeExamId
          }
        })
      })
    })
  },
  methods: {
    initData() {
      this.likeSearchUrl = this.$urlPath.queryPracticePassList
    },
    statusFormatter(item) {
      switch (item.status) {
        case 0:
          return {
            label: '正常',
            value: 0
          }
        case 1:
          return {
            label: '禁用',
            value: 1
          }
      }
    },
    subjectTypeFormat(item) {
      switch (item.subjectType) {
        case 1:
          return '填空'
        case 2:
          return '单选'
        case 3:
          return '有序多选'
        case 4:
          return '无序多选'
      }
    },
    externalParam(form) {
      form.textBookId = this.textBookId
    },
    onAdd() {
      this.mode = 'add'
      this.dialogFormVisible = true
      this.practicePassModel = {
        textBookId: '', // 所属教材主键ID
        courseCode: '', // 所属课程编码
        levelCode: '', // 所属关卡编码
        knowledgeId: '', // 所属知识点主键ID
        knowledgeExamId: '', // 所属考点ID
        source: '', // 来源
        subject: '', // 题目
        answer: '', // 答案
        meaning: '', // 句意
        analysis: '', // 解析
        aOption: '', // A选项
        bOption: '', // B选项
        cOption: '', // C选项
        dOption: '', // D选项
        eOption: '', // E选项
        subjectType: 2 // 题目类型(1填空，2单选，3有序多选，4无序多选
      }
    },
    handlerUpdate(item) {
      this.mode = 'edit'
      this.dialogFormVisible = true
      this.practicePassModel = item
    },
    deleteItem(item) {
      this.$warningConfirm('确定要删除此练习题吗，删除后不可恢复', _ => {
        this.$showLoading(closeLoading => {
          this.$http({
            url: this.$urlPath.deletePracticePass,
            data: {
              practicePassId: item.practicePassId
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
    getData() {
      this.$http({
        url: this.$urlPath.queryPracticePassList,
        methods: this.HTTP_GET,
        data: {
          pageNum: this.page,
          pageSize: this.pageSize,
          textBookId: this.textBookId
        }
      }).then(res => {
        this.onSuccess(res.obj)
      })
    },
    showAnswerList(item) {
      this.tempItem = item
      this.dialogAnswerListVisible = true
    },
    changeStatus(item) {
      if (item.status === 0) {
        this.$warningConfirm('是否要禁用此练习？', _ => {
          this.$showLoading(closeLoading => {
            this.$http({
              url: this.$urlPath.updatePracticePassIsDisable,
              data: {
                practicePassId: item.practicePassId
              }
            }).then(res => {
              closeLoading()
              this.$successMsg('禁用成功')
              this.getData()
            }).catch(_ => {
              closeLoading()
            })
          })
        })
      } else {
        this.$warningConfirm('是否要启用此练习？', _ => {
          this.$showLoading(closeLoading => {
            this.$http({
              url: this.$urlPath.updatePracticePassIsEnable,
              data: {
                practicePassId: item.practicePassId
              }
            }).then(res => {
              closeLoading()
              this.$successMsg('启用成功')
              this.getData()
            }).catch(_ => {
              closeLoading()
            })
          })
        })
      }
    },
    submitPractice() {
      if (!this.practicePassModel.textBookId) {
        this.$errorMsg('请选择教材')
        return
      }
      if (!this.practicePassModel.courseCode) {
        this.$errorMsg('请选择课程')
        return
      }
      if (!this.practicePassModel.levelCode) {
        this.$errorMsg('请选择关卡')
        return
      }
      if (!this.practicePassModel.knowledgeId) {
        this.$errorMsg('请选择知识点')
        return
      }
      if (!this.practicePassModel.knowledgeExamId) {
        this.$errorMsg('请选择考点')
        return
      }
      if (!this.practicePassModel.source) {
        this.$errorMsg('请输入题目来源')
        return
      }
      if (!this.practicePassModel.subject) {
        this.$errorMsg('请输入题目')
        return
      }
      if (!this.practicePassModel.meaning) {
        this.$errorMsg('请输入句意')
        return
      }
      if (!this.practicePassModel.answer) {
        this.$errorMsg('请输入答案')
        return
      }
      if (!this.practicePassModel.analysis) {
        this.$errorMsg('请输入答案解析')
        return
      }
      if (!this.practicePassModel.aOption || !this.practicePassModel.bOption ||
        !this.practicePassModel.cOption || !this.practicePassModel.dOption) {
        this.$errorMsg('请输入选项')
        return
      }
      if (this.mode === 'add') {
        this.$showLoading(closeLoading => {
          this.$http({
            url: this.$urlPath.savePracticePass,
            data: {
              textBookId: this.practicePassModel.textBookId,
              courseCode: this.practicePassModel.courseCode,
              levelCode: this.practicePassModel.levelCode,
              knowledgeId: this.practicePassModel.knowledgeId,
              knowledgeExamId: this.practicePassModel.knowledgeExamId,
              source: this.practicePassModel.source,
              subject: this.practicePassModel.subject,
              meaning: this.practicePassModel.meaning,
              answer: this.practicePassModel.answer,
              analysis: this.practicePassModel.analysis,
              aOption: this.practicePassModel.aOption,
              bOption: this.practicePassModel.bOption,
              cOption: this.practicePassModel.cOption,
              dOption: this.practicePassModel.dOption,
              subjectType: this.practicePassModel.subjectType
            }
          }).then(res => {
            this.dialogFormVisible = false
            closeLoading()
            this.$successMsg('保存成功')
            this.getData()
          }).catch(_ => {
            closeLoading()
          })
        })
      } else {
        this.$showLoading(closeLoading => {
          this.$http({
            url: this.$urlPath.editPracticePass,
            data: {
              practicePassId: this.practicePassModel.practicePassId,
              textBookId: this.practicePassModel.textBookId,
              courseCode: this.practicePassModel.courseCode,
              levelCode: this.practicePassModel.levelCode,
              knowledgeId: this.practicePassModel.knowledgeId,
              knowledgeExamId: this.practicePassModel.knowledgeExamId,
              source: this.practicePassModel.source,
              subject: this.practicePassModel.subject,
              meaning: this.practicePassModel.meaning,
              answer: this.practicePassModel.answer,
              analysis: this.practicePassModel.analysis,
              aOption: this.practicePassModel.aOption,
              bOption: this.practicePassModel.bOption,
              cOption: this.practicePassModel.cOption,
              dOption: this.practicePassModel.dOption,
              subjectType: this.practicePassModel.subjectType
            }
          }).then(res => {
            this.dialogFormVisible = false
            closeLoading()
            this.$successMsg('编辑成功')
            this.getData()
          }).catch(_ => {
            closeLoading()
          })
        })
      }
    }
  }
}
</script>
