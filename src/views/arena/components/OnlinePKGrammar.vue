<template>
  <div>
    <table-header
      ref="tableHeader"
      :form-model-array="formModelArray"
      :show-add="true"
      :show-delete="false"
      :show-search="true"
      @onadd="onAdd"
    >
      <template slot="center">
        <el-radio-group
          v-if="!$isPhone"
          v-model="status"
          size="mini"
          class="margin-left"
        >
          <el-radio-button :label="0">未开始</el-radio-button>
          <el-radio-button :label="1">进行中</el-radio-button>
          <el-radio-button :label="2">已结束</el-radio-button>
        </el-radio-group>
        <el-select
          v-else
          v-model="status"
          size="mini"
          class="margin-left"
        >
          <el-option
            label="未开始"
            :value="0"
          />
          <el-option
            label="进行中"
            :value="1"
          />
          <el-option
            label="已结束"
            :value="2"
          />
        </el-select>
      </template>
    </table-header>
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
          label="名称"
          prop="arenaName"
          width="130"
          :fixed="$isPhone ? false : 'left'"
        />
        <el-table-column
          align="center"
          label="题目数量"
          prop="practicePassNum"
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
          label="到期时间"
          prop="endArenaTime"
          width="160"
        />
        <el-table-column
          align="center"
          label="报名截止时间"
          prop="comeInArenaEndTime"
          width="160"
        />
        <el-table-column
          align="center"
          label="奖励方式"
          prop="rewardType"
        >
          <template slot-scope="scope">
            <div class="text-cut">
              <el-link
                v-if="scope.row.rewardType === 0"
                type="danger"
                :underline="false"
              >线下</el-link>
              <el-link
                v-else
                type="primary"
                :underline="false"
              >线上</el-link>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="创建时间"
          prop="createTime"
          width="180"
        />
        <el-table-column
          align="center"
          label="操作"
          :fixed="$isPhone ? false : 'right'"
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
    <add-grammar-arena
      ref="addGrammarArena"
      @reload="reload"
    />
    <arena-grammar-details
      ref="arenaGrammarDetails"
      :arena-model="arenaItem"
    />
  </div>
</template>

<script>
import TableMixins from '@/mixins/table-mixins'
import userMixins from '@/mixins/user-mixins'
import AddGrammarArena from './AddGrammarArena.vue'
import ArenaGrammarDetails from './ArenaGrammarDetails.vue'
export default {
  name: 'OnlinePKGrammar',
  components: {
    AddGrammarArena,
    ArenaGrammarDetails
  },
  mixins: [TableMixins, userMixins],
  data() {
    return {
      formModelArray: [],
      arenaItem: null,
      status: 0
    }
  },
  watch: {
    status(newVal) {
      this.page = 1
      this.loading = true
      this.getData()
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    reload() {
      this.page = 1
      this.loading = true
      if (this.status === 0) {
        this.getData()
      } else {
        this.status = 0
      }
    },
    getData() {
      this.$http({
        url: this.$urlPath.queryArenaList,
        methods: this.HTTP_GET,
        data: {
          schoolId: this.$store.getters.schoolId,
          pageNum: this.page,
          pageSize: this.pageSize,
          status: this.status,
          textbookType: 1
        }
      }).then(res => {
        this.onSuccess(res.obj)
      })
    },
    onAdd() {
      if (!this.checkButtonPermission('arena_add')) {
        return
      }
      this.$refs.addGrammarArena.showDialog()
    },
    showDetails(item) {
      if (!this.checkButtonPermission('arena_details')) {
        return
      }
      this.$refs.arenaGrammarDetails.showDialog()
      this.arenaItem = item
    }
  }
}
</script>
