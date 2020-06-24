<template>
  <div class="container">
    <table-header
      title="基本操作"
      :form-model-array="formModelArray"
      :show-delete="false"
      :show-add="false"
      @onsearch="onSearch"
    >
      <template slot="other">
        <el-button
          type="warning"
          size="mini"
          @click="generatorCards"
        >批量生成学习卡</el-button>
        <el-button
          type="danger"
          size="mini"
          @click="downCards"
        >批量下载学习卡</el-button>
      </template>
    </table-header>
    <el-card :body-style="{ padding: 0 }">
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
            <span>{{ scope.row.validityMonth + "个月" }}</span>
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
      :page-num="page"
      @prev-click="prevClick"
      @next-click="nextClick"
      @current-change="currentChange"
      @refresh="reloadData"
    />
    <!-- 批量生成学习卡对话框 -->
    <el-dialog
      title="批量生成学习卡"
      :visible.sync="dialogFormVisible"
    >
      <el-form class="dialog-container">
        <el-form-item
          label="学习卡类型"
          prop="parentDeptId"
        >
          <el-col :span="$style.dialogColSpan">
            <el-select
              v-model="generatorCardObj.cardType"
              style="width: 100%"
              class="filter-item"
              placeholder="请选择学习卡类型"
            >
              <el-option
                v-for="item of cardTypes"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item
          label="学习卡数量"
          prop="menuSequence"
        >
          <el-col :span="$style.dialogColSpan">
            <el-input-number
              v-model="generatorCardObj.studyCardNum"
              style="width: 100%"
              :min="1"
              :max="200"
            />
          </el-col>
        </el-form-item>
        <el-form-item label="有效期时间">
          <el-col :span="$style.dialogColSpan">
            <div class="flex">
              <el-input-number
                v-model="generatorCardObj.validityMonth"
                class="flex-sub margin-right-lg"
                :min="1"
              />
              <el-link :underline="false">单位：月</el-link>
            </div>
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
    <!-- 批量生成学习卡对话框 -->

    <!-- 编辑学习卡对话框 -->
    <el-dialog
      title="编辑学习卡信息"
      :visible.sync="dialogEditVisible"
    >
      <el-form class="dialog-container">
        <el-form-item label="到期时间">
          <el-col :span="$style.dialogColSpan">
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
      <div class="dialog-container">
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
      </div>
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
import { blobToExecl } from '../../api/common'
export default {
  name: 'StudyCard',
  mixins: [tableMixins, studyCardMixins],
  data() {
    return {
      formModelArray: [
        {
          id: 1,
          value: '',
          label: '学习卡编码',
          name: 'cardCode',
          span: 5,
          type: 'input'
        },
        {
          id: 2,
          value: '',
          label: '学习卡状态',
          name: 'status',
          span: 5,
          type: 'select',
          selectOptions: [
            {
              label: '未激活',
              value: 2
            },
            {
              label: '已激活',
              value: 3
            },
            {
              label: '已到期',
              value: 4
            }
          ]
        },
        {
          id: 3,
          value: '',
          label: '是否绑定',
          name: 'isBind',
          span: 5,
          type: 'select',
          selectOptions: [
            {
              label: '未绑定',
              value: 0
            },
            {
              label: '已绑定',
              value: 1
            }
          ]
        }
      ],
      generatorCardObj: {
        cardType: 'P',
        studyCardNum: 1,
        validityMonth: 1
      },
      dialogFormVisible: false
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    initData() {
      this.likeSearchUrl = this.$urlPath.queryStudyCardLike
    },
    generatorCards() {
      this.dialogFormVisible = true
    },
    downCards() {
      if (this.canHandlerItems()) {
        this.confirmHandlerMultiItems(
          '确定要下载此记录吗？',
          'studyCardId',
          ids => {
            this.$http({
              url: this.$urlPath.uploadStudyCardExcel,
              methods: this.HTTP_GET,
              data: {
                studyCardIds: ids
              },
              responseType: `blob`
            }).then(res => {
              blobToExecl(res)
            })
          }
        )
      }
    },
    handleDialogConfirm() {
      this.dialogFormVisible = false
      this.$warningConfirm('确定要批量生成学习卡吗？', _ => {
        this.$http({
          url: this.$urlPath.saveStudyCard,
          data: this.generatorCardObj
        }).then(res => {
          this.$successMsg('生成成功')
          this.getData()
        })
      })
    },
    getData() {
      this.$http({
        url: this.$urlPath.queryStudyCard,
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
