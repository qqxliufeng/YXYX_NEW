<template>
  <div>
    <el-drawer
      :visible.sync="openDrawer"
      direction="rtl"
      :with-header="false"
      :size="$isPhone ? '70%' : '40%'"
    >
      <div class="padding">
        <div class="flex justify-between align-center">
          <el-button
            type="danger"
            size="mini"
            @click="openDrawer = false"
          >关闭</el-button>
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
            label="学校名称"
            prop="schoolName"
          />
          <el-table-column
            align="center"
            label="班级名称"
            prop="className"
          >
            <template slot-scope="scope">
              <div> {{ scope.row.className || '--' }} </div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="学生名称"
            prop="studentName"
          >
            <template slot-scope="scope">
              <div> {{ scope.row.studentName || '--' }} </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import tableMixins from '@/mixins/table-mixins'
export default {
  name: 'TargetDetails',
  mixins: [tableMixins],
  data() {
    return {
      openDrawer: false
    }
  },
  methods: {
    show({ sendType = null, messageId = null }, data = null) {
      this.openDrawer = true
      if (!data) {
        this.$http({
          url: this.$urlPath.querySystemMessageToList,
          methods: this.HTTP_GET,
          data: {
            sendType,
            messageId
          }
        }).then(res => {
          this.loading = false
          this.tableData = res.obj
        })
      } else {
        this.loading = false
        this.tableData = data
      }
    }
  }
}
</script>

<style>
</style>
