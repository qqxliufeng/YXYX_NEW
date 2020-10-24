<template>
  <div class="container">
    <table-header
      ref="tableHeader"
      :title="$route.params.schoolName + ' 下'+ (Number($route.params.type) === 1 ? ' 已分配 ' : ' 未分配 ') +'的学习卡信息'"
      :show-add="false"
      :show-delete="false"
      :show-search="false"
    >
      <template slot="center">
        <el-select
          v-model="materialType"
          class="margin-left"
          size="small"
          placeholder="请选择教材"
        >
          <el-option
            v-for="item of $materialTypes"
            :key="item.value"
            :label="item.name"
            :value="item.value"
          />
        </el-select>
      </template>
    </table-header>
    <el-card
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
      >
        <el-table-column
          type="expand"
          label="查看教材"
          width="100"
        >
          <template slot-scope="scope">
            <el-row
              v-for="textbook of scope.row.textBookList"
              :key="textbook.textbookId"
              style="margin-bottom: 20px"
              align="middle"
            >
              <el-col
                :span="4"
                style="margin-top: 5px"
              >
                <el-link :underline="false">教材名称：</el-link>
                <el-link
                  :underline="false"
                  type="primary"
                >{{ textbook.textbookName }}</el-link>
              </el-col>
              <el-col
                :span="4"
                style="margin-top: 5px"
              >
                <el-link :underline="false">教材版本：</el-link>
                <el-link
                  :underline="false"
                  type="primary"
                >{{ textbook.textbookVersion }}</el-link>
              </el-col>
              <el-col
                :span="4"
                style="margin-top: 5px"
              >
                <el-link :underline="false">拼读状态：</el-link>
                <el-link
                  :underline="false"
                  :type="textbook.isJumpSpell === 1 ? 'primary' : 'danger'"
                >{{ textbook.isJumpSpell === 1 ? '已跳过' : '未跳过' }}</el-link>
              </el-col>
              <el-col :span="3">
                <el-button
                  size="mini"
                  :type="textbook.isJumpSpell === 1 ? 'primary' : 'danger'"
                  @click="jumpSpell(scope.row, textbook)"
                >{{ textbook.isJumpSpell === 1 ? '恢复拼读' : '跳过拼读' }}</el-button>
              </el-col>
              <el-col
                :span="4"
                style="margin-top: 5px"
              >
                <el-link :underline="false">拼写状态：</el-link>
                <el-link
                  :underline="false"
                  :type="textbook.isJumpWrite === 1 ? 'primary' : 'danger'"
                >{{ textbook.isJumpWrite === 1 ? '已跳过' : '未跳过' }}</el-link>
              </el-col>
              <el-col :span="3">
                <el-button
                  size="mini"
                  :type="textbook.isJumpWrite === 1 ? 'primary' : 'danger'"
                  @click="jumpWrite(scope.row, textbook)"
                >{{ textbook.isJumpWrite === 1 ? '恢复拼写' : '跳过拼写' }}</el-button>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="cardCode"
          label="学习卡编码"
          width="100"
        >
          <template slot-scope="scope">
            {{ scope.row.cardType + scope.row.cardCode }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="cardErcode"
          label="二维码"
          width="320"
        >
          <template slot-scope="scope">
            <el-link
              type="primary"
              @click="showCodeDialog(scope.row.cardErcode)"
            >{{ scope.row.cardErcode }}</el-link>
          </template>
        </el-table-column>
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
        >
          <template slot-scope="scope">
            <table-status :status="bindFormatter(scope.row)" />
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="status"
          label="状态"
          width="100"
        >
          <template slot-scope="scope">
            <table-status :status="statusFormatter(scope.row)" />
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="操作"
          width="200"
          fixed="right"
        >
          <template slot-scope="scope">
            <!-- 只有在已激活或者已过期的情况下才能修改到期时间 -->
            <el-button
              v-if="showAddTimeButton(scope.row)"
              type="primary"
              :size="$style.tableButtonSize"
              @click="addEndTime(scope.row)"
            >延期时间</el-button>
            <!-- 只有在未激活的情况下才能编辑分配教材的 -->
            <el-button
              v-if="scope.row.status <= 2"
              type="danger"
              :size="$style.tableButtonSize"
              @click="$router.push({
                name: 'TextBookList',
                params: {
                  studyCardId: scope.row.studyCardId,
                  studyCardCode: scope.row.cardCode,
                  studyCardErcode: scope.row.cardErcode,
                  textbookType: materialType
                }
              })"
            >授权教材</el-button>
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
    <!-- 编辑学习卡对话框 -->
    <el-dialog
      title="编辑学习卡信息"
      :visible.sync="dialogEditVisible"
    >
      <el-form
        label-position="left"
        label-width="120px"
        class="dialog-container"
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
    <!-- 查看线上学生已经分配的学习卡 -->
    <Qrcode ref="qrcode" />
  </div>
