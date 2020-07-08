<template>
  <div style="margin-bottom: 5px">
    <el-card :body-style="{padding: '0px'}">
      <div
        slot="header"
        class="flex align-center"
      >
        <span class="text-bold text-sm">{{ title }}</span>
        <div class="flex-sub" />
        <slot name="other" />
      </div>
      <el-row
        style="padding: 10px"
        :gutter="20"
      >
        <el-col :span="8">
          <div class="flex">
            <el-link :underline="false">选择教材</el-link>
            <el-select
              v-model="materialId"
              class="flex-sub"
              style="margin-left: 10px"
              placeholder="请选择教材"
            >
              <el-option
                v-for="item of materialList"
                :key="item.textbookId"
                :label="item.textbookName"
                :value="item.textbookId"
              />
            </el-select>
          </div>
        </el-col>
        <el-col
          v-if="showCourse"
          :span="8"
        >
          <div class="flex">
            <el-link :underline="false">选择课程</el-link>
            <el-select
              v-model="courseId"
              class="flex-sub"
              style="margin-left: 10px"
              placeholder="请选择课程"
            >
              <el-option
                v-for="item of courseList"
                :key="item.courseId"
                :label="item.courseName"
                :value="item.courseId"
              />
            </el-select>
          </div>
        </el-col>
        <el-col
          v-if="showLevel"
          :span="8"
        >
          <div class="flex">
            <el-link :underline="false">选择关卡</el-link>
            <el-select
              v-model="courseLevelId"
              class="flex-sub"
              style="margin-left: 10px"
              placeholder="请选择关卡"
            >
              <el-option
                v-for="item of levelList"
                :key="item.courseLevelId"
                :label="item.levelName"
                :value="item.courseLevelId"
              />
            </el-select>
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import materialMixins from '../../../mixins/material-mixins'
export default {
  name: 'MaterailTableHeader',
  mixins: [materialMixins],
  props: {
    title: {
      type: String,
      default: '请选择相关的条件信息'
    },
    showCourse: {
      type: Boolean,
      default: false
    },
    showLevel: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      materialId: '',
      courseId: '',
      courseLevelId: ''
    }
  },
  watch: {
    materialId(newVal, oldVal) {
      if (!this.showCourse) {
        this.changeValue()
      } else {
        if (newVal) {
          this.courseList = []
          this.getCourseList(newVal, _ => {
            if (this.courseList && this.courseList.length > 0) {
              // 如果当前的Code 和 新加载的Code值一样，手动触发改变事件
              if (this.courseId === this.courseList[0].courseId) {
                this.changeValue()
              } else {
                this.courseId = this.courseList[0].courseId
              }
            } else {
              this.courseId = ''
            }
          })
        } else {
          this.courseId = ''
          this.courseList = []
        }
      }
    },
    courseId(newVal, oldVal) {
      if (!this.showLevel) {
        this.changeValue()
      } else {
        if (newVal) {
          this.levelList = []
          const temp = this.courseList.find(it => it.courseId === newVal)
          this.getLevelList(this.materialId, temp.courseCode, _ => {
            if (this.levelList && this.levelList.length > 0) {
              // 如果当前的Code 和 新加载的Code值一样，手动触发改变事件
              if (this.courseLevelId === this.levelList[0].courseLevelId) {
                this.changeValue()
              } else {
                this.courseLevelId = this.levelList[0].courseLevelId
              }
            } else {
              this.courseLevelId = ''
            }
          })
        } else {
          this.courseLevelId = ''
          this.levelList = []
        }
      }
    },
    courseLevelId(newVal, oldVal) {
      if (newVal) {
        this.changeValue()
      }
    }
  },
  mounted() {
    this.getMaterialList(_ => {
      if (this.materialList && this.materialList.length > 0) {
        this.materialId = this.materialList[0].textbookId
      } else {
        this.changeValue()
      }
    })
  },
  methods: {
    changeValue() {
      // const courseCode = this.courseId ? this.courseList.find(it => it.courseId === this.courseId).courseCode : ''
      // const levelCode = this.courseLevelId ? this.levelList.find(it => it.courseLevelId === this.courseLevelId).levelCode : ''
      const tempCourse = this.courseList.find(it => it.courseId === this.courseId)
      const courseCode = tempCourse ? tempCourse.courseCode : ''
      const tempLevel = this.levelList.find(it => it.courseLevelId === this.courseLevelId)
      const levelCode = tempLevel ? tempLevel.levelCode : ''
      this.$emit('on-change-value', {
        textbookId: this.materialId,
        courseCode: courseCode,
        levelCode: levelCode
      })
    }
  }
}
</script>
<style lang="scss" scoped>
>>> .el-card__header {
  padding: 10px;
}
</style>
