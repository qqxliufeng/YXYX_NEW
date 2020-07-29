<template>
  <div class="container">
    <material-table-header
      ref="tableHeader"
      :show-course="true"
      :show-level="true"
      @on-change-value="onChangeValue"
    />
    <el-card
      :body-style="{ padding: '0' }"
      class="table-container"
      :style="tableCardStyle"
    >
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
          width="450"
        >
          <template slot-scope="scope">
            <el-link
              class="text-cut"
              type="primary"
              :underline="true"
            >
              <a
                :href="baseImageIp + scope.row.groupVideo"
                target="_blank"
              >{{ scope.row.groupVideo === null ? '暂无' : scope.row.groupVideo }}</a>
            </el-link>
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
            <table-status :status="{label: scope.row.status === 0 ? '正常' : '禁用', type: scope.row.status === 0 ? 'primary' : 'danger'}" />
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <table-foot
      :total="total"
      :page-size="pageSize"
      :page-num="page"
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
import { baseImageIp } from '../../api/url-path'
export default {
  name: 'LevelGroup',
  components: {
    MaterialTableHeader
  },
  mixins: [tableMixins],
  data() {
    return {
      baseImageIp
    }
  },
  methods: {
    onChangeValue({ textbookId, courseCode, levelCode }) {
      this.page = 0
      this.getData(textbookId, courseCode, levelCode)
    },
    getData(textbookId, courseCode, levelCode) {
      if (!textbookId) {
        this.loading = false
        return
      }
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
        // opt/nginx/yxvue/dist/
        this.tableData.forEach(it => {
          it.groupVideo = it.groupVideo.replace('opt/nginx/yxvue/dist/', '')
        })
      })
    }
  }
}
</script>
