<template>
  <div>
    <table-header
      ref="tableHeader"
      :show-add="true"
      :show-delete="false"
      :show-search="true"
      @onadd="onAdd"
    >
      <template slot="center">
        <el-radio-group
          v-if="!$isPhone"
          v-model="status"
          size="mini"
          class="margin-left"
        >
          <el-radio-button :label="0">未开始</el-radio-button>
          <el-radio-button :label="1">进行中</el-radio-button>
          <el-radio-button :label="2">已结束</el-radio-button>
        </el-radio-group>
        <el-select
          v-else
          v-model="status"
          size="mini"
          class="margin-left"
        >
          <el-option
            label="未开始"
            :value="0"
          />
          <el-option
            label="进行中"
            :value="1"
          />
          <el-option
            label="已结束"
            :value="2"
          />
        </el-select>
      </template>
    </table-header>
    <el-card
      ref="tableContainer"
      :body-style="{ padding: '2px' }"
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
        :height="tableConfig.style.myHeight"
      >
        <el-table-column
          align="center"
          label="名称"
          prop="examName"
          width="130"
          :fixed="$isPhone ? false : 'left'"
        />
        <el-table-column
          align="center"
          label="题目数量"
          prop="practicePassNum"
        />
        <el-table-column
          align="center"
          label="开始时间"
          prop="beginExamTime"
          width="160"
        >
          <template slot-scope="scope">
            {{ scope.row.beginExamTime | parseTime }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="考试时长"
          width="160"
        >
          <template slot-scope="scope">
            <div class="text-cut">
              {{ scope.row.useExamTime + '分钟' }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="到期时间"
          prop="endExamTime"
          width="160"
        >
          <template slot-scope="scope">
            {{ scope.row.endExamTime | parseTime }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="考试类型"
          prop="rewardType"
        >
          <template slot-scope="scope">
            <div class="text-cut">
              <el-link
                v-if="scope.row.examType === 0"
                type="danger"
                :underline="false"
              >线下</el-link>
              <el-link
                v-else
                type="primary"
                :underline="false"
              >线上</el-link>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="分配状态"
          prop="rewardType"
        >
          <template slot-scope="scope">
            <div class="text-cut">
              <el-link
                v-if="scope.row.isAssignment === 0"
                type="danger"
                :underline="false"
              >未分配</el-link>
              <el-link
                v-else
                type="primary"
                :underline="false"
              >已分配</el-link>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="分配类型"
          prop="rewardType"
        >
          <template slot-scope="scope">
            <div class="text-cut">
              <el-link
                v-if="scope.row.classOrStudent === 0"
                type="danger"
                :underline="false"
              >班级</el-link>
              <el-link
                v-else-if="scope.row.classOrStudent === 1"
                type="primary"
                :underline="false"
              >个人</el-link>
              <el-link
                v-else
                type="primary"
                :underline="false"
              >暂无</el-link>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="是否发布"
          prop="rewardType"
        >
          <template slot-scope="scope">
            <div class="text-cut">
              <el-link
                v-if="scope.row.isOpen === 0"
                type="danger"
                :underline="false"
              >未发布</el-link>
              <el-link
                v-else
                type="primary"
                :underline="false"
              >已发布</el-link>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="创建时间"
          prop="createTime"
          width="180"
        >
          <template slot-scope="scope">
            <div class="text-cut">
              {{ scope.row.createTime | parseTime }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="操作"
          :fixed="$isPhone ? false : 'right'"
          width="200"
        >
          <template slot-scope="scope">
            <div>
              <el-dropdown
                split-button
                type="primary"
                size="mini"
                @command="more"
              >
                查看
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item :command="{type: 0, item: scope.row}">题目信息</el-dropdown-item>
                  <el-dropdown-item :command="{type: 1, item: scope.row}">考试成绩</el-dropdown-item>
                  <el-dropdown-item :command="{type: 2, item: scope.row}">分配的班级</el-dropdown-item>
                  <el-dropdown-item :command="{type: 3, item: scope.row}">分配的个人</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <el-dropdown
                split-button
                type="danger"
                size="mini"
                @command="assignment"
              >
                分配
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item :command="{type: 0, item: scope.row}">到班级</el-dropdown-item>
                  <el-dropdown-item :command="{type: 1, item: scope.row}">到个人</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
            <div class="margin-top">
              <el-button
                :size="$style.tableButtonSize"
                type="warning"
                style="width: 86px"
                @click="open(scope.row)"
              >发布</el-button>
              <el-dropdown
                split-button
                type="success"
                size="mini"
                @command="down"
              >
                下载
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item :command="{type: 1, item: scope.row}">有答案</el-dropdown-item>
                  <el-dropdown-item :command="{type: 0, item: scope.row}">无答案</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
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
    <add-grammar-test-paper
      ref="addTestPaper"
      @reload="reload"
    />
    <student-list
      ref="studentList"
      @confirm="chooseStudentConfirm"
    />
    <class-list
      ref="classList"
      @confirm="chooseClassConfirm"
    />
    <student-score
      ref="studentScore"
      :exam-item="examItem"
    />
    <!--  选择的题目  -->
    <el-drawer
      :visible.sync="drawerSubjectList"
      direction="rtl"
      :with-header="false"
      size="60%"
    >
      <div class="padding">
        <div class="flex justify-between align-center">
          <el-button
            type="primary"
            size="mini"
            @click="drawerWordList = false"
          >关闭</el-button>
        </div>
        <el-table
          v-loading="subjectListLoading"
          :stripe="tableConfig.stripe"
          :header-cell-style="tableConfig.headerCellStyle"
          :data="subjectList"
          :border="tableConfig.border"
          :size="tableConfig.size"
          :default-sort="tableConfig.defalutSort"
          :style="tableConfig.style"
          height="90vh"
        >
          <el-table-column
            align="center"
            label="题目"
            prop="subject"
          >
            <template slot-scope="scope">
              <div style="white-space: pre">{{ scope.row.subject }}</div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="答案"
            prop="answer"
            width="80"
          >
            <template slot-scope="scope">
              <el-link type="primary" size="mini" @click="showAnswerList(scope.row)">{{ scope.row.answer }}</el-link>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-drawer>
    <!-- 显示答案选项列表 -->
    <el-dialog
      title="答案解析"
      :visible.sync="dialogAnswerListVisible"
    >
      <div v-if="tempItem" class="padding">
        <h3 style="margin-bottom: 20px; white-space: pre-wrap; over-flow:">{{ tempItem && (tempItem.subject + '单选') }}</h3>
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
  </div>
</template>

<script>
import tableMixins from '@/mixins/table-mixins'
import AddGrammarTestPaper from './AddGrammarTestPaper'
import StudentList from './StudentList'
import ClassList from './ClassList'
import StudentScore from './StudentScore'
import { baseImageIp } from '@/api/url-path'
export default {
  name: 'TestPaperGrammar',
  components: {
    AddGrammarTestPaper,
    StudentList,
    ClassList,
    StudentScore
  },
  mixins: [tableMixins],
  data() {
    return {
      examItem: null,
      status: 0,
      subjectListLoading: false,
      drawerSubjectList: false,
      subjectList: [],
      dialogAnswerListVisible: false,
      tempItem: null
    }
  },
  watch: {
    status(newVal) {
      this.page = 1
      this.loading = true
      this.getData()
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    onAdd() {
      this.$refs.addTestPaper.show()
    },
    getData() {
      this.$http({
        url: this.$urlPath.queryExamList,
        methods: this.HTTP_GET,
        data: {
          schoolId: this.$store.getters.schoolId,
          pageNum: this.page,
          pageSize: this.pageSize,
          status: this.status,
          textbookType: 1
        }
      }).then(res => {
        this.onSuccess(res.obj)
      }).catch(_ => {
        this.onError()
      })
    },
    more({ type, item }) {
      this.examItem = item
      switch (type) {
        case 0: // 题目
          if (!this.checkButtonPermission('paper_word_list')) {
            return
          }
          this.drawerSubjectList = true
          this.subjectListLoading = true
          this.$http({
            url: this.$urlPath.queryExamPracticePassInfo,
            methods: this.HTTP_GET,
            data: {
              examId: this.examItem.examId
            }
          }).then(res => {
            this.subjectListLoading = false
            this.subjectList = res.obj
          }).catch(_ => {
            this.subjectListLoading = false
          })
          break
        case 1: // 考试成绩
          if (!this.checkButtonPermission('exam_score')) {
            return
          }
          this.$nextTick(_ => {
            this.$refs.studentScore.show()
          })
          break
        case 2: // 查看分配的班级
          if (!this.checkButtonPermission('exam_class')) {
            return
          }
          if (item.isAssignment === 0) {
            this.$errorMsg('此考试信息还未分配')
            return
          }
          if (item.classOrStudent === 1) {
            this.$errorMsg('此考试已经分配给了个人')
            return
          }
          this.$refs.classList.show('select', this.examItem.examId, this.examItem.classOrStudent)
          break
        case 3: // 查看分配的个人
          if (!this.checkButtonPermission('exam_stu')) {
            return
          }
          if (item.isAssignment === 0) {
            this.$errorMsg('此考试信息还未分配')
            return
          }
          if (item.classOrStudent === 0) {
            this.$errorMsg('此考试已经分配给了班级')
            return
          }
          this.$refs.studentList.show('select', this.examItem.examId, this.examItem.classOrStudent)
          break
      }
    },
    assignment({ type, item }) {
      if (item.isAssignment === 1) {
        this.$errorMsg('此考试信息已经分配过了，请勿重复分配')
        return
      }
      if (type === 0) {
        if (!this.checkButtonPermission('assign_class')) {
          return
        }
        item.classOrStudent = 0
        this.$refs.classList.show('choose')
      } else {
        if (!this.checkButtonPermission('assign_student')) {
          return
        }
        item.classOrStudent = 1
        this.$refs.studentList.show('choose')
      }
      this.examItem = item
    },
    open(item) {
      if (!this.checkButtonPermission('open_exam')) {
        return
      }
      this.examItem = item
      if (item.isAssignment === 0) {
        this.$errorMsg('请先将此考试信息分配给班级或个人')
        return
      }
      if (item.isOpen === 1) {
        this.$errorMsg('此考试信息已经发布，请勿重复发布')
        return
      }
      this.$warningConfirm('是否要发布此考试信息？', () => {
        this.$showLoading(closeLoading => {
          this.$http({
            url: this.$urlPath.openExam,
            methods: this.HTTP_POST,
            data: {
              examId: this.examItem.examId,
              classOrStudent: this.examItem.classOrStudent,
              examName: this.examItem.examName
            }
          }).then(res => {
            closeLoading()
            this.$successMsg('发布成功')
            this.getData()
          }).catch(_ => {
            closeLoading()
          })
        })
      })
    },
    down({ type, item }) {
      if (type === 1) {
        if (!this.checkButtonPermission('down_answer')) {
          return
        }
      } else {
        if (!this.checkButtonPermission('down_no_answer')) {
          return
        }
      }
      this.examItem = item
      if (item.isAssignment === 1 && item.isOpen === 1) {
        this.$showLoading(closeLoading => {
          this.$http({
            url: type === 1 ? this.$urlPath.downLoadExamWithAnswer : this.$urlPath.downLoadExamNoAnswer,
            methods: this.HTTP_GET,
            data: {
              examId: this.examItem.examId
            }
          }).then(res => {
            closeLoading()
            window.open(baseImageIp + res.obj.replace('/opt/nginx/yxvue/dist', ''))
          }).catch(_ => {
            closeLoading()
          })
        })
      } else {
        this.$errorMsg('只有已分配并且已发布的考试信息才能下载')
      }
    },
    chooseClassConfirm(classList) {
      this.$showLoading(closeLoading => {
        this.$http({
          url: this.$urlPath.assignmentExamToClassOrStudent,
          methods: this.HTTP_POST,
          data: {
            examId: this.examItem.examId,
            schoolId: this.$store.getters.schoolId,
            classOrStudent: 0,
            classIds: classList.map(it => it.classId).join(',')
          }
        }).then(res => {
          closeLoading()
          this.$successMsg('分配成功')
          this.getData()
        }).catch(_ => {
          closeLoading()
        })
      })
    },
    chooseStudentConfirm(studentList) {
      this.$showLoading(closeLoading => {
        this.$http({
          url: this.$urlPath.assignmentExamToClassOrStudent,
          methods: this.HTTP_POST,
          data: {
            examId: this.examItem.examId,
            schoolId: this.$store.getters.schoolId,
            classOrStudent: 1,
            studentIds: studentList.map(it => it.studentId).join(',')
          }
        }).then(res => {
          closeLoading()
          this.$successMsg('分配成功')
          this.getData()
        }).catch(_ => {
          closeLoading()
        })
      })
    },
    reload() {
      this.getData()
    },
    showAnswerList(item) {
      this.tempItem = item
      this.dialogAnswerListVisible = true
    }
  }
}
</script>
