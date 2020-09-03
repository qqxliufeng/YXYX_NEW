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
      >
        <el-table-column
          align="center"
          label="名称"
          prop="arenaName"
          width="130"
          fixed="left"
        />
        <el-table-column
          align="center"
          label="单词数量"
          prop="wordsNum"
        />
        <el-table-column
          align="center"
          label="题型"
          prop="questionType"
          width="120"
        />
        <el-table-column
          align="center"
          label="开始时间"
          prop="beginArenaTime"
          width="120"
        />
        <el-table-column
          align="center"
          label="截止时间"
          prop="arenaEndTime"
          width="200"
        />
        <el-table-column
          align="center"
          label="奖励方式"
          width="200"
          prop="rewardType"
        />
        <el-table-column
          align="center"
          label="创建时间"
          prop="createTime"
          width="180"
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
            <table-status :status="statusFormat(scope.row)" />
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="操作"
          fixed="right"
          :width="isSuperAdmin ? 250 : 200"
        >
          <template slot-scope="scope">
            <el-button
              v-if="isSuperAdmin"
              :size="$style.tableButtonSize"
              :type="scope.row.status === 0 ? 'danger' : 'warning'"
              @click="
                changeLockStatus({
                  item: scope.row,
                  statusField: 'status',
                  data: { schoolId: scope.row.schoolId },
                  lockUrl: $urlPath.lockSchool,
                  unLockUrl: $urlPath.unLockSchool
                })
              "
            >{{ scope.row.status === 0 ? "禁用" : "解锁" }}</el-button>
            <el-button
              v-if="isSuperAdmin"
              :size="$style.tableButtonSize"
              type="primary"
              @click="editAccountInfo(scope.row)"
            >编辑</el-button>
            <el-button
              v-if="!isSuperAdmin"
              :size="$style.tableButtonSize"
              type="primary"
              @click="$router.push({path: '/'})"
            >查看详情</el-button>
            <el-dropdown
              style="display: inline-block; margin-left: 10px"
              :size="$style.tableButtonSize"
              type="success"
              split-button
              @command="handleSchoolCommand"
            >
              更多
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-if="scope.row.isOnLine === 1"
                  :command="{ tag: 1, item: scope.row }"
                >已分配的学习卡</el-dropdown-item>
                <el-dropdown-item
                  v-if="scope.row.isOnLine === 1 && isSuperAdmin"
                  :command="{ tag: 2, item: scope.row }"
                >未分配的学习卡</el-dropdown-item>
                <el-dropdown-item
                  v-if="scope.row.isOnLine === 0"
                  :command="{ tag: 5, item: scope.row }"
                >已分配的教材</el-dropdown-item>
                <el-dropdown-item :command="{ tag: 3, item: scope.row }">查询服务记录</el-dropdown-item>
                <el-dropdown-item :command="{ tag: 4, item: scope.row }">增加服务记录</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
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
    <add-arena ref="addArena" />
  </div>
</template>

<script>
import TableMixins from '../../mixins/table-mixins'
import userMixins from '../../mixins/user-mixins'
import AddArena from './components/AddArena.vue'
export default {
  name: 'OnlinePK',
  components: {
    AddArena
  },
  mixins: [TableMixins, userMixins],
  data() {
    return {
      formModelArray: []
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      this.$http({
        url: this.$urlPath.queryArenaList,
        methods: this.HTTP_GET,
        data: {
          schoolId: this.$store.getters.schoolId,
          pageNum: this.page,
          pageSize: this.pageSize
        }
      }).then(res => {
        this.onSuccess(res.obj)
      })
    },
    onAdd() {
      this.$refs.addArena.showDialog()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
