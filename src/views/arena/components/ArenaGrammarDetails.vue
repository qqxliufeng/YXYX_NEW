<template>
  <div v-if="arenaModel">
    <el-dialog
      title="语法竞技场详细信息"
      :visible.sync="dialogFormVisible"
      :width="$isPhone ? '90%' : '60%'"
      top="8vh"
    >
      <el-form
        :model="arenaModel"
        label-width="80px"
        class="dialog-container"
      >
        <el-form-item label="比赛名称">
          <el-col :span="20">
            <el-link
              type="primary"
              :underline="false"
            >{{ arenaModel.arenaName }}</el-link>
          </el-col>
        </el-form-item>
        <el-form-item label="教材名称">
          <el-col :span="20">
            <el-link
              type="primary"
              :underline="false"
            >{{ arenaModel.textbookName }}</el-link>
            <el-link
              v-if="arenaModel.isExper === 1"
              class="margin-left"
              type="danger"
            >说明：该教材为体验教材</el-link>
          </el-col>
        </el-form-item>
        <el-form-item label="课程信息">
          <el-col :span="20">
            <el-link
              type="primary"
              :underline="false"
            >{{ arenaModel.courseNames }}</el-link>
          </el-col>
        </el-form-item>
        <el-form-item label="题目详情">
          <el-col :span="20">
            <el-button
              type="danger"
              size="mini"
              @click="getSubjectList"
            >查看题目</el-button>
          </el-col>
        </el-form-item>
        <el-form-item label="所选题型">
          <el-col :span="20">
            <el-col :span="20">
              <el-checkbox-group
                v-model="questionType"
                disabled
              >
                <el-checkbox
                  v-for="item of subjectTypes"
                  :key="item.value"
                  :label="item.value"
                  disabled
                  checked
                >
                  {{ item.name }}
                </el-checkbox>
              </el-checkbox-group>
            </el-col>
          </el-col>
        </el-form-item>
        <el-form-item label="开始时间">
          <el-col :span="20">
            <el-link
              type="primary"
              :underline="false"
            >{{ arenaModel.beginArenaTime }}</el-link>
          </el-col>
        </el-form-item>
        <el-form-item label="比赛时长">
          <el-col :span="20">
            <el-link
              type="primary"
              :underline="false"
            >{{ arenaModel.useArenaTime }}分钟</el-link>
          </el-col>
        </el-form-item>
        <el-form-item label="截止时间">
          <el-col :span="20">
            <el-link
              type="primary"
              :underline="false"
            >{{ arenaModel.endArenaTime }}</el-link>
          </el-col>
        </el-form-item>
        <el-form-item label="报名截止">
          <el-col :span="20">
            <el-link
              type="primary"
              :underline="false"
            >{{ arenaModel.comeInArenaEndTime }}</el-link>
          </el-col>
        </el-form-item>
        <el-form-item label="参赛学校">
          <el-col :span="20">
            <el-button
              type="primary"
              size="small"
              @click="openSchoolList"
            >查看参赛学校</el-button>
          </el-col>
        </el-form-item>
        <el-form-item label="参赛学生">
          <el-col :span="20">
            <el-button
              v-if="isSuperAdmin"
              type="primary"
              size="small"
              @click="openJoinStu"
            >查看参赛学生</el-button>
            <el-button
              v-if="isSuperAdmin"
              type="danger"
              size="small"
              @click="openUnJoinStu"
            >查看未参赛学生</el-button>
          </el-col>
        </el-form-item>
        <el-form-item label="奖品设置">
          <el-col :span="20">
            <el-link
              v-if="arenaModel.rewardType === 0"
              type="primary"
              :underline="false"
            >线下奖励</el-link>
            <el-link
              v-else
              type="primary"
              :underline="false"
            >线上奖励</el-link>
          </el-col>
        </el-form-item>
        <el-form-item v-if="arenaModel.rewardType === 0">
          <div>
            <el-link
              type="danger"
              :underline="false"
            >1-3名：{{ arenaModel.offlineReward13 }}</el-link>
          </div>
          <div>
            <el-link
              type="danger"
              :underline="false"
            >4-10名：{{ arenaModel.offlineReward410 }}</el-link>
          </div>
        </el-form-item>
        <el-form-item v-else>
          <div>
            <el-link
              type="danger"
              :underline="false"
            >
              排名前10名者，可获得优币奖励，详情如下：<br>
              第一名：100优币<br>
              第二名：95优币<br>
              第三名：90优币<br>
              第四名：85优币<br>
              第五名：80优币<br>
              第六名：75优币<br>
              第七名：70优币<br>
              第八名：65优币<br>
              第九名：60优币<br>
              第十名：55优币<br>
            </el-link>
          </div>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          size="mini"
          @click="dialogFormVisible = false"
        >知道了</el-button>
      </div>
    </el-dialog>
    <!-- 查看参赛的学校 -->
    <el-drawer
      :visible.sync="drawerSchoolList"
      direction="rtl"
      :with-header="false"
      :size="$isPhone ? '80%' : '40%'"
    >
      <div class="padding">
        <div class="flex justify-between align-center">
          <el-button
            type="primary"
            size="mini"
            @click="drawerSchoolList = false"
          >确定</el-button>
        </div>
        <el-table
          ref="multipleTable"
          v-loading="loading"
          :stripe="tableConfig.stripe"
          :header-cell-style="tableConfig.headerCellStyle"
          :data="schoolList"
          :border="tableConfig.border"
          :size="tableConfig.size"
          :default-sort="tableConfig.defalutSort"
          :style="tableConfig.style"
          height="80vh"
        >
          <el-table-column
            align="center"
            label="学校名称"
            prop="schoolName"
          />
          <el-table-column
            align="center"
            label="学校状态"
            prop="schoolName"
          >
            <template slot-scope="scope">
              <el-link
                :underline="false"
                :type="scope.row.isOnLine === 0 ? 'primary' : 'danger' "
              >{{ scope.row.isOnLine === 0 ? '线下学校': '线上学校' }}</el-link>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-drawer>
    <!--  查看参赛的学生  -->
    <el-drawer
      :visible.sync="drawerJoinStu"
      direction="rtl"
      :with-header="false"
      :size="$isPhone ? '90%' : '60%'"
    >
      <div class="padding">
        <div class="flex justify-between align-center">
          <el-button
            type="primary"
            size="mini"
            @click="drawerJoinStu = false"
          >关闭</el-button>
          <el-button
            v-if="arenaModel.rewardType === 1"
            type="danger"
            size="mini"
            @click="rewardOnLine"
          >发放奖品</el-button>
        </div>
        <el-table
          v-loading="joinStuLoading"
          :stripe="tableConfig.stripe"
          :header-cell-style="tableConfig.headerCellStyle"
          :data="joinStudentList"
          :border="tableConfig.border"
          :size="tableConfig.size"
          :default-sort="tableConfig.defalutSort"
          :style="tableConfig.style"
          height="90vh"
        >
          <el-table-column
            align="center"
            label="名次"
            prop="studentName"
          >
            <template slot-scope="scope">
              <table-status
                v-if="scope.$index < 3"
                :status="statusFormat(scope.$index)"
              />
              <div v-else>{{ scope.$index + 1 }}</div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="学生姓名"
            prop="studentName"
            width="120"
          />
          <el-table-column
            align="center"
            label="比赛时长"
          >
            <template slot-scope="scoped">
              {{ (scoped.row.useTime / 1000) + '秒' }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="正确数量"
            prop="correctCount"
          />
          <el-table-column
            align="center"
            label="错误数量"
            prop="errorCount"
          />
          <el-table-column
            align="center"
            label="正确率"
          >
            <template slot-scope="scoped">
              {{ (scoped.row.resultPer * 100) + '%' }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="奖品发放"
          >
            <template slot-scope="scoped">
              <el-button
                :size="$style.tableButtonSize"
                :type="scoped.row.isAward === 0 ? 'danger' : 'success'"
                @click="rewardOffLine(scoped.row)"
              >{{ scoped.row.isAward === 0 ? '未发放' : '已发放' }}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-drawer>
    <!--  查看未参赛的学生  -->
    <el-drawer
      :visible.sync="drawerUnJoinStu"
      direction="rtl"
      :with-header="false"
      :size="$isPhone ? '40%' : '20%'"
    >
      <div class="padding">
        <div class="flex justify-between align-center">
          <el-button
            type="primary"
            size="mini"
            @click="drawerUnJoinStu = false"
          >关闭</el-button>
        </div>
        <el-table
          v-loading="unJoinStuLoading"
          :stripe="tableConfig.stripe"
          :header-cell-style="tableConfig.headerCellStyle"
          :data="unJoinStudentList"
          :border="tableConfig.border"
          :size="tableConfig.size"
          :default-sort="tableConfig.defalutSort"
          :style="tableConfig.style"
          height="90vh"
        >
          <el-table-column
            align="center"
            label="学生姓名"
            prop="studentName"
          />
        </el-table>
      </div>
    </el-drawer>
    <!--  选择的题目  -->
    <el-drawer
      :visible.sync="drawerWordList"
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
          v-loading="randomWordLoading"
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
import userMixins from '@/mixins/user-mixins'
import tableMixins from '@/mixins/table-mixins'
export default {
  name: 'ArenaDetails',
  filters: {
    questionTypeFilter(item) {
      switch (item) {
        case 1:
          return '拼写(填空题)'
        case 2:
          return '听力(选择)'
        case 3:
          return '看图(选择)'
        case 4:
          return '句子翻译(选择)'
        case 5:
          return '单词翻译(汉译英、选择题)'
        case 6:
          return '英译汉'
      }
    }
  },
  mixins: [userMixins, tableMixins],
  props: {
    arenaModel: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      dialogFormVisible: false,
      drawerSchoolList: false,
      drawerWordList: false,
      drawerJoinStu: false,
      drawerUnJoinStu: false,
      joinStuLoading: false,
      unJoinStuLoading: false,
      randomWordLoading: false,
      dialogAnswerListVisible: false,
      subjectList: [],
      schoolList: [],
      joinStudentList: [],
      unJoinStudentList: [],
      subjectTypes: [
        {
          name: '单选',
          value: 1
        }
      ],
      tempItem: null
    }
  },
  computed: {
    questionType() {
      return this.arenaModel ? this.arenaModel.questionType.split(',').map(it => parseInt(it)) : []
    }
  },
  methods: {
    statusFormat(item) {
      switch (item) {
        case 0:
          return { label: '第一名', type: 'warning' }
        case 1:
          return { label: '第二名', type: 'danger' }
        case 2:
          return { label: '第三名', type: 'info' }
      }
    },
    showDialog() {
      this.dialogFormVisible = true
    },
    getSubjectList() {
      this.drawerWordList = true
      this.randomWordLoading = true
      this.$http({
        url: this.$urlPath.queryArenaPracticePassList,
        methods: this.HTTP_GET,
        data: {
          arenaId: this.arenaModel.arenaId
        }
      }).then(res => {
        this.randomWordLoading = false
        this.subjectList = res.obj
      })
    },
    openJoinStu() {
      this.drawerJoinStu = true
      this.joinStuLoading = true
      this.$http({
        url: this.$urlPath.queryArenaJoinStudentList,
        methods: this.HTTP_GET,
        data: {
          arenaId: this.arenaModel.arenaId
        }
      }).then(res => {
        this.joinStuLoading = false
        this.joinStudentList = res.obj
      })
    },
    openUnJoinStu() {
      this.drawerUnJoinStu = true
      this.unJoinStuLoading = true
      this.$http({
        url: this.$urlPath.queryArenaUnJoinStudentList,
        methods: this.HTTP_GET,
        data: {
          arenaId: this.arenaModel.arenaId,
          textBookId: this.arenaModel.textBookId
        }
      }).then(res => {
        this.unJoinStuLoading = false
        this.unJoinStudentList = res.obj
      })
    },
    openSchoolList() {
      this.drawerSchoolList = true
      this.$http({
        url: this.$urlPath.queryArenaSchoolList,
        methods: this.HTTP_GET,
        data: {
          arenaId: this.arenaModel.arenaId
        }
      }).then(res => {
        this.loading = false
        this.schoolList = res.obj
      })
    },
    rewardOnLine() {
      if (this.arenaModel.rewardType === 0 || this.joinStudentList.length === 0) return
      if (this.joinStudentList[0].isAward === 1) {
        this.$errorMsg('奖品已发放')
        return
      }
      const endDate = this.arenaModel.endArenaTime.replace(/-/g, '/')
      if (new Date().getTime() > new Date(endDate).getTime()) {
        this.$warningConfirm('是否要发放奖品？', () => {
          this.$showLoading(closeLoading => {
            this.$http({
              url: this.$urlPath.isAward,
              data: {
                rewardType: this.arenaModel.rewardType,
                arenaId: this.arenaModel.arenaId
              }
            }).then(res => {
              this.$successMsg('奖品发放成功')
              this.joinStudentList.forEach(it => { it.isAward = 1 })
            })
          })
        })
      } else {
        this.$errorMsg('竞技场还未结束')
      }
    },
    rewardOffLine(studentItem) {
      if (this.arenaModel.rewardType === 1) return
      const endDate = this.arenaModel.endArenaTime.replace(/-/g, '/')
      if (new Date().getTime() > new Date(endDate).getTime()) {
        this.$http({
          url: this.$urlPath.isAward,
          data: {
            rewardType: this.arenaModel.rewardType,
            arenaId: this.arenaModel.arenaId,
            arenaStudentId: studentItem.arenaStudentId
          }
        }).then(res => {
          this.$success('奖品发放成功')
          this.joinStudentList.forEach(it => { it.isAward = 1 })
        })
      } else {
        this.$errorMsg('竞技场还未结束')
      }
    },
    showAnswerList(item) {
      this.tempItem = item
      this.dialogAnswerListVisible = true
    }
  }
}
</script>

<style>
</style>
