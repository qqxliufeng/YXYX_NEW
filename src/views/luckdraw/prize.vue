<template>
  <div class="container">
    <table-header
      ref="tableHeader"
      title="抽奖列表"
      :show-search="false"
      :show-add="true"
      :show-delete="false"
      @onadd="onAdd"
    />
    <el-card
      :body-style="{ padding: 0 }"
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
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          align="center"
          label="ID"
          prop="prizeId"
          fixed="left"
        />
        <el-table-column
          align="center"
          prop="prizeTitle"
          label="抽奖标题"
          fixed="left"
          width="100"
        />
        <el-table-column
          align="center"
          prop="schoolName"
          label="学校名称"
          width="160"
        />
        <el-table-column
          align="center"
          prop="consumeCoins"
          label="所需优币"
        />
        <el-table-column
          align="center"
          prop="prizeLimitNum"
          label="抽奖次数"
        />
        <el-table-column
          align="center"
          label="抽奖状态"
          width="140"
        >
          <template slot-scope="scope">
            <table-status :status="{label: scope.row.isEnable === 0 ? '关闭' : '已启用', type: scope.row.isEnable === 0 ? 'danger' : 'success'}" />
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="createTime"
          label="添加时间"
          width="160"
        >
          <template slot-scope="scope">
            {{ scope.row.createTime | parseTime }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="createTime"
          label="操作"
          width="320"
          fixed="right"
        >
          <template slot-scope="scope">
            <el-button
              :size="$style.tableButtonSize"
              type="primary"
              @click="handlerUpdate(scope.row)"
            >编辑</el-button>
            <el-button
              v-if="scope.row.isEnable === 0"
              :size="$style.tableButtonSize"
              type="warning"
              @click="openPrize(scope.row)"
            >启用</el-button>
            <el-button
              v-if="scope.row.isEnable === 1"
              :size="$style.tableButtonSize"
              type="danger"
              @click="closePrize(scope.row)"
            >关闭</el-button>
            <el-button
              :size="$style.tableButtonSize"
              type="success"
              @click="prizeGoods(scope.row)"
            >奖品设置</el-button>
            <el-button
              :size="$style.tableButtonSize"
              type="danger"
              @click="deleteItem(scope.row)"
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
    <!--添加修改抽奖对话框-->
    <el-dialog
      :title="mode === 'add' ? '添加抽奖信息' : '编辑抽奖信息'"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        ref="dataForm"
        class="dialog-container"
      >
        <el-form-item
          label="抽奖标题"
          prop="deptName"
        >
          <el-col :span="$style.dialogColSpan">
            <el-input
              v-model="prizeModel.prizeTitle"
              placeholder="请输入抽奖标题"
              clearable
            />
          </el-col>
        </el-form-item>
        <el-form-item
          label="所需优币"
          prop="deptCode"
        >
          <el-col :span="$style.dialogColSpan">
            <el-input-number
              v-model="prizeModel.consumeCoins"
              :min="1"
              style="width: 100%"
            />
          </el-col>
        </el-form-item>
        <el-form-item
          label="抽奖次数"
          prop="parentDeptId"
        >
          <el-col :span="$style.dialogColSpan">
            <el-input-number
              v-model="prizeModel.prizeLimitNum"
              style="width: 100%"
              :min="1"
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
    <!--添加修改抽奖对话框-->
  </div>
</template>

<script>
import tableMixins from '../../mixins/table-mixins'
export default {
  name: 'Prize',
  mixins: [tableMixins],
  data() {
    return {
      mode: 'add',
      dialogFormVisible: false,
      prizeModel: {
        prizeTitle: '', // 抽奖标题
        consumeCoins: 10, // 每次消耗优币数
        prizeLimitNum: 1 // 抽奖次数限制
      }
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    onAdd() {
      if (!this.checkButtonPermission('add')) {
        return
      }
      this.mode = 'add'
      this.prizeModel = {
        prizeTitle: '', // 抽奖标题
        consumeCoins: 10, // 每次消耗优币数
        prizeLimitNum: 1 // 抽奖次数限制
      }
      this.dialogFormVisible = true
    },
    handlerUpdate(item) {
      if (!this.checkButtonPermission('edit')) {
        return
      }
      this.mode = 'edit'
      this.prizeModel.prizeId = item.prizeId
      this.prizeModel.prizeTitle = item.prizeTitle
      this.prizeModel.consumeCoins = item.consumeCoins
      this.prizeModel.prizeLimitNum = item.prizeLimitNum
      this.dialogFormVisible = true
    },
    handleDialogConfirm() {
      if (!this.prizeModel.prizeTitle) {
        this.$errorMsg('请输入抽奖标题')
        return
      }
      this.dialogFormVisible = false
      if (this.mode === 'add') {
        this.$showLoading(closeLoading => {
          this.$http({
            url: this.$urlPath.savePrize,
            data: {
              schoolId: this.$store.getters.schoolId,
              prizeTitle: this.prizeModel.prizeTitle,
              consumeCoins: this.prizeModel.consumeCoins,
              prizeLimitNum: this.prizeModel.prizeLimitNum
            },
            withUserId: false,
            withRoleId: false,
            contentType: 'application/json; charset=UTF-8'
          }).then(res => {
            this.prizeModel.prizeTitle = ''
            this.prizeModel.consumeCoins = 10
            this.prizeModel.prizeLimitNum = 1
            closeLoading()
            this.$successMsg('添加成功')
            this.getData()
          }).catch(_ => {
            closeLoading()
          })
        })
      } else {
        this.$showLoading(closeLoading => {
          this.$http({
            url: this.$urlPath.updatePrize,
            data: {
              prizeId: this.prizeModel.prizeId,
              prizeTitle: this.prizeModel.prizeTitle,
              consumeCoins: this.prizeModel.consumeCoins,
              prizeLimitNum: this.prizeModel.prizeLimitNum
            },
            withUserId: false,
            withRoleId: false,
            contentType: 'application/json; charset=UTF-8'
          }).then(res => {
            closeLoading()
            this.$successMsg('修改成功')
            this.getData()
          }).catch(_ => {
            closeLoading()
          })
        })
      }
    },
    openPrize(item) {
      if (!this.checkButtonPermission('unlock')) {
        return
      }
      this.setEnable(item, 1)
    },
    closePrize(item) {
      if (!this.checkButtonPermission('lock')) {
        return
      }
      this.setEnable(item, 0)
    },
    setEnable(item, isEnable) {
      this.$warningConfirm(`是否要${isEnable === 0 ? '关闭' : '开启'}此抽奖信息？`, _ => {
        this.$showLoading(closeLoading => {
          this.$http({
            url: this.$urlPath.setIsEnable,
            data: {
              prizeId: item.prizeId,
              isEnable
            },
            withUserId: false,
            withRoleId: false
          }).then(res => {
            item.isEnable = isEnable
            this.$successMsg(`抽奖已${isEnable === 0 ? '关闭' : '开启'}`)
            closeLoading()
          }).catch(_ => {
            closeLoading()
          })
        })
      })
    },
    deleteItem(item) {
      if (!this.checkButtonPermission('delete')) {
        return
      }
      this.$warningConfirm('是否要删除此抽奖信息，删除后不可恢复。', _ => {
        this.$showLoading(closeLoading => {
          this.$http({
            url: this.$urlPath.deletePrize,
            data: {
              prizeId: item.prizeId
            }
          }).then(res => {
            closeLoading()
            this.$successMsg('删除成功')
            this.getData()
          }).catch(_ => {
            closeLoading()
          })
        })
      })
    },
    prizeGoods(item) {
      if (!this.checkButtonPermission('setting')) {
        return
      }
      this.$router.push({
        name: 'PrizeGoodsInfo',
        params: {
          prizeId: item.prizeId
        }
      })
    },
    getData() {
      this.$http({
        url: this.$urlPath.queryPrizeList,
        methods: this.HTTP_GET,
        data: {
          pageNum: this.page,
          pageSize: this.pageSize,
          schoolId: this.$store.getters.schoolId
        }
      }).then(res => {
        this.onSuccess(res.obj)
      })
    }
  }
}
</script>
