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
              @change="textBookChange"
            >
              <el-option
                v-for="item of textbookList"
                :key="item.textbookId"
                :label="item.textbookName"
                :value="item.textbookId"
              />
            </el-select>
            <el-link
              v-if="arenaModel.isExper === 1"
              type="danger"
              :underline="false"
            >说明：当前选择的教材是体验教材。</el-link>
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
              :disabled="lockRandomWord"
              style="margin-left: 5%"
              type="primary"
              size="mini"
              @click="openWordDrawer(true)"
            >选择词语</el-button>
            <el-button
              :disabled="!lockRandomWord"
              type="danger"
              size="mini"
              @click="openWordDrawer(false)"
            >查看词语</el-button>
          </el-col>
        </el-form-item>
        <el-form-item label="选择题型">
          <el-col :span="20">
            <el-checkbox-group v-model="arenaModel.questionType">
              <el-checkbox
                v-for="item of subjectTypes"
                :key="item.value"
                :label="item.value"
              >
                {{ item.name }}
              </el-checkbox>
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
              {{ arenaModel.selectedSchoolList[0].schoolName }}
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
            @click="confirmSchool"
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
    <word-list
      ref="wordList"
      :random-word-model="randomWordModel"
      :all-word-model="allWordModel"
      :like-word-model="likeWordModel"
      :lock-random-word="lockRandomWord"
      @lockRandom="lockRandomHandler"
    />
  </div>
</template>

