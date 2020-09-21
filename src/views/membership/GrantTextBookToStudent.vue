<template>
  <div class="container">
    <table-header
      title="提示：已授权分配的教材不能取消分配"
      :show-search="false"
      :show-add="false"
      :show-delete="false"
    >
      <template slot="other">
        <el-button
          type="primary"
          size="mini"
          @click="grantTextBook"
        >批量授权</el-button>
      </template>
    </table-header>
    <el-card :body-style="{padding: 0}">
      <el-table
        ref="muiltTable"
        v-loading="loading"
        :stripe="tableConfig.stripe"
        :header-cell-style="tableConfig.headerCellStyle"
        :data="tableData"
        :border="tableConfig.border"
        :size="tableConfig.size"
        :default-sort="tableConfig.defalutSort"
        :style="tableConfig.style"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          align="center"
          type="selection"
          width="55"
          fixed="left"
          :selectable="canSelectable"
        />
        <el-table-column
          align="center"
          prop="textbookId"
          label="ID"
        />
        <el-table-column
          align="center"
          prop="textbookName"
          label="教材名称"
        />
        <el-table-column
          align="center"
          prop="textbookVersion"
          label="教材版本"
        />
        <el-table-column
          align="center"
          prop="resourceFileUrl"
          label="资源地址"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <div>{{ scope.row.resourceFileUrl || '--' }}</div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="createTime"
          label="拼写状态"
        >
          <template slot-scope="scope">
            <table-status
              v-if="scope.row.stuTextbookId !== null"
              :status="{type: scope.row.isJumpWrite === 0 ? 'primary' : 'danger', label: scope.row.isJumpWrite === 0 ? '未跳过' : '已跳过'}"
            />
            <div v-else>--</div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="createTime"
          label="创建时间"
          width="160"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span>{{ scope.row.createTime | parseTime }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="状态"
        >
          <template slot-scope="scope">
            <table-status :status="{type: scope.row.stuTextbookId === null ? 'primary' : 'danger', label: scope.row.stuTextbookId === null ? '未授权' : '已授权'}" />
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="操作"
        >
          <template slot-scope="scope">
            <el-button
              :disabled="scope.row.stuTextbookId === null"
              :type="scope.row.isJumpWrite === 1 ? 'primary' : 'danger'"
              size="mini"
              @click="jumpWrite(scope.row)"
            >{{ scope.row.isJumpWrite === 1 ? '恢复拼写' : '跳过拼写' }}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
// 给线下的学生分配教材
import tableMixins from '../../mixins/table-mixins'
export default {
  name: 'GrantTextBookToStudent',
  mixins: [tableMixins],
  data() {
    return {

    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      this.$http({
        url: this.$urlPath.getAllTextBookAndStudent,
        methods: this.HTTP_GET,
        data: {
          studentId: this.$route.params.studentId
        }
      }).then(res => {
        this.loading = false
        this.tableData = res.obj
        if (this.tableData && this.tableData.length > 0) {
          const hasGrantItems = this.tableData.filter(it => it.stuTextbookId !== null)
          this.$nextTick(_ => {
            if (hasGrantItems && hasGrantItems.length > 0) {
              hasGrantItems.forEach(row => {
                this.$refs.muiltTable.toggleRowSelection(row, true)
              })
            }
          })
        }
      })
    },
    grantTextBook() {
      if (this.canHandlerItems()) {
        this.confirmHandlerMultiItems('确定要把教材授权分配到该学生上吗？', 'textbookId', ids => {
          this.$http({
            url: this.$urlPath.studentAssignedTextBook,
            data: {
              studentId: this.$route.params.studentId,
              isOnLine: 0,
              textbookIds: ids
            }
          }).then(res => {
            this.$successMsg('教材分配成功')
            this.getData()
          })
        })
      }
    },
    jumpWrite(item) {
      const tip = item.isJumpWrite === 0 ? '是否要跳过此教材的拼写功能？' : '是否要恢复此教材的拼写功能？'
      this.$warningConfirm(tip, _ => {
        this.$showLoading(closeLoading => {
          this.$http({
            url: this.$urlPath.updateStudentIsJumpWrite,
            data: {
              textBookId: item.textbookId,
              studentId: this.$route.params.studentId,
              isJumpWrite: item.isJumpWrite === 0 ? 1 : 0,
              studentType: 0
            }
          }).then(res => {
            closeLoading()
            this.$successMsg('设置成功')
            this.getData()
          }).catch(_ => {
            closeLoading()
          })
        })
      })
    },
    canSelectable(row) {
      return row.stuTextbookId === null
    }
  }
}
</script>
