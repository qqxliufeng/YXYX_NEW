<template>
  <div class="container">
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
          label="操作"
          fixed="right"
          min-width="250"
        >
          <template slot-scope="scope">
            <el-button
              :size="$style.tableButtonSize"
              :type="scope.row.status === 0 ? 'danger' : 'warning'"
              @click="
                changeLockStatus({
                  item: scope.row,
                  statusField: 'status',
                  data: { schoolId: scope.row.schoolId },
                  lockUrl: $urlPath.lockSchool,
                  unLockUrl: $urlPath.unLockSchool
                })
              "
            >{{ scope.row.status === 0 ? "禁用" : "解锁" }}</el-button>
            <el-button
              :size="$style.tableButtonSize"
              type="primary"
              @click="editAccountInfo(scope.row)"
            >编辑</el-button>
            <el-dropdown
              style="display: inline-block; margin-left: 10px"
              :size="$style.tableButtonSize"
              type="success"
              split-button
              @command="handleSchoolCommand"
            >
              更多
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :command="{ tag: 1, item: scope.row }">已分配的学习卡</el-dropdown-item>
                <el-dropdown-item :command="{ tag: 2, item: scope.row }">未分配的学习卡</el-dropdown-item>
                <el-dropdown-item :command="{ tag: 3, item: scope.row }">查询服务记录</el-dropdown-item>
                <el-dropdown-item :command="{ tag: 4, item: scope.row }">增加服务记录</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
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
    getData() {
      this.$http({
        url: this.$urlPath.querySchoolList,
        methods: this.HTTP_GET,
        data: {
          pageNum: this.page,
          pageSize: this.pageSize
        }
      }).then(res => {
        console.log(res)
      })
    }
  }
}
</script>
