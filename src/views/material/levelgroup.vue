<template>
  <div class="container">
    <material-table-header
      :show-course="true"
      :show-level="true"
      @on-change-value="onChangeValue"
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
        <!-- courseCode: "1"
createId: 1
createTime: 1585124434000
dr: 0
groupCode: "1-1-1"
groupName: "第1组"
groupVideo: null
levelCode: "1-1"
levelgroupId: 1
status: 0
textbookId: 1
updateId: null
updateTime: null -->
        <el-table-column
          align="center"
          label="ID"
          prop="levelgroupId"
          fixed="left"
        />
        <el-table-column
          align="center"
          label="关卡编号"
          prop="levelCode"
          fixed="left"
        />
        <el-table-column
          align="center"
          label="分组编号"
          prop="groupCode"
          fixed="left"
        />
        <el-table-column
          align="center"
          label="分组名称"
          prop="groupName"
          width="150"
          fixed="left"
          show-overflow-tooltip
        />
        <el-table-column
          align="center"
          label="视频地址"
          prop="groupVideo"
        >
          <template slot-scope="scope">
            <div>{{ scope.row.groupVideo === null ? '暂无' : scope.row.groupVideo }}</div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="创建时间"
          prop="createTime"
          width="160"
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
          label="状态"
          prop="status"
        >
          <template slot-scope="scope">
            <div>
              <el-link
                :type="scope.row.status === 0 ? 'primary' : 'danger'"
                :underline="false"
              >
                {{ scope.row.status === 0 ? '正常' : '禁用' }}
              </el-link>
            </div>
          </template>
        </el-table-column>
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
import MaterialTableHeader from './components/MaterialTableHeader'
import tableMixins from '../../mixins/table-mixins'
export default {
  name: 'LevelGroup',
  components: {
    MaterialTableHeader
  },
  mixins: [tableMixins],
  methods: {
    onChangeValue({ textbookId, courseCode, levelCode }) {
      this.getData(textbookId, courseCode, levelCode)
    },
    getData(textbookId, courseCode, levelCode) {
      this.$http({
        url: this.$urlPath.queryCourseLevelGroup,
        methods: this.HTTP_GET,
        data: {
          textbookId,
          courseCode,
          levelCode,
          pageNum: this.page,
          pageSize: this.pageSize
        }
      }).then(res => {
        this.onSuccess(res.obj)
      })
    }
  }
}
</script>
