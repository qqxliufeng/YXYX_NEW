<template>
  <div class="container">
    <table-header
      :title="'当前学习卡编码：' + $route.params.studyCardCode"
      :show-delete="false"
      :show-add="false"
    >
      <!-- <template slot="other">
        <el-button
          type="primary"
          size="mini"
          @click="grantAllTextBook"
        >批量授权</el-button>
      </template> -->
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
        @expand-change="expandChange"
      >
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-table
              ref="multiTable"
              v-loading="scope.row.loading"
              :stripe="tableConfig.stripe"
              :header-cell-style="tableConfig.headerCellStyle"
              :data="scope.row.textBookList"
              :border="tableConfig.border"
              :size="tableConfig.size"
              :default-sort="tableConfig.defalutSort"
              :style="tableConfig.style"
            >
              <el-table-column
                align="center"
                label="序号"
                width="80"
              >
                <template slot-scope="innerScope">
                  {{ innerScope.$index + 1 }}
                </template>
              </el-table-column>
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
                prop="coverUrl"
                label="封面"
              >
                <template slot-scope="innerScope">
                  <a
                    target="_blank"
                    :href="baseImageIp + innerScope.row.coverUrl"
                  >
                    <el-image
                      style="width: 40px; "
                      :src="baseImageIp + innerScope.row.coverUrl"
                    />
                  </a>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                label="操作"
                width="120"
              >
                <template slot-scope="innerScope">
                  <el-button
                    :type="innerScope.row.studyCardCreateId === null ? 'primary' : 'danger'"
                    :size="$style.tableButtonSize"
                    @click="grantToCard(innerScope.row, scope.row)"
                  >{{ innerScope.row.studyCardCreateId === null ? '授权' : '取消授权' }}</el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="序号"
          width="80"
        >
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          prop="textbookVersion"
          label="版本名称"
        />
      </el-table>
    </el-card>
  </div>
</template>

<script>
import TableMixins from '../../mixins/table-mixins'
import { baseImageIp } from '@/api/url-path'
export default {
  name: 'TextBookList',
  mixins: [TableMixins],
  data() {
    return {
      baseImageIp
    }
  },
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
    grantToCard(item, parentItem) {
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
          this.loadTextBook(parentItem)
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
    async getData() {
      const res = await this.$http({
        url: this.$urlPath.queryAllTextBookVersion,
        methods: this.HTTP_GET
      })
      this.loading = false
      this.tableData = res.obj
      this.tableData && this.tableData.forEach(it => {
        this.$set(it, 'textBookList', [])
        this.$set(it, 'loading', false)
      })
    },
    expandChange(row, expandedRows) {
      if (row.textBookList.length === 0) {
        this.loadTextBook(row)
      }
    },
    async loadTextBook(row) {
      row.loading = true
      const res = await this.$http({
        url: this.$urlPath.queryAllTextBookAndStudyCard,
        methods: this.HTTP_GET,
        data: {
          studyCardId: this.$route.params.studyCardId,
          textbookVersion: row.textbookVersion
        }
      })
      row.textBookList = res.obj
      row.textBookList && row.textBookList.forEach(it => {
        it.coverUrl = it.coverUrl.replace('/opt/nginx/yxvue/dist', '')
      })
      row.loading = false
    }
  }
}
</script>

