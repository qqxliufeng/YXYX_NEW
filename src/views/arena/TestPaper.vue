<template>
  <div id="content-wrapper" class="container">
    <el-tabs v-model="activeName" style="margin: 3px">
      <el-tab-pane label="词汇考试" name="first" class="tab-container" lazy>
        <TestPaperWord />
      </el-tab-pane>
      <el-tab-pane label="语法考试" name="second" class="tab-container" lazy>
        <TestPaperGrammar />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import TestPaperWord from './components/TestPaperWord'
import TestPaperGrammar from './components/TestPaperGrammar'
export default {
  name: 'TestPaper',
  components: {
    TestPaperWord,
    TestPaperGrammar
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
