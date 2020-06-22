<template>
  <div class="container">
    <table-header
      title="授权当前教材到某个学校"
      :show-add="false"
      :show-delete="false"
      :show-search="false"
    />
    <el-card :body-style="{ padding: '2px' }">
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
        <el-table-column
          align="center"
          label="学校名称"
          prop="schoolName"
          width="120"
          fixed="left"
        />
        <el-table-column
          align="center"
          label="账号"
          prop="schoolTel"
          min-width="120"
          fixed="left"
        />
        <el-table-column
          align="center"
          label="管理员"
        >
          <template slot-scope="scope">{{
            scope.row.schoolLeaderName | emptyFormat
          }}</template>
        </el-table-column>
        <el-table-column
          align="center"
          label="联系方式"
          prop="schoolTel"
          min-width="120"
        />
        <el-table-column
          align="center"
          label="地区"
          min-width="150"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="text-cut">{{
              scope.row.province + "/" + scope.row.city + "/" + scope.row.area
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="详细地址"
          width="200"
          prop="addressDetail"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="text-cut">{{ getAddressInfo(scope.row) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="创建时间"
          prop="createTime"
          min-width="180"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <div class="text-cut">
              {{ scope.row.createTime | parseTime }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="到期时间"
          min-width="180"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <div class="text-cut">{{ scope.row.endTime | parseTime }}</div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="状态"
          prop="status"
          :formatter="statusFormat"
        />
        <el-table-column
          align="center"
          label="授权状态"
          fixed="right"
          width="100"
        >
          <template slot-scope="scope">
            <el-button
              :size="$style.tableButtonSize"
              :type="scope.row.status === 0 ? 'danger' : 'warning'"
            >
              已授权
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import tableMixins from '../../mixins/table-mixins'
export default {
  name: 'GrantTextBookToSchool',
  mixins: [tableMixins],
  mounted() {
    this.getData()
  },
  methods: {
    getAddressInfo(item) {
      if (item.addressDetailList && item.addressDetailList.length > 0) {
        return item.addressDetailList.map(it => it.address).join(',')
      }
      return '暂无详细地址'
    },
    statusFormat(item) {
      if (parseInt(item.status) === 0) {
        return '正常'
      }
      if (parseInt(item.status) === 1) {
        return '禁用'
      }
      return '未知'
    },
    getData() {
      this.$http({
        url: this.$urlPath.querySchoolList,
        methods: this.HTTP_GET,
        data: {
          pageNum: this.page,
          pageSize: this.pageSize
        }
      }).then(res => {
        this.loading = false
        this.tableData = res.obj.list
      })
    }
  }
}
</script>
