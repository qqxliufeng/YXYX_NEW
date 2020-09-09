<template>
  <div class="container">
    <table-header
      ref="tableHeader"
      :form-model-array="formModelArray"
      :show-add="true"
      :show-delete="false"
      :show-search="true"
      @onadd="onAdd"
    />
    <el-card
      ref="tableContainer"
      :body-style="{padding: 0}"
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
        :height="tableConfig.style.myHeight"
      >
        <el-table-column
          align="center"
          label="序号"
          fixed="left"
        >
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="jobName"
          label="任务名称"
          fixed="left"
        />
        <el-table-column
          align="center"
          prop="jobDescription"
          label="任务描述"
          width="200"
        >
          <template slot-scope="scope">
            <div>
              {{ scope.row.jobDescription || '---' }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="prevFireTime"
          label="上次执行时间"
          width="200"
        />
        <el-table-column
          align="center"
          prop="jobGroupName"
          label="状态"
        >
          <template slot-scope="scope">
            <table-status :status="getCrontabStatus(scope.row)" />
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="cronExpression"
          label="表达式"
          width="200"
        />
        <el-table-column
          align="center"
          prop="jobClassName"
          label="任务类名"
          width="250"
        />
        <el-table-column
          align="center"
          prop="jobGroupName"
          label="任务所在组"
          width="100"
        />
        <el-table-column
          align="center"
          prop="triggerName"
          label="触发器名称"
          width="160"
        />
        <el-table-column
          align="center"
          prop="triggerGroupName"
          label="触发器所在组"
          width="160"
        />
        <el-table-column
          align="center"
          prop="nextFireTime"
          label="下次执行时间"
          width="200"
        />
        <el-table-column
          header-align="center"
          align="right"
          label="操作"
          fixed="right"
          width="220"
        >
          <template slot-scope="scope">
            <el-button
              type="primary"
              :size="$style.tableButtonSize"
              @click="pauseJob(scope.row)"
            >暂停</el-button>
            <el-button
              type="warning"
              :size="$style.tableButtonSize"
              @click="resumeJob(scope.row)"
            >继续</el-button>
            <el-button
              type="danger"
              :size="$style.tableButtonSize"
              @click="deleteJob(scope.row)"
            >删除</el-button>
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
    <el-dialog
      title="添加定时任务"
      :visible.sync="dialogFormVisible"
      top="10vh"
    >
      <el-form
        ref="dataForm"
        class="dialog-container"
      >
        <el-form-item label="任务名称">
          <el-col :span="$style.dialogColSpan">
            <el-input
              v-model="crontabModel.jName"
              placeholder="请输入任务名称（必填）"
            />
          </el-col>
        </el-form-item>
        <el-form-item label="任务类名">
          <el-col :span="$style.dialogColSpan">
            <el-input
              v-model="crontabModel.jobClassName"
              placeholder="请输入任务类名（必填）"
            />
          </el-col>
        </el-form-item>
        <el-form-item label="任务组名">
          <el-col :span="$style.dialogColSpan">
            <el-input
              v-model="crontabModel.jGroup"
              placeholder="请输入任务组名（必填）"
            />
          </el-col>
        </el-form-item>
        <el-form-item label="触发器名">
          <el-col :span="$style.dialogColSpan">
            <el-input
              v-model="crontabModel.tName"
              placeholder="请输入触发器名（必填）"
            />
          </el-col>
        </el-form-item>
        <el-form-item label="触发器组">
          <el-col :span="$style.dialogColSpan">
            <el-input
              v-model="crontabModel.tGroup"
              placeholder="请输入触发器组（必填）"
            />
          </el-col>
        </el-form-item>
        <el-form-item label="表  达  式">
          <el-col :span="$style.dialogColSpan">
            <el-input
              v-model="crontabModel.croncron"
              placeholder="请输入表达式（必填）"
            />
            <div>
              <el-link
                type="danger"
                :underline="false"
                target="_blank"
                href="https://cron.qqe2.com/"
              >点击跳转</el-link>
            </div>
          </el-col>
        </el-form-item>
        <el-form-item label="任务描述">
          <el-col :span="$style.dialogColSpan">
            <el-input
              v-model="crontabModel.jobDescription"
              placeholder="请输入任务描述"
            />
          </el-col>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          :size="$style.dialogButtonSize"
          @click="dialogFormVisible = false"
        >取消</el-button>
        <el-button
          :size="$style.dialogButtonSize"
          type="primary"
          @click="handleDialogConfirm"
        >确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import tableMixins from '@/mixins/table-mixins'
export default {
  name: 'CrontabManager',
  mixins: [tableMixins],
  data() {
    return {
      formModelArray: [],
      dialogFormVisible: false,
      crontabModel: {
        jobClassName: '', // 定时任务类名
        jName: '', // 任务名称
        jGroup: '', // 任务组
        tName: '', // 触发器名称
        tGroup: '', // 触发器组
        croncron: '', // 表达式
        jobDescription: ''
      }
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    getCrontabStatus(item) {
      switch (item.triggerState) {
        case 'WAITING':
          return { label: '等待', type: 'info' }
        case 'PAUSED':
          return { label: '暂停', type: 'primary' }
        case 'ACQUIRED':
          return { label: '正常', type: 'success' }
        case 'BLOCKED':
          return { label: '阻塞', type: 'warning' }
        case 'ERROR':
          return { label: '错误', type: 'danger' }
      }
    },
    onAdd() {
      if (!this.checkButtonPermission('cron_add')) {
        return
      }
      this.dialogFormVisible = true
      this.crontabModel = {
        jobClassName: '', // 定时任务类名
        jName: '', // 任务名称
        jGroup: '', // 任务组
        tName: '', // 触发器名称
        tGroup: '', // 触发器组
        croncron: '', // 表达式
        jobDescription: ''
      }
    },
    pauseJob(item) {
      if (!this.checkButtonPermission('cron_pause')) {
        return
      }
      this.$warningConfirm('是否要暂停此定时任务', () => {
        this.$http({
          url: this.$urlPath.pauseJob,
          methods: this.HTTP_GET,
          data: {
            jName: item.jobName,
            jGroup: item.jobGroupName
          }
        }).then(res => {
          this.$successMsg('定时任务暂停成功')
          this.getData()
        })
      })
    },
    resumeJob(item) {
      if (!this.checkButtonPermission('cron_resume')) {
        return
      }
      this.$warningConfirm('是否要继续执行此定时任务', () => {
        this.$http({
          url: this.$urlPath.resumeJob,
          methods: this.HTTP_GET,
          data: {
            jName: item.jobName,
            jGroup: item.jobGroupName
          }
        }).then(res => {
          this.$successMsg('定时任务执行成功')
          this.getData()
        })
      })
    },
    deleteJob(item) {
      if (!this.checkButtonPermission('cron_delete')) {
        return
      }
      this.$warningConfirm('是否要删除此定时任务', () => {
        this.$http({
          url: this.$urlPath.deleteJob,
          methods: this.HTTP_GET,
          data: {
            jName: item.jobName,
            jGroup: item.jobGroupName
          }
        }).then(res => {
          this.$successMsg('定时任务删除成功')
          this.getData()
        })
      })
    },
    handleDialogConfirm() {
      if (!this.crontabModel.jName) {
        this.$errorMsg('请输入任务名称')
        return
      }
      if (!this.crontabModel.jobClassName) {
        this.$errorMsg('请输入任务类名')
        return
      }
      if (!this.crontabModel.jGroup) {
        this.$errorMsg('请输入任务组名')
        return
      }
      if (!this.crontabModel.tName) {
        this.$errorMsg('请输入触发器名称')
        return
      }
      if (!this.crontabModel.tGroup) {
        this.$errorMsg('请输入触发器组名称')
        return
      }
      if (!this.crontabModel.croncron) {
        this.$errorMsg('请输入表达式')
        return
      }
      this.$showLoading(closeLoading => {
        this.$http({
          url: this.$urlPath.insertJob,
          methods: this.HTTP_GET,
          data: {
            jobClassName: this.crontabModel.jobClassName,
            jName: this.crontabModel.jName,
            jGroup: this.crontabModel.jGroup,
            tName: this.crontabModel.tName,
            tGroup: this.crontabModel.tGroup,
            cron: this.crontabModel.croncron,
            jobDescription: this.crontabModel.jobDescription
          }
        }).then(res => {
          this.dialogFormVisible = false
          closeLoading()
          this.$successMsg('定时任务添加成功')
          this.getData()
        }).catch(_ => {
          closeLoading()
        })
      })
    },
    getData() {
      this.$http({
        url: this.$urlPath.queryJob,
        methods: this.HTTP_GET,
        data: {
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

<style>
</style>
