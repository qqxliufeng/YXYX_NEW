<template>
  <div style="margin-bottom: 5px">
    <el-card :body-style="{padding: '0px'}">
      <div
        slot="header"
        class="flex align-center"
      >
        <span class="text-bold text-sm">{{ title }}</span>
        <div class="flex-sub" />
      </div>
      <el-row
        style="margin: 8px 0"
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
              v-model="courseCode"
              class="flex-sub"
              style="margin-left: 10px"
              placeholder="请选择课程"
            >
              <el-option
                v-for="item of courseList"
                :key="item.courseCode"
                :label="item.courseName"
                :value="item.courseCode"
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
              v-model="levelCode"
              class="flex-sub"
              style="margin-left: 10px"
              placeholder="请选择关卡"
            >
              <el-option
                v-for="item of levelList"
                :key="item.textbookId"
                :label="item.textbookName"
                :value="item.textbookId"
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
      courseCode: '',
      levelCode: ''
    }
  },
  watch: {
    materialId(newVal, oldVal) {
      if (!this.showCourse) {
        this.changeValue()
      } else {
        if (newVal) {
          this.courseCode = ''
          this.levelCode = ''
          this.courseList = []
          this.levelList = []
          this.getCourseList(newVal, _ => {
            if (this.courseList && this.courseList.length > 0) {
              this.courseCode = this.courseList[0].courseCode
            }
          })
        }
      }
    },
    courseCode(newVal, oldVal) {
      if (!this.showLevel) {
        this.changeValue()
      } else {
        if (newVal) {
          this.levelCode = ''
          this.levelList = ''
          this.getLevelList(this.materialId, newVal, _ => {
            if (this.levelList && this.levelList.length > 0) {
              this.levelCode = this.levelList[0].textbookId
            }
          })
        }
      }
    },
    levelCode(newVal, oldVal) {
      if (newVal) {
        this.changeValue()
      }
    }
  },
  mounted() {
    this.getMaterialList(_ => {
      if (this.materialList && this.materialList.length > 0) {
        this.materialId = this.materialList[0].textbookId
      }
    })
  },
  methods: {
    changeValue() {
      this.$emit('on-change-value', {
        textbookId: this.materialId,
        courseCode: this.courseCode,
        levelCode: this.levelCode
      })
    }
  }
}
</script>
