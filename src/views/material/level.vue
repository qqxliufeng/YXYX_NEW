<template>
  <div class="container">
    <el-tabs v-model="activeName" style="margin: 3px">
      <el-tab-pane label="词汇关卡" name="first" class="tab-container" lazy>
        <LevelWord />
      </el-tab-pane>
      <el-tab-pane label="语法关卡" name="second" class="tab-container" lazy>
        <LevelGrammar />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import LevelWord from './components/LevelWord'
import LevelGrammar from './components/LevelGrammar'
export default {
  name: 'Level',
  components: {
    LevelWord,
    LevelGrammar
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
