<template>
  <div>
    <el-dialog
      title="创建竞技场"
      :visible.sync="dialogFormVisible"
      width="60%"
      top="8vh"
    >
      <el-form
        :model="arenaModel"
        label-width="80px"
        class="dialog-container"
      >
        <el-form-item label="比赛名称">
          <el-col :span="20">
            <el-input
              v-model="arenaModel.name"
              placeholder="请输入比赛名称（必填）"
              maxlength="10"
            />
          </el-col>
        </el-form-item>
        <el-form-item label="选择教材">
          <el-col :span="20">
            <el-select
              v-model="arenaModel.textBookId"
              style="width: 100%"
              placeholder="请选择教材"
            >
              <el-option
                v-for="item of textbookList"
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
              v-model="arenaModel.courseCodes"
              style="width: 100%"
              multiple
              placeholder="请选择课程"
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
        <el-form-item label="随机选词">
          <el-col :span="20">
            <el-input-number
              v-model="arenaModel.wordsNum"
              :min="1"
              style="width: 50%"
              :max="200"
            />
            <el-button
              :disabled="arenaModel.lockRandomWord"
              style="margin-left: 5%"
              type="primary"
              size="mini"
              @click="openWordDrawer"
            >选择词语</el-button>
            <el-button
              :disabled="!arenaModel.lockRandomWord"
              type="danger"
              size="mini"
              @click="drawerWordList = true"
            >查看词语</el-button>
          </el-col>
        </el-form-item>
        <el-form-item label="选择题型">
          <el-col :span="20">
            <el-checkbox-group v-model="arenaModel.questionType">
              <el-checkbox
                v-for="item of subjectTypes"
                :key="item.value"
                :label="item.name"
                checked
              />
            </el-checkbox-group>
          </el-col>
        </el-form-item>
        <el-form-item label="开始时间">
          <el-col :span="20">
            <el-date-picker
              v-model="arenaModel.beginArenaTime"
              type="datetime"
              style="width: 100%"
              placeholder="请选择开始时间"
              default-time="00:00:00"
              value-format="timestamp"
            />
          </el-col>
        </el-form-item>
        <el-form-item label="比赛时长">
          <el-col :span="20">
            <el-input-number
              v-model="arenaModel.useArenaTime"
              :min="1"
              style="width: 70%"
              :max="200"
              label="描述文字"
            />
            <el-link
              type="danger"
              style="width: 20%"
              :underline="false"
            >单位：分钟</el-link>
          </el-col>
        </el-form-item>
        <el-form-item label="截止时间">
          <el-col :span="20">
            <el-input-number
              v-model="arenaModel.arenaEndTime"
              style="width: 70%"
              :min="1"
              :max="200"
            />
            <el-link
              type="danger"
              :underline="false"
              style="width: 20%"
            >单位：分钟</el-link>
            <el-link
              type="danger"
              :underline="false"
            >说明：竞技场开始多长时间后，不允许参赛。</el-link>
          </el-col>
        </el-form-item>
        <el-form-item label="参赛学校">
          <el-col :span="20">
            <el-button
              v-if="isSuperAdmin"
              type="primary"
              size="small"
              @click="openSchoolList"
            >点击选择参赛学校</el-button>
            <el-link v-else>
              4123456
            </el-link>
          </el-col>
        </el-form-item>
        <el-form-item label="奖品设置">
          <el-col :span="20">
            <el-radio-group
              v-model="arenaModel.rewardType"
              size="small"
            >
              <el-radio-button :label="0">线下奖励</el-radio-button>
              <el-radio-button :label="1">线上奖励</el-radio-button>
            </el-radio-group>
          </el-col>
        </el-form-item>
        <el-form-item v-if="arenaModel.rewardType === 0">
          <div>若是没有找到合适的奖品，请直接在输入框输入想要设置的奖品</div>
          <el-select
            v-model="arenaModel.offlineReward13"
            filterable
            allow-create
            default-first-option
            size="small"
            placeholder="请选择1-3名奖品"
          >
            <el-option
              v-for="item of rewardBaseItems"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
          <el-select
            v-model="arenaModel.offlineReward410"
            filterable
            allow-create
            default-first-option
            size="small"
            placeholder="请选择4-10名奖品"
          >
            <el-option
              v-for="item of reward410Items"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-else>
          <div>前10名，10个积分</div>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          size="mini"
          @click="dialogFormVisible = false"
        >取 消</el-button>
        <el-button
          type="primary"
          size="mini"
          @click="submitArena"
        >确 定</el-button>
      </div>
    </el-dialog>
    <el-drawer
      :visible.sync="drawerSchoolList"
      direction="rtl"
      :with-header="false"
    >
      <div class="padding">
        <div class="flex justify-between align-center">
          <el-link :underline="false">请选择参赛学校</el-link>
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
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            width="55"
          />
          <el-table-column
            align="center"
            label="学校名称"
            prop="schoolName"
          />
        </el-table>
      </div>
    </el-drawer>
    <!--  选择的单词  -->
    <el-drawer
      :visible.sync="drawerWordList"
      direction="rtl"
      :with-header="false"
      size="50%"
    >
      <div class="padding">
        <div class="flex justify-between align-center">
          <el-button
            type="primary"
            size="mini"
            @click="drawerWordList = false"
          >关闭</el-button>
          <el-button
            type="primary"
            size="mini"
            @click="confirmRandomWordList"
          >确定</el-button>
        </div>
        <el-table
          v-loading="randomWordLoading"
          :stripe="tableConfig.stripe"
          :header-cell-style="tableConfig.headerCellStyle"
          :data="randomWordList"
          :border="tableConfig.border"
          :size="tableConfig.size"
          :default-sort="tableConfig.defalutSort"
          :style="tableConfig.style"
          height="90vh"
        >
          <el-table-column
            align="center"
            label="单词"
            prop="wordCode"
          />
          <el-table-column
            align="center"
            label="解释"
            prop="wordExplain"
          />
          <el-table-column
            align="center"
            label="操作"
          >
            <template slot-scope="scope">
              <el-button
                :disabled="arenaModel.lockRandomWord"
                :size="$style.tableButtonSize"
                type="primary"
                @click="replaceItem(scope.row)"
              >替换</el-button>
              <el-button
                :disabled="arenaModel.lockRandomWord"
                :size="$style.tableButtonSize"
                type="danger"
                @click="deleteItem(scope.row)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-drawer>

    <!--  要替换的所有单词  -->
    <el-drawer
      :visible.sync="drawerAllWordList"
      direction="rtl"
      :with-header="false"
      size="40%"
    >
      <div class="padding">
        <div class="flex justify-between align-center">
          <el-button
            type="primary"
            size="mini"
            @click="drawerAllWordList = false"
          >关闭</el-button>
        </div>
        <el-table
          v-loading="allWordLoading"
          :stripe="tableConfig.stripe"
          :header-cell-style="tableConfig.headerCellStyle"
          :data="allWordList"
          :border="tableConfig.border"
          :size="tableConfig.size"
          :default-sort="tableConfig.defalutSort"
          :style="tableConfig.style"
          height="85vh"
        >
          <el-table-column
            align="center"
            label="单词"
            prop="wordCode"
          />
          <el-table-column
            align="center"
            label="解释"
            prop="wordExplain"
          />
          <el-table-column
            align="center"
            label="操作"
          >
            <template slot-scope="scope">
              <el-button
                :size="$style.tableButtonSize"
                type="primary"
                @click="confirmReplaceItem(scope.row)"
              >选择</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="text-center">
          <el-pagination
            layout="prev, pager, next"
            :total="allWordPageModel.total"
            @current-change="currentChange"
            @prev-click="prevClick"
            @next-click="nextClick"
          />
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import schoolMixins from '@/mixins/school-mixins'
import tableMixins from '@/mixins/table-mixins'
import userMixins from '@/mixins/user-mixins'
const rewardBaseItems = [
  '电影票一张',
  '10元手机充值卡一张',
  '学校纪念T恤一件',
  '精美笔记本一个',
  '精美文具一套',
  '精美水杯一个',
  '学习平板一个',
  '精美书包一个',
  '纪念雨伞一把']
