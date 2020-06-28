<template>
  <el-container>
    <el-header height="100">
      <el-card :body-style="{padding: 0}">
        <div slot="header">
          hasdfasdf
        </div>
        <div style="margin: 20px">
          this is body
        </div>
      </el-card>
    </el-header>
    <el-main>
      <el-table :data="tableData">
        <el-table-column
          prop="date"
          label="日期"
          width="140"
        />
        <el-table-column
          prop="name"
          label="姓名"
          width="120"
        />
        <el-table-column
          prop="address"
          label="地址"
        />
      </el-table>
    </el-main>
    <el-footer>footer</el-footer>
  </el-container>
</template>

<script>
export default {
  name: 'GroupMessage',
  data() {
    const item = {
      date: '2016-05-02',
      name: '王小虎',
      address: '上海市普陀区金沙江路 1518 弄'
    }
    return {
      tableData: Array(20).fill(item)
    }
  }
}
</script>
<style lang="scss" scoped>
.el-container {
  height: calc(100vh - 80px);
  background-color: #f5f5f5;
  border-radius: 5px;
  margin: 2px;
}
.el-header {
  margin-bottom: 10px;
  padding: 0;
}
</style>