<script>
import schoolMixins from '@/mixins/school-mixins'
import tableMixins from '@/mixins/table-mixins'
import userMixins from '@/mixins/user-mixins'
import WordList from './WordList'
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
  components: { WordList },
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
      linkWord: '',
      arenaModel: {
        name: '',
        textBookId: '',
        isExper: 0, // 是否是体验教材：0 不是 1是
        courseCodes: [],
        wordsNum: 20,
        questionType: [1, 2, 3, 4, 5, 6],
        beginArenaTime: new Date().getTime() + 10 * 60 * 1000,
        useArenaTime: 60,
        arenaEndTime: 0,
        selectedSchoolList: [],
        rewardType: 0,
        offlineReward13: '',
        offlineReward410: '',
        replacedItem: null
      },
      lockRandomWord: false,
      allWordPageModel: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      }
    }
  },
  computed: {
    randomWordModel() {
      return {
        url: this.$urlPath.queryArenaRandomWords,
        data: {
          courseCodes: this.arenaModel.courseCodes.join(','),
          wordCount: this.arenaModel.wordsNum,
          textBookId: this.arenaModel.textBookId
        }
      }
    },
    allWordModel() {
      return {
        url: this.$urlPath.queryArenaAllWords,
        data: {
          courseCodes: this.arenaModel.courseCodes.join(','),
          textBookId: this.arenaModel.textBookId
        }
      }
    },
    likeWordModel() {
      return {
        url: this.$urlPath.queryArenaWordLike,
        data: {
          courseCodes: this.arenaModel.courseCodes.join(','),
          textBookId: this.arenaModel.textBookId
        }
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
      if (!this.isSuperAdmin) {
        this.getSchoolInfo()
      }
    },
    getTextBookList() {
      this.$http({
        url: this.isOnLineSchool ? this.$urlPath.queryTextBookList : this.$urlPath.querySchoolAndTextBook,
        methods: this.HTTP_GET,
        data: {
          schoolId: this.$store.getters.schoolId,
          pageNum: 1,
          pageSize: 1000
        }
      }).then(res => {
        this.textbookList = res.obj.list
      })
    },
    getSchoolInfo() {
      this.$http({
        url: this.$urlPath.querySchoolBySchoolId,
        methods: this.HTTP_GET,
        data: {
          schoolId: this.$store.getters.schoolId
        }
      }).then(res => {
        this.arenaModel.selectedSchoolList.push({
          schoolId: res.obj.schoolId,
          schoolName: res.obj.schoolName,
          isOnLine: res.obj.isOnLine
        })
      })
    },
    textBookChange(item) {
      this.arenaModel.isExper = parseInt(this.textbookList.find(it => it.textbookId === item).isExper)
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
    openWordDrawer(init) {
      if (init) {
        if (!this.arenaModel.textBookId) {
          this.$errorMsg('请选择教材')
          return
        }
        if (this.arenaModel.courseCodes.length === 0) {
          this.$errorMsg('请选择课程')
          return
        }
        this.$refs.wordList.show(init)
      } else {
        this.$refs.wordList.show(init)
      }
    },
    confirmSchool() {
      if (this.arenaModel.selectedSchoolList.length === 0) {
        this.$errorMsg('请至少选择一个参赛学校')
        return
      }
      const isAllOffLine = this.arenaModel.selectedSchoolList.every(it => it.isOnLine === 0)
      const isAllOnLine = this.arenaModel.selectedSchoolList.every(it => it.isOnLine === 1)
      if (!isAllOffLine && !isAllOnLine) {
        this.$errorMsg('选择的学校必须都是线上学校 或者 都是线下学校')
        return
      }
      this.drawerSchoolList = false
    },
    confirmRandomWordList() {
      this.drawerWordList = false
      this.arenaModel.lockRandomWord = true
    },
    getCourseList(textbookId) {
      if (!textbookId) return
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
      this.arenaModel.selectedSchoolList = val
    },
    submitArena() {
      if (!this.arenaModel.name) {
        this.$errorMsg('请输入比赛名称')
        return
      }
      if (!this.arenaModel.textBookId) {
        this.$errorMsg('请选择教材信息')
        return
      }
      if (this.arenaModel.courseCodes.length === 0) {
        this.$errorMsg('请至少选择一个课程')
        return
      }
      if (this.randomWordList.length === 0) {
        this.$errorMsg('请选择随机单词')
        return
      }
      if (this.arenaModel.questionType.length === 0) {
        this.$errorMsg('请选择至少一个题型')
        return
      }
      if (!this.arenaModel.beginArenaTime) {
        this.$errorMsg('请选择一个开始时间')
        return
      }
      if (this.arenaModel.beginArenaTime < new Date().getTime()) {
        this.$errorMsg('开始时间不能小于当前时间')
        return
      }
      if (this.isSuperAdmin && this.arenaModel.selectedSchoolList.length === 0) {
        this.$errorMsg('请选择至少一个参赛学校')
        return
      }
      const isAllOffLine = this.arenaModel.selectedSchoolList.every(it => it.isOnLine === 0)
      const isAllOnLine = this.arenaModel.selectedSchoolList.every(it => it.isOnLine === 1)
      if (!isAllOffLine && !isAllOnLine) {
        this.$errorMsg('选择的学校必须都是线上学校 或者 都是线下学校')
        return
      }
      if (this.arenaModel.rewardType === 0) {
        if (!this.arenaModel.offlineReward13) {
          this.$errorMsg('请选择前三名的奖品信息')
          return
        }
        if (!this.arenaModel.offlineReward410) {
          this.$errorMsg('请选择四到十名的奖品信息')
          return
        }
      }
      const postData = {}
      postData.arenaName = this.arenaModel.name
      postData.textBookId = this.arenaModel.textBookId
      postData.isExper = this.arenaModel.isExper
      postData.courseCodes = this.arenaModel.courseCodes.join(',')
      postData.wordsNum = this.arenaModel.wordsNum
      postData.questionType = this.arenaModel.questionType.join(',')
      postData.beginArenaTime = this.arenaModel.beginArenaTime
      postData.useArenaTime = this.arenaModel.useArenaTime
      postData.comeInArenaEndTime = this.arenaModel.beginArenaTime + this.arenaModel.arenaEndTime * 60 * 1000
      postData.rewardType = this.arenaModel.rewardType
      postData.offlineReward13 = this.arenaModel.offlineReward13
      postData.offlineReward410 = this.arenaModel.offlineReward410
      postData.wordsIdList = this.randomWordList.map(it => { return { wordId: it.wordId } })
      postData.arenaSchoolIdList = this.arenaModel.selectedSchoolList.map(it => { return { schoolId: it.schoolId } })
      postData.createSchoolId = this.$store.getters.schoolId
      this.$http({
        url: this.$urlPath.saveArena,
        methods: this.HTTP_POST,
        data: {
          jsonParam: JSON.stringify(postData),
          schoolIsOnline: this.arenaModel.selectedSchoolList[0].isOnLine,
          isExper: this.arenaModel.isExper
        }
      }).then(res => {
        this.dialogFormVisible = false
        this.$successMsg('添加成功')
        this.randomWordList = []
        this.arenaModel = {
          name: '',
          textBookId: '',
          isExper: 0,
          courseCodes: [],
          wordsNum: 20,
          questionType: [1, 2, 3, 4, 5, 6],
          beginArenaTime: new Date().getTime() + 10 * 60 * 1000,
          useArenaTime: 60,
          arenaEndTime: 0,
          selectedSchoolList: [],
          rewardType: 0,
          offlineReward13: '',
          offlineReward410: '',
          replacedItem: null,
          lockRandomWord: false
        }
        this.$nextTick(_ => {
          this.$refs.multipleTable.clearSelection()
        })
        this.$emit('reload')
      })
    },
    lockRandomHandler(result) {
      this.lockRandomWord = result
    }
  }
}
</script>

<style>
</style>
