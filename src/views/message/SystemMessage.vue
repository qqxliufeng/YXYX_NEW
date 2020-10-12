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
      :body-style="{ padding: '2px' }"
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
          width="80"
        >
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="消息标题"
          prop="title"
          width="150"
          fixed="left"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <div class="text-cut">
              {{ scope.row.title }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="目标群体"
        >
          <template slot-scope="scope">
            <div>
              <el-link :underline="false" :type="targetFormat(scope.row).type" @click="seeTargetMore(scope.row)">
                {{ targetFormat(scope.row).label }}
                <i v-if="scope.row.sendType !== 3" class="el-icon-view el-icon--right" />
              </el-link>
              <!-- <table-status :status="targetFormat(scope.row)" />
              <el-link
                v-if="scope.row.sendType !== 3"
                @click="seeTargetMore(scope.row)"
              >查看详情</el-link> -->
            </div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="消息内容"
          width="350"
        >
          <template slot-scope="scope">
            <div
              class="text-cut"
              @click="showDetail(scope.row)"
            >
              <a>{{ scope.row.messageContent }}</a>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="消息状态"
          prop="status"
        >
          <template slot-scope="scope">
            <table-status :status="statusFormat(scope.row)" />
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="操作"
          :fixed="$isPhone ? false : 'right'"
          width="150"
        >
          <template slot-scope="scope">
            <div v-if="isSuperAdmin">
              <el-button
                v-if="scope.row.status === 0"
                :size="$style.tableButtonSize"
                type="primary"
                @click="publish(scope.row)"
              >发布</el-button>
              <el-button
                v-else-if="scope.row.status === 1"
                :size="$style.tableButtonSize"
                type="danger"
                @click="withdraw(scope.row)"
              >撤回</el-button>
              <div v-else>--</div>
            </div>
            <div v-else>
              <el-button
                v-if="scope.row.status === 0 && scope.row.createSchoolId === $store.getters.schoolId"
                :size="$style.tableButtonSize"
                type="primary"
                @click="publish(scope.row)"
              >发布</el-button>
              <el-button
                v-else-if="scope.row.status === 1 && scope.row.createSchoolId === $store.getters.schoolId"
                :size="$style.tableButtonSize"
                type="danger"
                @click="withdraw(scope.row)"
              >撤回</el-button>
              <div v-else>--</div>
            </div>
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
    <add-system-message
      ref="addSystemMessage"
      @reload="reloadData"
    />
    <target-details ref="targetDetails" />
  </div>
</template>

<script>
import tableMixins from '@/mixins/table-mixins'
import userMixins from '@/mixins/user-mixins'
import AddSystemMessage from './components/AddSystemMessage'
import TargetDetails from './components/TargetDetails'
export default {
  name: 'SystemMessage',
  components: { AddSystemMessage, TargetDetails },
  mixins: [tableMixins, userMixins],
  data() {
    return {
      formModelArray: []
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    statusFormat(item) {
      switch (item.status) {
        case 0:
          return {
            type: 'warning',
            label: '未发布'
          }
        case 1:
          return {
            type: 'primary',
            label: '已发布'
          }
        case 2:
          return {
            type: 'danger',
            label: '已撤回'
          }
      }
    },
    targetFormat(item) {
      switch (item.sendType) {
        case 0:
          return {
            type: 'warning',
            label: '学校'
          }
        case 1:
          return {
            type: 'primary',
            label: '班级'
          }
        case 2:
          return {
            type: 'danger',
            label: '个人'
          }
        case 3:
          return {
            type: 'success',
            label: '全平台'
          }
      }
    },
    onAdd() {
      if (!this.checkButtonPermission('sys_msg_add')) {
        return
      }
      this.$refs.addSystemMessage.showDialog()
    },
    getData() {
      this.$http({
        url: this.$urlPath.querySystemMessage,
        methods: this.HTTP_GET,
        data: {
          pageNum: this.page,
          pageSize: this.pageSize,
          schoolId: this.$store.getters.schoolId
        }
      }).then(res => {
        this.onSuccess(res.obj)
      })
    },
    publish(item) {
      if (!this.checkButtonPermission('sys_msg_pub')) {
        return
      }
      this.$warningConfirm('是否要发布此系统消息？', _ => {
        this.$showLoading(closeLoading => {
          this.$http({
            url: this.$urlPath.sendSystemMessage,
            data: {
              messageId: item.messageId,
              sendType: item.sendType,
              title: item.title
            }
          }).then(res => {
            closeLoading()
            this.$successMsg('消息发布成功')
            this.getData()
          }).catch(_ => {
            closeLoading()
          })
        })
      })
    },
    withdraw(item) {
      if (!this.checkButtonPermission('sys_msg_back')) {
        return
      }
      this.$warningConfirm('确定要撤回此系统消息，撤回后不可再发布此消息。', _ => {
        this.$showLoading(closeLoading => {
          this.$http({
            url: this.$urlPath.withdrawSystemMessage,
            data: {
              messageId: item.messageId
            }
          }).then(res => {
            closeLoading()
            this.$successMsg('消息撤回成功')
            this.getData()
          }).catch(_ => {
            closeLoading()
          })
        })
      })
    },
    showDetail(item) {
      this.$alert(item.messageContent, item.title, null)
    },
    seeTargetMore(item) {
      item.sendType !== 3 && this.$refs.targetDetails.show(item)
    }
  }
}
</script>
