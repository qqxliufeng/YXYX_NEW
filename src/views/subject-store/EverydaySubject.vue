<template>
  <div
    id="content-wrapper"
    class="container"
  >
    <el-tabs
      v-model="activeName"
      style="margin: 3px"
    >
      <el-tab-pane
        label="题目"
        name="first"
        class="tab-container"
        lazy
      >
        <EverydaySubjectWord />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import EverydaySubjectWord from './componets/EverydaySubjectWord'
export default {
  name: 'EveryDaySubject',
  components: {
    EverydaySubjectWord
  },
  data() {
    return {
      activeName: 'first'
    }
  }
}
</script>
<style lang="scss" scoped>
>>> .el-tabs__header {
  margin: 0 0 5px;
}
</style>
