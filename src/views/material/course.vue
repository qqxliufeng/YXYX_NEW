<template>
  <div class="container">
    <el-tabs v-model="activeName" style="margin: 3px">
      <el-tab-pane label="词汇课程" name="first" class="tab-container" lazy>
        <CourseWord />
      </el-tab-pane>
      <el-tab-pane label="语法课程" name="second" class="tab-container" lazy>
        <CourseGrammar />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import CourseWord from './components/CourseWord'
import CourseGrammar from './components/CourseGrammar'
export default {
  name: 'Course',
  components: {
    CourseWord,
    CourseGrammar
  },
  data() {
    return {
      activeName: 'first'
    }
  }
}
</script>

<style lang="scss" scoped>
>>> .el-tabs__header{
  margin: 0 0 5px
}
</style>