const reward410Items = [
  ...rewardBaseItems,
  '纪念圆珠笔一支',
  '橡皮一块',
  '棒棒糖一个',
  '可乐一罐'
]
export default {
  name: 'AddArena',
  mixins: [schoolMixins, tableMixins, userMixins],
  data() {
    return {
      rewardBaseItems,
      reward410Items,
      subjectTypes: [
        {
          name: '拼写(填空题)',
          value: 1
        },
        {
          name: '听力(选择)',
          value: 2
        },
        {
          name: '看图(选择)',
          value: 3
        },
        {
          name: '句子翻译(选择)',
          value: 4
        },
        {
          name: '单词翻译(汉译英、选择题)',
          value: 5
        },
        {
          name: '英译汉',
          value: 6
        }
      ],
      textbookList: [],
      courseList: [],
      randomWordList: [],
      allWordList: [],
      randomWordLoading: false,
      allWordLoading: false,
      dialogFormVisible: false,
      drawerSchoolList: false,
      drawerWordList: false,
      drawerAllWordList: false,
      arenaModel: {
        name: '',
        textBookId: '',
        courseCodes: [],
        wordsNum: 20,
        questionType: [],
        beginArenaTime: 0,
        useArenaTime: 60,
        arenaEndTime: 0,
        selectedSchoolList: [],
        rewardType: 0,
        offlineReward13: '',
        offlineReward410: '',
        replacedItem: null,
        lockRandomWord: false
      },
      allWordPageModel: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      }
    }
  },
  watch: {
    'arenaModel.textBookId'(newVal) {
      this.arenaModel.courseCodes = []
      this.arenaModel.wordsNum = 20
      this.arenaModel.lockRandomWord = false
      this.getCourseList(newVal)
    },
    'arenaModel.courseCodes'(newVal) {
      this.arenaModel.lockRandomWord = false
      this.arenaModel.wordsNum = 20
    },
    'arenaModel.wordsNum'(newVal) {
      this.arenaModel.lockRandomWord = false
    }
  },
  methods: {
    showDialog() {
      this.dialogFormVisible = true
      if (this.textbookList.length === 0) {
        this.getTextBookList()
      }
    },
    getTextBookList() {
      this.$http({
        url: this.$urlPath.queryTextBookList,
        methods: this.HTTP_GET,
        data: {
          pageNum: 1,
          pageSize: 1000
        }
      }).then(res => {
        this.textbookList = res.obj.list
      })
    },
    openSchoolList() {
      this.drawerSchoolList = true
      if (this.schoolList.length === 0) {
        this.getSchoolList(_ => {
          this.loading = false
        })
      } else {
        this.$nextTick(_ => {
          this.arenaModel.selectedSchoolList.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row, true)
          })
        })
      }
    },
    openWordDrawer() {
      if (!this.arenaModel.textBookId) {
        this.$errorMsg('请选择教材')
        return
      }
      if (this.arenaModel.courseCodes.length === 0) {
        this.$errorMsg('请选择课程')
        return
      }
      this.drawerWordList = true
      this.getRandomWordList()
    },
    getRandomWordList() {
      this.$http({
        url: this.$urlPath.queryArenaRandomWords,
        methods: this.HTTP_GET,
        data: {
          courseCodes: this.arenaModel.courseCodes.join(','),
          wordCount: this.arenaModel.wordsNum,
          textBookId: this.arenaModel.textBookId
        }
      }).then(res => {
        this.randomWordLoading = false
        this.randomWordList = res.obj
      })
    },
    confirmRandomWordList() {
      this.drawerWordList = false
      this.arenaModel.lockRandomWord = true
    },
    getCourseList(textbookId) {
      this.$http({
        url: this.$urlPath.queryCourseByTextBook,
        methods: this.HTTP_GET,
        data: {
          textbookId,
          pageNum: 1,
          pageSize: 1000
        }
      }).then(res => {
        this.courseList = res.obj.list
      })
    },
    handleSelectionChange(val) {
      this.selectedSchoolList = val
    },
    replaceItem(item) {
      this.arenaModel.replacedItem = item
      this.drawerAllWordList = true
      this.allWordPageModel.currentPage = 1
      this.getAllWordList()
    },
    getAllWordList() {
      this.$http({
        url: this.$urlPath.queryArenaAllWords,
        methods: this.HTTP_GET,
        data: {
          courseCodes: this.arenaModel.courseCodes.join(','),
          textBookId: this.arenaModel.textBookId,
          pageNum: this.allWordPageModel.currentPage,
          pageSize: this.allWordPageModel.pageSize
        }
      }).then(res => {
        this.allWordLoading = false
        this.allWordList = res.obj.list
        this.allWordPageModel.total = res.obj.total
      })
    },
    prevClick(page) {
      this.allWordPageModel.currentPage = page
    },
    nextClick(page) {
      this.allWordPageModel.currentPage = page
    },
    currentChange(page) {
      this.allWordPageModel.currentPage = page
      this.allWordLoading = true
      this.getAllWordList()
    },
    confirmReplaceItem(item) {
      if (this.arenaModel.replacedItem) {
        if (this.randomWordList.find(it => it.wordId === item.wordId)) {
          this.$errorMsg('该单词已经存在，请更换')
          return
        }
        this.drawerAllWordList = false
        this.randomWordList.splice(this.randomWordList.indexOf(this.arenaModel.replacedItem), 1, item)
        this.arenaModel.replacedItem = null
      } else {
        this.$errorMsg('该先选择要替换的单词')
      }
    },
    deleteItem(item) {
      this.randomWordList.splice(this.randomWordList.indexOf(item), 1)
    },
    submitArena() {
      this.dialogFormVisible = false
      if (!this.arenaModel.name) {
        this.$errorMsg('请输入比赛名称')
        return
      }
      if (!this.arenaModel.textBookId) {
        this.$errorMsg('请选择教材信息')
        return
      }
    }
  }
}
</script>

<style>
</style>
