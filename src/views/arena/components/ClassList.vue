<template>
  <div>
    <el-drawer
      :visible.sync="openDrawer"
      direction="rtl"
      :with-header="false"
      size="50%"
    >
      <div class="padding">
        <div class="flex justify-between align-center">
          <el-button
            type="primary"
            size="mini"
            @click="openDrawer = false"
          >关闭</el-button>
          <el-button
            type="primary"
            size="mini"
            @click="confirm"
          >确定</el-button>
        </div>
        <el-table
          v-loading="loading"
          :stripe="tableConfig.stripe"
          :header-cell-style="tableConfig.headerCellStyle"
          :data="tableData"
          :border="tableConfig.border"
          :size="tableConfig.size"
          :default-sort="tableConfig.defalutSort"
          :style="tableConfig.style"
          height="90vh"
        >
          <el-table-column
            align="center"
            label="单词"
            prop="wordCode"
          />
          <el-table-column
            align="center"
            label="解释"
            prop="wordExplain"
          />
        </el-table>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import tableMixins from '@/mixins/table-mixins'
export default {
  name: 'ClassList',
  mixins: [tableMixins],
  data() {
    return {
      openDrawer: false
    }
  },
  methods: {
    show() {
      this.openDrawer = true
    },
    confirm() { }
  }
}
</script>

<style>
</style>