</template>

<script>
import tableMixins from '../../mixins/table-mixins'
import studyCardMixins from '../../mixins/study-card-mixins'
import userMixins from '../../mixins/user-mixins'
import materialTypeMixins from '@/mixins/material-type-mixins'
export default {
  name: 'SchoolStudyCardList',
  mixins: [tableMixins, studyCardMixins, userMixins, materialTypeMixins],
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
          schoolId: this.$route.params.schoolId,
          cardSource: this.materialType
        }
      }).then(res => {
        this.onSuccess(res.obj)
      })
    },
    addEndTime(item) {
      this.dialogEditVisible = true
      this.tempItem.studyCardId = item.studyCardId
      this.tempItem.status = item.status
      this.tempItem.isBind = item.isBind
      this.tempItem.studentId = item.studentId || 0
      this.endTime = item.endTime
    },
    grantTextBookList(item) {
      this.dialogGrantTextBookVisible = true
      this.grantTextBookLoading = true
      this.$http({
        url: this.$urlPath.queryTextBookByStudyCardId,
        methods: this.HTTP_GET,
        data: {
          studyCardId: item.studyCardId
        }
      }).then(res => {
        this.grantTextBookLoading = false
        this.grantTextBookTableData = res.obj
      })
    },
    showAddTimeButton(item) {
      return this.isSuperAdmin && (item.status === 3 || item.status === 4)
    },
    jumpSpell(studyCardItem, textbookItem) {
      const tip = textbookItem.isJumpSpell === 0 ? '是否要跳过此教材的拼读功能？' : '是否要恢复此教材的拼读功能？'
      this.$warningConfirm(tip, _ => {
        this.$showLoading(closeLoading => {
          this.$http({
            url: this.$urlPath.updateStudyCardTextBookJumpSpell,
            data: {
              textbookId: textbookItem.textbookId,
              studyCardId: studyCardItem.studyCardId,
              isJumpSpell: textbookItem.isJumpSpell === 0 ? 1 : 0
            }
          }).then(res => {
            closeLoading()
            this.$successMsg('设置成功')
            textbookItem.isJumpSpell = textbookItem.isJumpSpell === 0 ? 1 : 0
          }).catch(_ => {
            closeLoading()
          })
        })
      })
    },
    jumpWrite(studyCardItem, textbookItem) {
      const tip = textbookItem.isJumpWrite === 0 ? '是否要跳过此教材的拼写功能？' : '是否要恢复此教材的拼写功能？'
      this.$warningConfirm(tip, _ => {
        this.$showLoading(closeLoading => {
          this.$http({
            url: this.$urlPath.updateStudentIsJumpWrite,
            data: {
              textBookId: textbookItem.textbookId,
              studyCardId: studyCardItem.studyCardId,
              isJumpWrite: textbookItem.isJumpWrite === 0 ? 1 : 0,
              studentType: 1
            }
          }).then(res => {
            closeLoading()
            this.$successMsg('设置成功')
            textbookItem.isJumpWrite = textbookItem.isJumpWrite === 0 ? 1 : 0
          }).catch(_ => {
            closeLoading()
          })
        })
      })
    },
    showCodeDialog(code) {
      this.$refs.qrcode.show(code)
    }
  }
}
</script>
