<template>
  <div>
    <el-dialog
      title="创建 词汇 考试"
      :visible.sync="dialogFormVisible"
      :width="$isPhone ? '90%' : '60%'"
      top="8vh"
    >
      <el-form
        :model="paperModel"
        label-width="80px"
        class="dialog-container"
      >
        <el-form-item label="考试名称">
          <el-col :span="20">
            <el-input
              v-model="paperModel.examName"
              placeholder="请输入考试名称（必填）"
              maxlength="10"
            />
          </el-col>
        </el-form-item>
        <el-form-item label="选择类型">
          <el-col :span="20">
            <el-radio-group
              v-model="paperModel.examType"
              size="mini"
            >
              <el-radio-button :label="1">app考试</el-radio-button>
              <el-radio-button :label="0">线下试卷</el-radio-button>
            </el-radio-group>
            <el-link :underline="false" type="danger" class="margin-left">请注意试卷使用范围</el-link>
          </el-col>
        </el-form-item>
        <el-form-item label="选择题型">
          <el-col :span="20">
            <el-radio-group
              v-model="paperModel.questionType"
              size="mini"
            >
              <el-radio-button
                v-for="item of subjectTypes"
                :key="item.value"
                :label="item.value"
                :disabled="item.disabled"
              >
                {{ item.name }}
              </el-radio-button>
            </el-radio-group>
          </el-col>
        </el-form-item>
        <el-form-item label="选择教材">
          <el-col :span="20">
            <el-select
              v-model="paperModel.textBookId"
              style="width: 100%"
              placeholder="请选择教材"
            >
              <el-option
                v-for="item of textBookList"
                :key="item.textbookId"
                :label="item.textbookName"
                :value="item.textbookId"
              />
            </el-select>
            <el-link
              v-if="paperModel.isExper === 1"
              type="danger"
              :underline="false"
            >说明：当前选择的教材是体验教材。</el-link>
          </el-col>
        </el-form-item>
        <el-form-item label="选择课程">
          <el-col :span="9">
            <el-select
              v-model="paperModel.startCourseCode"
              style="width: 100%"
              placeholder="请选择开始课程"
            >
              <el-option
                v-for="item of courseList"
                :key="item.courseId"
                :label="item.courseName"
                :value="item.courseId"
              />
            </el-select>
          </el-col>
          <el-col :span="2">
            <div class="text-center">---</div>
          </el-col>
          <el-col :span="9">
            <el-select
              v-model="paperModel.endCourseCode"
              style="width: 100%"
              placeholder="请选择结束课程"
            >
              <el-option
                v-for="item of courseList"
                :key="item.courseId"
                :label="item.courseName"
                :value="item.courseId"
              />
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="选择关卡">
          <el-col :span="9">
            <el-select
              v-model="paperModel.startLevelCode"
              style="width: 100%"
              placeholder="请选择开始关卡"
            >
              <el-option
                v-for="item of levelList"
                :key="item.courseLevelId"
                :label="item.levelName"
                :value="item.courseLevelId"
              />
            </el-select>
          </el-col>
          <el-col :span="2">
            <div class="text-center">---</div>
          </el-col>
          <el-col :span="9">
            <el-select
              v-model="paperModel.endLevelCode"
              style="width: 100%"
              placeholder="请选择结束关卡"
            >
              <el-option
                v-for="item of levelList"
                :key="item.courseLevelId"
                :label="item.levelName"
                :value="item.courseLevelId"
              />
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="随机选词">
          <el-col :span="20">
            <el-input-number
              v-model="paperModel.wordsNum"
              :min="5"
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
        <el-form-item label="开始时间">
          <el-col :span="20">
            <el-date-picker
              v-model="paperModel.beginExamTime"
              type="datetime"
              style="width: 100%"
              placeholder="请选择开始时间"
              default-time="00:00:00"
              value-format="timestamp"
            />
          </el-col>
        </el-form-item>
        <el-form-item label="考试时长">
          <el-col :span="20">
            <el-input-number
              v-model="paperModel.useExamTime"
              :min="1"
              style="width: 70%"
              :max="200"
            />
            <el-link
              v-if="!$isPhone"
              type="danger"
              style="width: 20%"
              :underline="false"
            >单位：分钟</el-link>
          </el-col>
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
          @click="submitExam"
        >确 定</el-button>
      </div>
    </el-dialog>
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
import userMixins from '@/mixins/user-mixins'
import WordList from './WordList'
export default {
  name: 'AddWordTestPaper',
  components: { WordList },
  mixins: [userMixins],
  data() {
    return {
      dialogFormVisible: false,
      textBookList: [],
      courseList: [],
      levelList: [],
      subjectTypes: [
        {
          name: '汉译英',
          value: 1,
          disabled: false
        },
        {
          name: '英译汉',
          value: 2,
          disabled: true
        },
        {
          name: '交叉',
          value: 3,
          disabled: true
        }
      ],
      paperModel: {
        textbookType: 0,
        examName: '', // 考试名称
        examType: 1, // 考试类型 0线下 1线上
        textBookId: '', // 教材主键ID
        courseCodes: [], // 课程item
        startCourseCode: '', // 开始课程
        endCourseCode: '', // 结束课程
        levelCodes: [], // 关卡item
        startLevelCode: '', // 开始关卡
        endLevelCode: '', // 结束关卡
        wordsNum: 5, // 单词数量
        questionType: 1, // 题型 1汉译英(线上、线下) 2英译汉(线下) 3交叉(线下)
        beginExamTime: new Date().getTime() + 10 * 60 * 1000, // 考试开始时间
        useExamTime: 10, // 考试用时,单位分钟
        selectedWordList: [],

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
        url: this.$urlPath.queryExamWords,
        data: {
          levelCodes: this.paperModel.levelCodes.map(it => it.levelCode).join(','),
          wordCount: this.paperModel.wordsNum,
          textBookId: this.paperModel.textBookId
        }
      }
    },
    allWordModel() {
      return {
        url: this.$urlPath.queryExamAllWords,
        data: {
          levelCodes: this.paperModel.levelCodes.map(it => it.levelCode).join(','),
          textBookId: this.paperModel.textBookId
        }
      }
    },
    likeWordModel() {
      return {
        url: this.$urlPath.queryExamWordLike,
        data: {
          levelCodes: this.paperModel.levelCodes.map(it => it.levelCode).join(','),
          textBookId: this.paperModel.textBookId
        }
      }
    },
    courseObj() {
      const o = {
        start: this.paperModel.startCourseCode,
        end: this.paperModel.endCourseCode
      }
      return o
    },
    levelObj() {
      const o = {
        start: this.paperModel.startLevelCode,
        end: this.paperModel.endLevelCode,
        type: '关卡'
      }
      return o
    }
  },
  watch: {
    'paperModel.textBookId'(newVal) {
      if (newVal) {
        this.courseList = []
        this.levelList = []
        this.paperModel.startCourseCode = ''
        this.paperModel.endCourseCode = ''
        this.paperModel.startLevelCode = ''
        this.paperModel.endLevelCode = ''
        this.paperModel.courseCodes = []
        this.paperModel.levelCodes = []
        this.getCouseList()
      }
    },
    'paperModel.startCourseCode'(newVal) {
      this.paperModel.endCourseCode = ''
      this.levelList = []
      this.paperModel.startLevelCode = ''
      this.paperModel.endLevelCode = ''
      this.paperModel.levelCodes = []
    },
    'paperModel.endCourseCode'(newVal) {
      if (!newVal) return
      const result = this.validateCode(this.courseObj)
      if (result) {
        this.paperModel.courseCodes = this.calcRange(this.courseObj)
        this.getLevelList()
      }
    },
    'paperModel.examType'(newVal) {
      this.paperModel.questionType = 1
      this.subjectTypes.forEach(it => {
        it.disabled = newVal === 1 ? it.value !== 1 : it.disabled = false
      })
    },
    'paperModel.wordsNum'() {
      this.lockRandomWord = false
    }
  },
  methods: {
    show() {
      this.dialogFormVisible = true
      this.paperModel = {
        examName: '', // 考试名称
        examType: 1, // 考试类型 0线下 1线上
        textBookId: '', // 教材主键ID
        courseCodes: [], // 课程item
        startCourseCode: '', // 开始课程
        endCourseCode: '', // 结束课程
        levelCodes: [], // 关卡item
        startLevelCode: '', // 开始关卡
        endLevelCode: '', // 结束关卡
        wordsNum: 5, // 单词数量
        questionType: 1, // 题型 1汉译英(线上、线下) 2英译汉(线下) 3交叉(线下)
        beginExamTime: new Date().getTime() + 10 * 60 * 1000, // 考试开始时间
        useExamTime: 10, // 考试用时,单位分钟
        selectedWordList: []
      }
      if (this.textBookList.length === 0) {
        this.getTextBookList()
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
        this.textBookList = res.obj.list
      })
    },
    getCouseList() {
      this.$http({
        url: this.$urlPath.queryCourseByTextBook,
        methods: this.HTTP_GET,
        data: {
          textbookId: this.paperModel.textBookId,
          pageNum: 1,
          pageSize: 1000
        }
      }).then(res => {
        this.courseList = res.obj.list
      })
    },
    getLevelList() {
      this.$http({
        url: this.$urlPath.queryExamCourseLevel,
        methods: this.HTTP_GET,
        data: {
          textBookId: this.paperModel.textBookId,
          courseCodes: this.paperModel.courseCodes.map(it => it.courseCode).join(',')
        }
      }).then(res => {
        this.levelList = res.obj
      })
    },
    submitExam() {
      if (!this.paperModel.examName) {
        this.$errorMsg('请输入考试名称')
        return
      }
      if (!this.paperModel.textBookId) {
        this.$errorMsg('请选择教材')
        return
      }
      const resultCourseCodes = this.validateCode(this.courseObj)
      if (!resultCourseCodes) {
        return
      }
      this.paperModel.courseCodes = this.calcRange(this.courseObj)

      const resultLevelCodes = this.validateCode(this.levelObj)
      if (!resultLevelCodes) {
        return
      }
      this.paperModel.levelCodes = this.calcRange(this.levelObj)

      if (this.$refs.wordList.getRandomWord().length === 0) {
        this.$errorMsg('请选择单词')
        return
      }

      if (this.paperModel.beginExamTime < new Date().getTime()) {
        this.$errorMsg('开始时间必须大于当前时间')
        return
      }
      const postData = {}
      postData.textbookType = this.paperModel.textbookType
      postData.schoolId = this.$store.getters.schoolId
      postData.examName = this.paperModel.examName
      postData.examType = this.paperModel.examType
      postData.textBookId = this.paperModel.textBookId
      postData.courseCodes = this.paperModel.courseCodes.map(it => it.courseCode).join(',')
      postData.levelCodes = this.paperModel.levelCodes.map(it => it.levelCode).join(',')
      postData.wordsNum = this.paperModel.wordsNum
      postData.questionType = this.paperModel.questionType
      postData.beginExamTime = this.paperModel.beginExamTime
      postData.useExamTime = this.paperModel.useExamTime
      postData.examWordsList = this.$refs.wordList.getRandomWord()
      if (this.paperModel.questionType === 1 || this.paperModel.questionType === 2) {
        postData.examWordsList.forEach(it => { it.questionType = this.paperModel.questionType })
      }
      this.$showLoading(closeLoading => {
        this.$http({
          url: this.$urlPath.saveExam,
          methods: this.HTTP_POST,
          data: {
            jsonParam: JSON.stringify(postData),
            textbookType: this.paperModel.textbookType
          }
        }).then(res => {
          closeLoading()
          this.dialogFormVisible = false
          this.$successMsg('添加成功')
          this.$emit('reload')
        }).catch(_ => {
          closeLoading()
        })
      })
    },
    validateCode({ start, end, type = '课程' }) {
      const startCode = parseInt(start)
      const endCode = parseInt(end)
      if (!startCode || !endCode) {
        this.$errorMsg(`请选择开始和结束${type}`)
        return false
      }
      if (startCode - endCode > 0) {
        this.$errorMsg(`结束${type}不能小于开始${type}`)
        return false
      }
      return true
    },
    calcRange({ start, end, type = '课程' }) {
      const startCode = parseInt(start)
      const endCode = parseInt(end)
      let index = startCode
      const codes = []
      do {
        const item = type === '课程' ? this.courseList.find(courseItem => courseItem.courseId === index)
          : this.levelList.find(levelItem => levelItem.courseLevelId === index)
        if (item) {
          codes.push(item)
        }
        index++
      } while (index <= endCode)
      return codes
    },
    openWordDrawer(init) {
      if (init) {
        const resultCourseCodes = this.validateCode(this.courseObj)
        if (!resultCourseCodes) {
          return
        }
        const resultLevelCodes = this.validateCode(this.levelObj)
        if (resultLevelCodes) {
          this.paperModel.levelCodes = this.calcRange(this.levelObj)
          this.$nextTick(_ => { this.$refs.wordList.show(init) })
        }
      } else {
        this.$refs.wordList.show(init)
      }
    },
    lockRandomHandler(result) {
      this.lockRandomWord = result
    }
  }
}
</script>

<style>
</style>
