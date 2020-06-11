<template>
  <div class="container">
    <table-header
      :title="'当前学习卡编码：' + $route.params.studyCardCode"
      :show-delete="false"
      :show-add="false"
    >
      <template slot="other">
        <el-button type="primary" size="mini">批量授权</el-button>
      </template>
    </table-header>
    <el-card :body-style="{padding: 0}">
      <el-table
        v-loading="loading"
        :stripe="tableConfig.stripe"
        :header-cell-style="tableConfig.headerCellStyle"
        :data="tableData"
        :border="tableConfig.border"
        :size="tableConfig.size"
        :default-sort="tableConfig.defalutSort"
        :style="tableConfig.style"
      >
        <el-table-column align="center" prop="textbookId" label="ID" />
        <el-table-column align="center" prop="textbookName" label="教材名称" />
        <el-table-column
          align="center"
          prop="studyCardCreateId"
          label="授权状态"
          :formatter="grantStatusFormatter"
        />
        <el-table-column align="center" prop="resourceFileUrl" label="资源地址" show-overflow-tooltip />
        <el-table-column align="center" prop="createTime" label="创建时间" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.createTime | parseTime }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="200">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="grantToCard(scope.row)">授权</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import TableMixins from '../../mixins/table-mixins'
export default {
  name: 'TextBookList',
  mixins: [TableMixins],
  mounted() {
    this.getData()
  },
  methods: {
    grantStatusFormatter(item) {
      return item.studyCardCreateId === null ? '未授权' : '已授权'
    },
    grantToCard(item) {
      this.$http({
        url: this.$urlPath.studyCardAssignedTextBook,
        data: {
          studyCardId: this.$route.params.studyCardId,
          cardCode: this.$route.params.studyCardCode,
          cardErcode: this.$route.params.studyCardErcode,
          textBookIds: item.textbookId,
          roleCode: this.$roles.roleCode
        }
      }).then(res => {
        console.log(res)
      })
    },
    getData() {
      this.$http({
        url: this.$urlPath.queryAllTextBookAndStudyCard,
        methods: this.HTTP_GET,
        data: {
          studyCardId: this.$route.params.studyCardId
        }
      }).then(res => {
        this.loading = false
        this.tableData = res.obj
      })
    }
  }
}
</script>

<style>
</style>
