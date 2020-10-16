<template>
  <div
    id="content-wrapper"
    class="container"
  >
    <el-tabs v-model="activeName" style="margin: 3px">
      <el-tab-pane label="词汇教材" name="first" class="tab-container" lazy>
        <MaterialWord />
      </el-tab-pane>
      <el-tab-pane label="语法教材" name="second" class="tab-container" lazy>
        <MaterailGrammar />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import MaterialWord from './components/MaterialWord'
import MaterailGrammar from './components/MaterialGrammar'
export default {
  name: 'Material',
  components: { MaterialWord, MaterailGrammar },
  data() {
    return {
      activeName: 'second'
    }
  }
}
</script>
<style lang="scss" scoped>
>>> .el-tabs__header{
  margin: 0 0 5px
}
</style>
