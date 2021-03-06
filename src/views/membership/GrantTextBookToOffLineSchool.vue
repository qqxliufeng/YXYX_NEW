<template>
  <div class="container">
    <table-header
      title="基本操作"
      :show-delete="false"
      :show-add="false"
      :show-search="false"
    >
      <template slot="other">
        <el-button
          type="success"
          size="mini"
          @click="grantToSchool"
        >授权教材到学校</el-button>
      </template>
    </table-header>
    <el-card :body-style="{padding: 0}">
      <el-table
        ref="multiTable"
        v-loading="loading"
        :stripe="tableConfig.stripe"
        :header-cell-style="tableConfig.headerCellStyle"
        :data="tableData"
        :border="tableConfig.border"
        :size="tableConfig.size"
        :default-sort="tableConfig.defalutSort"
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
          prop="textbookName"
          label="教材名称"
          fixed="left"
          width="90"
        />
        <el-table-column
          align="center"
          label="教材类型"
        >
          <template slot-scope="scope">
            <table-status :status="{ label: scope.row.textbookType === 0 ? '词汇' : '语法', type: scope.row.textbookType === 0 ? 'primary' : 'success' }" />
          </template>
        </el-table-column>
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
          label="操作"
          width="150"
          fixed="right"
        >
          <template slot-scope="scope">
            <el-button
              :type="scope.row.offlineSchoolId !== null ? 'danger' : 'primary'"
              :size="$style.tableButtonSize"
              @click="handlerGrant(scope.row)"
            >{{ scope.row.offlineSchoolId !== null ? '取消授权' : '分配授权' }}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import tableMixins from '../../mixins/table-mixins'
import textBookMixins from '../../mixins/text-book-mixins'
export default {
  name: 'GrantTextBookToOffLineSchool',
  mixins: [tableMixins, textBookMixins],
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      this.$http({
        url: this.$urlPath.queryTextBookOfflineSchool,
        methods: this.HTTP_GET,
        data: {
          schoolId: this.$route.params.schoolId
        }
      }).then(res => {
        this.loading = false
        this.tableData = res.obj
        if (this.tableData && this.tableData.length > 0) {
          const hasGrantItems = this.tableData.filter(it => it.offlineSchoolId !== null)
          if (hasGrantItems.length > 0) {
            this.$nextTick(_ => {
              hasGrantItems.forEach(it => {
                this.$refs.multiTable.toggleRowSelection(it, true)
              })
            })
          }
        }
      })
    },
    grantToSchool() {
      if (this.canHandlerItems()) {
        this.confirmHandlerMultiItems('确定要把教材授权分配到该学校上吗？', 'textbookId', ids => {
          this.$http({
            url: this.$urlPath.grantTextBooksToSchool,
            data: {
              schoolId: this.$route.params.schoolId,
              textbookIds: ids
            }
          }).then(res => {
            this.$successMsg('教材分配成功')
            this.$closeCurrentView()
          })
        })
      }
    },
    handlerGrant(item) {
      if (item.offlineSchoolId === null) {
        this.$warningConfirm('确定要把教材授权分配到该学校上吗？', _ => {
          this.$showLoading(closeLoading => {
            const hasGrantItems = this.tableData.filter(it => it.offlineSchoolId !== null || it.textbookId === item.textbookId)
            this.$http({
              url: this.$urlPath.grantTextBooksToSchool,
              data: {
                schoolId: this.$route.params.schoolId,
                textbookIds: hasGrantItems.map(it => it.textbookId).join(',')
              }
            }).then(res => {
              this.$successMsg('教材分配成功')
              this.getData()
              closeLoading()
            }).catch(_ => {
              closeLoading()
            })
          })
        })
      } else {
        this.$warningConfirm('确定要把此教材取消授权该学校吗？', _ => {
          this.$showLoading(closeLoading => {
            const hasGrantItems = this.tableData.filter(it => it.offlineSchoolId !== null)
            hasGrantItems.splice(hasGrantItems.indexOf(item), 1)
            this.$http({
              url: this.$urlPath.grantTextBooksToSchool,
              data: {
                schoolId: this.$route.params.schoolId,
                textbookIds: hasGrantItems.map(it => it.textbookId).join(',')
              }
            }).then(res => {
              this.$successMsg('教材已取消授权到该学校')
              this.getData()
              closeLoading()
            }).catch(_ => {
              closeLoading()
            })
          })
        })
      }
    }
  }
}
</script>
