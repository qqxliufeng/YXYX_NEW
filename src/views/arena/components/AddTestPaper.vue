<template>
  <div>
    <el-dialog
      title="创建考试"
      :visible.sync="dialogFormVisible"
      width="60%"
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
              <el-radio-button :label="1">线上</el-radio-button>
              <el-radio-button :label="0">线下</el-radio-button>
            </el-radio-group>
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
              @change="textBookChange"
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
              :disabled="paperModel.lockRandomWord"
              style="margin-left: 5%"
              type="primary"
              size="mini"
              @click="openWordDrawer"
            >选择词语</el-button>
            <el-button
              :disabled="!paperModel.lockRandomWord"
              type="danger"
              size="mini"
              @click="drawerWordList = true"
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
  </div>
</template>

<script>
export default {
  name: 'AddTestPaper',
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
      openWordDrawer: false,
      paperModel: {
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
        beginExamTime: 0, // 考试开始时间
        useExamTime: 10 // 考试用时,单位分钟
      }
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
      const result = this.validateCourseCode()
      if (result) {
        this.getLevelList()
      }
    },
    'paperModel.examType'(newVal) {
      this.paperModel.questionType = 1
      this.subjectTypes.forEach(it => {
        it.disabled = newVal === 1 ? it.value !== 1 : it.disabled = false
      })
    }
  },
  methods: {
    show() {
      this.dialogFormVisible = true
      if (this.textBookList.length === 0) {
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
      const resultCourse = this.validateCourseCode()
      if (resultCourse) {
        console.log(resultCourse)
      }
      const resultLevel = this.validateLevelCode()
      if (resultLevel) {
        console.log(resultLevel)
      }
    },
    validateCourseCode() {
      const startCode = parseInt(this.paperModel.startCourseCode)
      const endCode = parseInt(this.paperModel.endCourseCode)
      if (!startCode || !endCode) {
        this.$errorMsg('请选择开始和结束课程')
        return false
      }
      if (startCode - endCode > 0) {
        this.$errorMsg('结束课程不能小于开始课程')
        return false
      }
      let index = startCode
      this.paperModel.courseCodes = []
      do {
        const item = this.courseList.find(courseItem => courseItem.courseId === index)
        if (item) {
          this.paperModel.courseCodes.push(item)
        }
        index++
      } while (index <= endCode)
      return true
    },
    validateLevelCode() {
      if (!this.paperModel.startLevelCode || !this.paperModel.endLevelCode) {
        this.$errorMsg('请选择开始和结束课程')
        return false
      }
      const startCode = this.paperModel.startLevelCode
      const endCode = this.paperModel.endLevelCode
      if (startCode - endCode > 0) {
        this.$errorMsg('结束关卡不能小于开始关卡')
        return false
      }
      let index = startCode
      this.paperModel.levelCodes = []
      do {
        const item = this.levelList.find(levelItem => levelItem.courseLevelId === index)
        if (item) {
          this.paperModel.levelCodes.push(item)
        }
        index++
      } while (index <= endCode)
      return true
    },
    textBookChange() { }
  }
}
</script>

<style>
</style>
