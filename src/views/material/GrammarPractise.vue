<template>
  <div class="container">
    <table-header
      ref="tableHeader"
      title="选择教材"
      :form-model-array="formModelArray"
      :show-delete="false"
      :show-add="true"
      :show-search="true"
      :can-collapse="false"
      @onsearch="onSearch"
      @onadd="onAdd"
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
          width="100"
        >
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="subject"
          label="题目"
          width="400"
        />
        <el-table-column
          align="center"
          prop="answer"
          label="答案"
          width="150"
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
          width="230"
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
      title="选项"
      :visible.sync="dialogAnswerListVisible"
    >
      <div
        v-if="tempItem"
        class="padding"
      >
        <h3 style="margin-bottom: 40px">{{ tempItem && (tempItem.subject + '(' + subjectTypeFormat(tempItem) + ')') }}</h3>
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
        <h4 :style="{ color: tempItem.answer.indexOf('E') !== -1 ? '#67C23A' : '#909399', marginLeft: '20px' }">
          E：{{ tempItem && tempItem.eOption }}
        </h4>
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
        :model="practiceModel"
        label-width="80px"
        class="dialog-container"
      >
        <el-form-item label="选择教材">
          <el-col :span="20">
            <el-select
              v-model="practiceModel.textBookId"
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
              v-model="practiceModel.courseCode"
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
              v-model="practiceModel.levelCode"
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
              v-model="practiceModel.knowledgeId"
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
        <el-form-item label="选择题型">
          <el-col :span="20">
            <el-radio-group
              v-model="practiceModel.subjectType"
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
        <el-form-item label="题目名称">
          <el-col :span="20">
            <el-input
              v-model="practiceModel.subject"
              placeholder="请输入题目名称（必填）"
              type="textarea"
              rows="3"
            />
          </el-col>
        </el-form-item>
        <el-form-item label="题目答案">
          <el-col :span="20">
            <el-input
              v-model="practiceModel.answer"
              placeholder="请输入题目答案（必填）"
            />
          </el-col>
        </el-form-item>
        <el-form-item
          v-show="practiceModel.subjectType !== 1"
          label="选项A"
        >
          <el-col :span="20">
            <el-input
              v-model="practiceModel.aOption"
              placeholder="请输入选项 A 内容"
            />
          </el-col>
        </el-form-item>
        <el-form-item
          v-show="practiceModel.subjectType !== 1"
          label="选项B"
        >
          <el-col :span="20">
            <el-input
              v-model="practiceModel.bOption"
              placeholder="请输入选项 B 内容"
            />
          </el-col>
        </el-form-item>
        <el-form-item
          v-show="practiceModel.subjectType !== 1"
          label="选项C"
        >
          <el-col :span="20">
            <el-input
              v-model="practiceModel.cOption"
              placeholder="请输入选项 C 内容"
            />
          </el-col>
        </el-form-item>
        <el-form-item
          v-show="practiceModel.subjectType !== 1"
          label="选项D"
        >
          <el-col :span="20">
            <el-input
              v-model="practiceModel.dOption"
              placeholder="请输入选项 D 内容"
            />
          </el-col>
        </el-form-item>
        <el-form-item
          v-show="practiceModel.subjectType !== 1"
          label="选项E"
        >
          <el-col :span="20">
            <el-input
              v-model="practiceModel.eOption"
              placeholder="请输入选项 E 内容"
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
        span: 5,
        type: 'select',
        selectOptions: []
      },
      levelSelectModel: {
        id: 2,
        value: '',
        label: '关卡编码',
        name: 'levelCode',
        span: 5,
        type: 'select',
        selectOptions: []
      },
      knowledgeSelectModel: {
        id: 3,
        value: '',
        label: '知识点',
        name: 'knowledgeId',
        span: 5,
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
      practiceModel: {
        textBookId: '', // 所属教材主键ID
        courseCode: '', // 所属课程编码
        levelCode: '', // 所属关卡编码
        knowledgeId: '', // 所属知识点主键ID
        subject: '', // 题目
        answer: '', // 答案
        aOption: '', // A选项
        bOption: '', // B选项
        cOption: '', // C选项
        dOption: '', // D选项
        eOption: '', // E选项
        subjectType: 1 // 题目类型(1填空，2单选，3有序多选，4无序多选
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
    'practiceModel.textBookId'(newVal, oldVal) {
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
    'practiceModel.courseCode'(newVal, oldVal) {
      this.getLevelList(this.textBookId, newVal)
    }
  },
  created() {
    this.formModelArray.push(this.courseSelectModel)
    this.formModelArray.push(this.levelSelectModel)
    this.formModelArray.push(this.knowledgeSelectModel)
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
    })
  },
  methods: {
    initData() {
      this.likeSearchUrl = this.$urlPath.queryPracticeList
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
      this.practiceModel = {
        textBookId: '', // 所属教材主键ID
        courseCode: '', // 所属课程编码
        levelCode: '', // 所属关卡编码
        knowledgeId: '', // 所属知识点主键ID
        subject: '', // 题目
        answer: '', // 答案
        aOption: '', // A选项
        bOption: '', // B选项
        cOption: '', // C选项
        dOption: '', // D选项
        eOption: '', // E选项
        subjectType: 1 // 题目类型(1填空，2单选，3有序多选，4无序多选
      }
    },
    handlerUpdate(item) {
      this.mode = 'edit'
      this.dialogFormVisible = true
      this.practiceModel = item
    },
    deleteItem(item) {
      this.$warningConfirm('确定要删除此练习题吗，删除后不可恢复', _ => {
        this.$showLoading(closeLoading => {
          this.$http({
            url: this.$urlPath.deletePractice,
            data: {
              practiceId: item.practiceId
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
        url: this.$urlPath.queryPracticeList,
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
              url: this.$urlPath.updatePracticeIsDisable,
              data: {
                practiceId: item.practiceId
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
              url: this.$urlPath.updatePracticeIsEnable,
              data: {
                practiceId: item.practiceId
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
      if (!this.practiceModel.textBookId) {
        this.$errorMsg('请选择教材')
        return
      }
      if (!this.practiceModel.courseCode) {
        this.$errorMsg('请选择课程')
        return
      }
      if (!this.practiceModel.levelCode) {
        this.$errorMsg('请选择关卡')
        return
      }
      if (!this.practiceModel.knowledgeId) {
        this.$errorMsg('请选择知识点')
        return
      }
      if (!this.practiceModel.subject) {
        this.$errorMsg('请输入题目')
        return
      }
      if (!this.practiceModel.answer) {
        this.$errorMsg('请输入答案')
        return
      }
      if (this.practiceModel.subjectType !== 1) {
        if (!this.practiceModel.aOption || !this.practiceModel.bOption ||
          !this.practiceModel.cOption || !this.practiceModel.dOption || !this.practiceModel.eOption) {
          this.$errorMsg('请输入选项')
          return
        }
      }
      if (this.mode === 'add') {
        this.$showLoading(closeLoading => {
          this.$http({
            url: this.$urlPath.savePractice,
            data: {
              textBookId: this.practiceModel.textBookId,
              courseCode: this.practiceModel.courseCode,
              levelCode: this.practiceModel.levelCode,
              knowledgeId: this.practiceModel.knowledgeId,
              subject: this.practiceModel.subject,
              answer: this.practiceModel.answer,
              aOption: this.practiceModel.aOption,
              bOption: this.practiceModel.bOption,
              cOption: this.practiceModel.cOption,
              dOption: this.practiceModel.dOption,
              eOption: this.practiceModel.eOption,
              subjectType: this.practiceModel.subjectType
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
            url: this.$urlPath.editPractice,
            data: {
              practiceId: this.practiceModel.practiceId,
              textBookId: this.practiceModel.textBookId,
              courseCode: this.practiceModel.courseCode,
              levelCode: this.practiceModel.levelCode,
              knowledgeId: this.practiceModel.knowledgeId,
              subject: this.practiceModel.subject,
              answer: this.practiceModel.answer,
              aOption: this.practiceModel.aOption,
              bOption: this.practiceModel.bOption,
              cOption: this.practiceModel.cOption,
              dOption: this.practiceModel.dOption,
              eOption: this.practiceModel.eOption,
              subjectType: this.practiceModel.subjectType
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
