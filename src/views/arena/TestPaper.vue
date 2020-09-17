<template>
  <div class="container">
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
          v-model="status"
          size="mini"
          class="margin-left"
        >
          <el-radio-button :label="0">未开始</el-radio-button>
          <el-radio-button :label="1">进行中</el-radio-button>
          <el-radio-button :label="2">已结束</el-radio-button>
        </el-radio-group>
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
          prop="examName"
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
          prop="beginExamTime"
          width="160"
        />
        <el-table-column
          align="center"
          label="考试时长"
          width="160"
        >
          <template slot-scope="scope">
            <div class="text-cut">
              {{ scope.row.useExamTime + '分钟' }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="到期时间"
          prop="endExamTime"
          width="160"
        />
        <el-table-column
          align="center"
          label="考试类型"
          prop="rewardType"
        >
          <template slot-scope="scope">
            <div class="text-cut">
              <el-link
                v-if="scope.row.examType === 0"
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
          label="分配状态"
          prop="rewardType"
        >
          <template slot-scope="scope">
            <div class="text-cut">
              <el-link
                v-if="scope.row.isAssignment === 0"
                type="danger"
                :underline="false"
              >未分配</el-link>
              <el-link
                v-else
                type="primary"
                :underline="false"
              >已分配</el-link>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="分配类型"
          prop="rewardType"
        >
          <template slot-scope="scope">
            <div class="text-cut">
              <el-link
                v-if="scope.row.classOrStudent === 0"
                type="danger"
                :underline="false"
              >班级</el-link>
              <el-link
                v-else-if="scope.row.classOrStudent === 1"
                type="primary"
                :underline="false"
              >个人</el-link>
              <el-link
                v-else
                type="primary"
                :underline="false"
              >暂无</el-link>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="是否发布"
          prop="rewardType"
        >
          <template slot-scope="scope">
            <div class="text-cut">
              <el-link
                v-if="scope.row.isOpen === 0"
                type="danger"
                :underline="false"
              >未发布</el-link>
              <el-link
                v-else
                type="primary"
                :underline="false"
              >已发布</el-link>
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
          label="操作"
          fixed="right"
          width="200"
        >
          <template slot-scope="scope">
            <div>
              <el-dropdown
                split-button
                type="primary"
                size="mini"
                @command="more"
              >
                查看
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="a">试卷详情</el-dropdown-item>
                  <el-dropdown-item command="a">考试成绩</el-dropdown-item>
                  <el-dropdown-item command="a">分配的班级</el-dropdown-item>
                  <el-dropdown-item command="a">分配的个人</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <el-dropdown
                split-button
                type="danger"
                size="mini"
                @command="assignment"
              >
                分配
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item :command="{type: 0, item: scope.row}">到班级</el-dropdown-item>
                  <el-dropdown-item :command="{type: 1, item: scope.row}">到个人</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
            <div class="margin-top">
              <el-button
                :size="$style.tableButtonSize"
                type="warning"
                style="width: 86px"
                @click="open(scope.row)"
              >发布</el-button>
              <el-dropdown
                split-button
                type="success"
                size="mini"
                @command="down"
              >
                下载
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="a">有答案</el-dropdown-item>
                  <el-dropdown-item command="a">无答案</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
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
    <add-test-paper ref="addTestPaper" />
    <student-list ref="studentList" />
    <class-list ref="classList" />
  </div>
</template>

<script>
import tableMixins from '@/mixins/table-mixins'
import AddTestPaper from './components/AddTestPaper'
import StudentList from './components/StudentList'
import ClassList from './components/ClassList'
export default {
  name: 'TestPaper',
  components: { AddTestPaper, StudentList, ClassList },
  mixins: [tableMixins],
  data() {
    return {
      formModelArray: [],
      examItem: null,
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
    onAdd() {
      this.$refs.addTestPaper.show()
    },
    getData() {
      this.$http({
        url: this.$urlPath.queryExamList,
        methods: this.HTTP_GET,
        data: {
          schoolId: this.$store.getters.schoolId,
          pageNum: this.page,
          pageSize: this.pageSize,
          status: this.status
        }
      }).then(res => {
        this.onSuccess(res.obj)
      }).catch(_ => {
        this.onError()
      })
    },
    more() { },
    assignment({ type, item }) {
      if (type === 0) {
        this.$refs.classList.show()
      } else {
        this.$refs.studentList.show()
      }
    },
    open(item) {
      if (item.isAssignment === 0) {
        this.$errorMsg('请先将此考试信息分配给班级或个人')
        return
      }
      if (item.isOpen === 1) {
        this.$errorMsg('此考试信息已经发布，请勿重复发布')
        return
      }
      this.$warningConfirm('是否要发布此考试信息？', () => {
        this.$http({
          url: this.$urlPath.openExam,
          methods: this.HTTP_GET,
          data: {}
        }).then(res => {
          console.log(res)
        })
      })
    },
    down() { }
  }
}
</script>

<style>
</style>
