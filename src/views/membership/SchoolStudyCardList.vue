<template>
  <div class="container">
    <table-header
      :title="$route.params.schoolName + ' 下'+ (Number($route.params.type) === 1 ? '已分配' : '未分配') +'的学习卡信息'"
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
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          align="center"
          type="selection"
          width="55"
          fixed="left"
        />
        <el-table-column
          align="center"
          prop="cardCode"
          label="学习卡编码"
          fixed="left"
          width="90"
        />
        <el-table-column
          align="center"
          prop="cardErcode"
          label="二维码"
          width="150"
          show-overflow-tooltip
        />
        <el-table-column
          align="center"
          prop="cardType"
          label="学习卡类型"
          width="100"
          :formatter="cardTypeFormatter"
        />
        <el-table-column
          align="center"
          prop="validityMonth"
          label="有效期"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.validityMonth + '个月' }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="createTime"
          label="创建时间"
          width="160"
          show-overflow-tooltip
        />
        <el-table-column
          align="center"
          prop="endTime"
          label="到期时间"
          width="100"
          :formatter="endTimeFormatter"
        />
        <el-table-column
          align="center"
          prop="isBind"
          label="绑定状态"
          :formatter="bindFormatter"
        />
        <el-table-column
          align="center"
          prop="status"
          label="状态"
          width="100"
          :formatter="statusFormatter"
        />
        <el-table-column
          align="center"
          label="操作"
          min-width="200"
          fixed="right"
        >
          <template slot-scope="scope">
            <!-- 只有在已激活或者已过期的情况下才能修改到期时间 -->
            <el-button
              v-if="scope.row.status === 3 || scope.row.status === 4"
              type="primary"
              :size="$style.tableButtonSize"
              @click="addEndTime(scope.row)"
            >延期时间</el-button>
            <!-- 只有在未激活的情况下才能编辑分配教材的 -->
            <el-button
              v-if="scope.row.status <= 2"
              type="danger"
              :size="$style.tableButtonSize"
              @click="textBookList(scope.row)"
            >授权教材</el-button>
            <el-button
              type="warning"
              :size="$style.tableButtonSize"
              @click="grantTextBookList(scope.row)"
            >查看教材</el-button>
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
    <!-- 编辑学习卡对话框 -->
    <el-dialog
      title="编辑学习卡信息"
      :visible.sync="dialogEditVisible"
    >
      <el-form
        label-position="left"
        label-width="120px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="到期时间">
          <el-col :span="24">
            <el-date-picker
              v-model="tempItem.endTime"
              style="width: 100%"
              type="date"
              placeholder="选择到期时间"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
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
          @click="dialogEditVisible = false"
        >取消</el-button>
        <el-button
          :size="$style.dialogButtonSize"
          type="primary"
          @click="handleEditDialogConfirm"
        >确定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑学习卡对话框 -->
    <!-- 授权列表对话框 -->
    <el-dialog
      title="授权教材列表"
      :visible.sync="dialogGrantTextBookVisible"
    >
      <el-table
        v-loading="grantTextBookLoading"
        :stripe="tableConfig.stripe"
        :header-cell-style="tableConfig.headerCellStyle"
        :data="grantTextBookTableData"
        :border="tableConfig.border"
        :size="tableConfig.size"
        :default-sort="tableConfig.defalutSort"
        :style="tableConfig.style"
      >
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
        />
        <el-table-column
          align="center"
          prop="createTime"
          label="创建时间"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span>{{ scope.row.createTime | parseTime }}</span>
          </template>
        </el-table-column>
      </el-table>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          :size="$style.dialogButtonSize"
          @click="dialogGrantTextBookVisible = false"
        >知道了</el-button>
      </div>
    </el-dialog>
    <!-- 授权列表对话框 -->
  </div>
</template>

<script>
import tableMixins from '../../mixins/table-mixins'
import studyCardMixins from '../../mixins/study-card-mixins'
export default {
  name: 'SchoolStudyCardList',
  mixins: [tableMixins, studyCardMixins],
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      this.$http({
        url:
          Number(this.$route.params.type) === 1
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
