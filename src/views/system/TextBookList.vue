<template>
  <div class="container">
    <table-header
      :title="'当前学习卡编码：' + $route.params.studyCardCode"
      :show-delete="false"
      :show-add="false"
    >
      <template slot="other">
        <el-button
          type="primary"
          size="mini"
          @click="grantAllTextBook"
        >批量授权</el-button>
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
        :style="tableConfig.style"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          align="center"
          type="selection"
          width="55"
        />
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
          prop="studyCardCreateId"
          label="授权状态"
          :formatter="grantStatusFormatter"
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
          width="180"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span>{{ scope.row.createTime | parseTime }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="操作"
          width="120"
        >
          <template slot-scope="scope">
            <el-button
              :type="scope.row.studyCardCreateId === null ? 'primary' : 'danger'"
              :size="$style.tableButtonSize"
              @click="grantToCard(scope.row)"
            >{{ scope.row.studyCardCreateId === null ? '授权' : '取消授权' }}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import TableMixins from '../../mixins/table-mixins'
export default {
  name: 'TextBookList',
  mixins: [TableMixins],
  mounted() {
    this.getData()
  },
  methods: {
    grantStatusFormatter(item) {
      return item.studyCardCreateId === null ? '未授权' : '已授权'
    },
    /**
     * 取消或者授权教材
     */
    grantToCard(item) {
      this.$warningConfirm(item.studyCardCreateId === null ? '是否要授权此教材到此学习卡上吗？' : '是否要取消授权此教材吗？', _ => {
        const ids = this.tableData.filter(it => it.studyCardCreateId !== null).map(it => it.textbookId)
        if (item.studyCardCreateId === null) {
          ids.push(item.textbookId)
        } else {
          ids.splice(ids.indexOf(item.textbookId), 1)
        }
        this.$http({
          url: this.$urlPath.studyCardAssignedTextBook,
          data: {
            studyCardId: this.$route.params.studyCardId,
            cardCode: this.$route.params.studyCardCode,
            cardErcode: this.$route.params.studyCardErcode,
            textbookIds: ids.join(','),
            roleCode: this.$roles.roleCode
          }
        }).then(res => {
          this.$successMsg('操作成功')
          this.getData()
        })
      })
    },
    grantAllTextBook() {
      this.confirmHandlerMultiItems('确定要授权或者取消这些教材到此学习卡上吗？', 'textbookId', ids => {
        this.$http({
          url: this.$urlPath.studyCardAssignedTextBook,
          data: {
            studyCardId: this.$route.params.studyCardId,
            cardCode: this.$route.params.studyCardCode,
            cardErcode: this.$route.params.studyCardErcode,
            textbookIds: ids,
            roleCode: this.$roles.roleCode
          }
        }).then(res => {
          this.$successMsg('操作成功')
          this.getData()
        })
      })
    },
    getData() {
      this.$http({
        url: this.$urlPath.queryAllTextBookAndStudyCard,
        methods: this.HTTP_GET,
        data: {
          studyCardId: this.$route.params.studyCardId
        }
      }).then(res => {
        this.loading = false
        this.tableData = res.obj
        if (this.tableData && this.tableData.length > 0) {
          this.$nextTick(_ => {
            this.tableData.forEach(it => {
              if (it.studyCardCreateId !== null) {
                this.$refs.multiTable.toggleRowSelection(it)
              }
            })
          })
        }
      })
    }
  }
}
</script>

