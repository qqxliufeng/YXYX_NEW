<template>
  <div id="content-wrapper" class="container">
    <el-tabs v-model="activeName" style="margin: 3px">
      <el-tab-pane label="词汇竞技" name="first" class="tab-container" lazy>
        <OnlinePKWord />
      </el-tab-pane>
      <el-tab-pane label="语法竞技" name="second" class="tab-container" lazy>
        <OnlinePKGrammar />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import OnlinePKGrammar from './components/OnlinePKGrammar'
import OnlinePKWord from './components/OnlinePKWord'
export default {
  name: 'OnlinePK',
  components: {
    OnlinePKGrammar,
    OnlinePKWord
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
