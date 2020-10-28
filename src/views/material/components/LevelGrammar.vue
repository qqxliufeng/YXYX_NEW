<template>
  <div>
    <material-table-header
      ref="tableHeader"
      :show-course="true"
      :show-level="false"
      material-type="grammar"
      @on-change-value="onChangeValue"
    >
      <div slot="other">
        <el-button
          size="mini"
          type="danger"
          @click="changeVideoUrl"
        >更改语法视频地址</el-button>
      </div>
    </material-table-header>
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
          label="序号"
          prop="courseLevelId"
          fixed="left"
        >
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="唯一标识"
          prop="courseLevelId"
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
          label="关卡名称"
          prop="levelName"
          width="150"
          fixed="left"
        />
        <el-table-column
          align="center"
          label="视频地址"
          prop="videoURL"
          width="300"
        >
          <template slot-scope="scope">
            <el-link
              class="text-cut"
              type="primary"
              :underline="true"
            >
              <a
                :href="baseImageIp + (!!scope.row.videoURL ? scope.row.videoURL.replace('/opt/nginx/yxvue/dist', '') : '')"
                target="_blank"
              >{{ scope.row.videoURL | filterPath }}</a>
            </el-link>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="创建时间"
          prop="createTime"
          width="160"
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
import MaterialTableHeader from './MaterialTableHeader'
import tableMixins from '@/mixins/table-mixins'
import { baseImageIp } from '@/api/url-path'
export default {
  name: 'LevelGrammar',
  components: {
    MaterialTableHeader
  },
  mixins: [tableMixins],
  data() {
    return {
      baseImageIp,
      textbookId: 0,
      courseCode: 0
    }
  },
  methods: {
    onChangeValue({ textbookId, courseCode }) {
      if (!textbookId || !courseCode) {
        this.$errorMsg('暂无课程信息')
        this.loading = false
        this.tableData = []
        return
      }
      this.loading = true
      this.page = 1
      this.textbookId = textbookId
      this.courseCode = courseCode
      this.getData()
    },
    getData() {
      if (!this.textbookId || !this.courseCode) {
        this.loading = false
        return
      }
      this.$http({
        url: this.$urlPath.queryCourseLevel,
        methods: this.HTTP_GET,
        data: {
          textbookId: this.textbookId,
          courseCode: this.courseCode,
          pageNum: this.page,
          pageSize: this.pageSize
        }
      }).then(res => {
        this.onSuccess(res.obj)
      })
    },
    changeVideoUrl() {
      if (!this.checkButtonPermission('change_vedio')) {
        return
      }
      if (!this.textbookId) {
        this.$errorMsg('参数错误')
        return
      }
      this.$warningConfirm('是否要更改语法视频地址？', _ => {
        this.$showLoading(closeLoading => {
          this.$http({
            url: this.$urlPath.updateCourseLevelVideoUrl,
            data: {
              textbookId: this.textbookId
            }
          }).then(res => {
            closeLoading()
            this.$successMsg(res.msg)
          }).catch(_ => {
            closeLoading()
          })
        })
      })
    }
  }
}
</script>
