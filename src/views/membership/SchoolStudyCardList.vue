<template>
  <div class="container">
    <table-header
      :title="$route.params.schoolName + ' 下'+ ($route.params.type === 1 ? '已分配' : '未分配') +'的学习卡信息'"
      :show-add="false"
      :show-delete="false"
      :show-search="false"
    />
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
        <el-table-column align="center" prop="cardCode" label="学习卡编码" width />
        <el-table-column align="center" prop="cardErcode" label="二维码" show-overflow-tooltip />
        <el-table-column
          align="center"
          prop="cardType"
          label="学习卡类型"
          :formatter="cardTypeFormatter"
        />
        <el-table-column align="center" prop="isBind" label="绑定状态" :formatter="bindFormatter" />
        <el-table-column align="center" prop="validityMonth" label="有效期">
          <template slot-scope="scope">
            <span>{{ scope.row.validityMonth + '个月' }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="createTime" label="创建时间" show-overflow-tooltip />
        <el-table-column align="center" prop="endTime" label="到期时间" :formatter="endTimeFormatter" />
        <el-table-column align="center" prop="status" label="状态" :formatter="statusFormatter" />
      </el-table>
    </el-card>
    <table-foot
      :total="total"
      :page-size="pageSize"
      @prev-click="prevClick"
      @next-click="nextClick"
      @current-change="currentChange"
      @refresh="reloadData"
    />
  </div>
</template>

<script>
import tableMixins from '../../mixins/table-mixins'
import studyCardMixins from '../../mixins/study-card-mixins'
export default {
  name: 'SchoolStudyCardList',
  mixins: [tableMixins, studyCardMixins],
  data() {
    return {}
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      this.$http({
        url:
          this.$route.params.type === 1
            ? this.$urlPath.queryStudyCardBySchoolId
            : this.$urlPath.queryStudyCardNotBind,
        methods: this.HTTP_GET,
        data: {
          pageNum: this.page,
          pageSize: this.pageSize,
          schoolId: this.$route.params.schoolId
        }
      }).then(res => {
        this.onSuccess(res.obj)
      })
    }
  }
}
</script>
