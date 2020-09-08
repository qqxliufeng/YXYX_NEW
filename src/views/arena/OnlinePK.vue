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
          label="开始时间"
          prop="beginArenaTime"
          width="160"
        />
        <el-table-column
          align="center"
          label="比赛时长"
          prop="useArenaTime"
          width="160"
        >
          <template slot-scope="scope">
            <div class="text-cut">
              {{ scope.row.useArenaTime + '分钟' }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="报名截止时间"
          prop="arenaEndTime"
          width="160"
        />
        <el-table-column
          align="center"
          label="奖励方式"
          prop="rewardType"
        >
          <template slot-scope="scope">
            <div class="text-cut">
              {{ scope.row.rewardType === 0 ? '线下奖励' : '线上奖励' }}
            </div>
          </template>
        </el-table-column>
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
          width="150"
        >
          <template slot-scope="scope">
            <el-button
              :size="$style.tableButtonSize"
              type="danger"
              @click="showDetails(scope.row)"
            >查看详情</el-button>
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
    <arena-details
      ref="arenaDetails"
      :arena-model="arenaItem"
    />
  </div>
</template>

<script>
import TableMixins from '../../mixins/table-mixins'
import userMixins from '../../mixins/user-mixins'
import AddArena from './components/AddArena.vue'
import ArenaDetails from './components/ArenaDetails.vue'
export default {
  name: 'OnlinePK',
  components: {
    AddArena,
    ArenaDetails
  },
  mixins: [TableMixins, userMixins],
  data() {
    return {
      formModelArray: [],
      arenaItem: null
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    statusFormat(item) {
      switch (item.status) {
        case 0:
          return { label: '未开始', type: 'primary' }
        case 1:
          return { label: '进行中', type: 'danger' }
        case 2:
          return { label: '已结束', type: 'warning' }
      }
    },
    reload() {
      this.page = 1
      this.getData()
    },
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
    },
    showDetails(item) {
      this.$refs.arenaDetails.showDialog()
      this.arenaItem = item
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
