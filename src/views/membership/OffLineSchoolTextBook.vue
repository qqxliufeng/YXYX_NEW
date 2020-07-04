<template>
  <div class="container">
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
        <!-- createId: 1
    createTime: 1593680865000
    dr: 0
    isHasExercises: 0
    isHasVideo: 0
    isOpenUser: 0
    offlineSchoolId: null
    progressNo: 6
    resourceFileUrl: "/opt/nginx/yxvue/dist/adminFile/books/resourceFile/3/resourceFile.7z"
    schoolIds: null
    status: 0
    stuTextbookId: null
    studyCardCreateId: null
    textbookCategory: 2
    textbookId: 3
    textbookName: "人教PEP三上"
    textbookType: 0
    textbookVersion: "人教版"
    unLockCoins: 1
    updateId: 5
    updateTime: 1593768950000 -->
        <el-table-column
          align="center"
          prop="textbookId"
          label="ID"
          fixed="left"
        />
        <el-table-column
          align="center"
          prop="textbookName"
          label="教材名称"
          fixed="left"
          width="150"
        />
        <el-table-column
          align="center"
          label="教材类型"
          :formatter="typeFormatter"
        />
        <el-table-column
          align="center"
          label="教材类别"
          :formatter="categoryFormatter"
        />
        <el-table-column
          align="center"
          prop="textbookVersion"
          label="教材版本"
        />
        <el-table-column
          align="center"
          prop="unLockCoins"
          label="解锁优钻"
        />
        <el-table-column
          align="center"
          label="包含视频"
          :formatter="videoFormatter"
        />
        <el-table-column
          align="center"
          label="配对练习"
          :formatter="exercisesFormatter"
        />
        <el-table-column
          align="center"
          label="开放状态"
          :formatter="openFormatter"
        />
        <el-table-column
          align="center"
          prop="createTime"
          label="创建时间"
          width="160"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <div>{{ scope.row.createTime | parseTime }}</div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="status"
          label="状态"
        >
          <template slot-scope="scope">
            <table-status :status="statusFormatter(scope.row)" />
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="resourceFileUrl"
          label="资源地址"
          width="320"
        >
          <template slot-scope="scope">
            <div>
              {{ scope.row.resourceFileUrl ? scope.row.resourceFileUrl.replace('/opt/nginx/yxvue/dist/', '') : '暂无地址' }}
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
  </div>
</template>

<script>
import tableMixins from '../../mixins/table-mixins'
import textBookMixins from '../../mixins/text-book-mixins'
export default {
  name: 'OffLineSchoolTextBool',
  mixins: [tableMixins, textBookMixins],
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      this.$http({
        url: this.$urlPath.querySchoolAndTextBook,
        methods: this.HTTP_GET,
        data: {
          schoolId: this.$route.params.schoolId,
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
