<template>
  <div>
    <el-dialog
      title="收货地址"
      :visible.sync="dialogFormVisible"
      width="60%"
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
        <el-form-item label="选择课程">
          <el-col :span="20">
            <el-checkbox-group v-model="arenaModel.subjectTypes">
              <el-checkbox
                v-for="item of subjectTypes"
                :key="item.value"
                :label="item.name"
              />
            </el-checkbox-group>
          </el-col>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="dialogFormVisible = false"
        >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'AddArena',
  data() {
    return {
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
      dialogFormVisible: false,
      arenaModel: {
        name: '',
        textBookId: '',
        courseCodes: [],
        subjectTypes: []
      }
    }
  },
  watch: {
    'arenaModel.textBookId'(newVal) {
      this.getCourseList(newVal)
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
    }
  }
}
</script>

<style>
</style>
