<template>
  <div class="container">
    <table-header
      ref="tableHeader"
      :form-model-array="formModelArray"
      :show-add="true"
      :show-delete="false"
      :show-search="true"
      @onadd="onAdd"
      @onsearch="onSearch"
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
          label="学校名称"
          prop="schoolName"
          width="120"
          fixed="left"
        />
        <el-table-column
          align="center"
          label="账号"
          prop="schoolTel"
          min-width="120"
          fixed="left"
        />
        <el-table-column
          align="center"
          label="在线状态"
          prop="schoolTel"
          min-width="120"
        >
          <template slot-scope="scope">
            <div>
              <el-link
                v-if="scope.row.isOnLine === 0"
                :underline="false"
                type="warning"
              >线下</el-link>
              <el-link
                v-else
                :underline="false"
                type="primary"
              >线上</el-link>
            </div>
            <div v-if="scope.row.isOnLine === 0">
              <el-tooltip
                class="item"
                effect="dark"
                content="线下的学校可以进行分配学习教材"
                placement="right"
              >
                <el-link
                  style="font-size: 10px"
                  size="mini"
                  type="danger"
                  @click.native="grantToOffSchool(scope.row)"
                >分配教材</el-link>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="管理员"
        >
          <template slot-scope="scope">{{
            scope.row.schoolLeaderName | emptyFormat
          }}</template>
        </el-table-column>
        <el-table-column
          align="center"
          label="联系方式"
          prop="schoolTel"
          min-width="120"
        />
        <el-table-column
          align="center"
          label="地区"
          min-width="150"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="text-cut">{{
              scope.row.province + "/" + scope.row.city + "/" + scope.row.area
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="详细地址"
          width="200"
          prop="addressDetail"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="text-cut">{{ getAddressInfo(scope.row) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="创建时间"
          prop="createTime"
          min-width="180"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <div class="text-cut">
              {{ scope.row.createTime | parseTime }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="到期时间"
          min-width="180"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <div class="text-cut">{{ scope.row.endTime | parseTime }}</div>
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
          min-width="250"
        >
          <template slot-scope="scope">
            <el-button
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
              :size="$style.tableButtonSize"
              type="primary"
              @click="editAccountInfo(scope.row)"
            >编辑</el-button>
            <el-dropdown
              style="display: inline-block; margin-left: 10px"
              :size="$style.tableButtonSize"
              type="success"
              split-button
              @command="handleSchoolCommand"
            >
              更多
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :command="{ tag: 1, item: scope.row }">已分配的学习卡</el-dropdown-item>
                <el-dropdown-item :command="{ tag: 2, item: scope.row }">未分配的学习卡</el-dropdown-item>
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
    <!-- 增加服务记录对话框 -->
    <el-dialog
      title="添加服务内容"
      :visible.sync="dialogAddRecordVisible"
      width="80%"
    >
      <el-form class="dialog-container">
        <el-form-item>
          <tinymce
            v-model="recordModel.record"
            :show-upload-image="false"
            :height="300"
          />
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          :size="$style.dialogButtonSize"
          type="primary"
          @click="addRecordItem"
        >添加</el-button>
      </div>
    </el-dialog>
    <!-- 增加服务记录对话框 -->
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import TableMixins from '../../mixins/table-mixins'
export default {
  name: 'VIPShcool',
  components: {
    Tinymce
  },
  mixins: [TableMixins],
  data() {
    return {
      formModelArray: [
        {
          id: 1,
          value: '',
          label: '学校名称',
          name: 'schoolName',
          span: 5,
          type: 'input'
        },
        {
          id: 2,
          value: '',
          label: '负责人姓名',
          name: 'schoolLeaderName',
          span: 5,
          type: 'input'
        },
        {
          id: 3,
          value: '',
          label: '负责人联系方式',
          name: 'schoolTel',
          span: 5,
          type: 'input'
        },
        {
          id: 4,
          value: '',
          label: '经营地址',
          name: 'addressDetail',
          span: 5,
          type: 'input'
        },
        {
          id: 5,
          value: [],
          label: '省 /市/区',
          name: ['province', 'city', 'area'],
          span: 5,
          type: 'address'
        }
      ],
      dialogAddRecordVisible: false,
      recordModel: {
        schoolId: '',
        record: ''
      }
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    initData() {
      this.likeSearchUrl = this.$urlPath.querySchoolListLike
    },
    getAddressInfo(item) {
      if (item.addressDetailList && item.addressDetailList.length > 0) {
        return item.addressDetailList.map(it => it.address).join(',')
      }
      return '暂无详细地址'
    },
    statusFormat(item) {
      if (parseInt(item.status) === 0) {
        return { label: '正常', type: 'primary' }
      }
      if (parseInt(item.status) === 1) {
        return { label: '禁用', type: 'danger' }
      }
      return { label: '未知', type: 'warning' }
    },
    onAdd() {
      if (!this.checkButtonPermission('add')) {
        return
      }
      this.$router.push({ name: 'AddSchool' })
    },
    getData() {
      this.$http({
        url: this.$urlPath.querySchoolList,
        methods: this.HTTP_GET,
        data: {
          pageNum: this.page,
          pageSize: this.pageSize
        }
      }).then(res => {
        this.onSuccess(res.obj)
      })
    },
    editAccountInfo(item) {
      if (!this.checkButtonPermission('edit')) {
        return
      }
      this.$router.push({
        name: 'EditSchool',
        params: { schoolId: item.schoolId }
      })
    },
    handleSchoolCommand({ tag, item }) {
      switch (tag) {
        case 1:
          if (!this.checkButtonPermission('grant_card_list')) {
            return
          }
          this.$router.push({
            name: 'SchoolStudyCardList',
            params: {
              schoolId: item.schoolId,
              schoolName: item.schoolName,
              type: 1
            }
          })
          break
        case 2:
          if (!this.checkButtonPermission('un_card_list')) {
            return
          }
          this.$router.push({
            name: 'SchoolStudyCardList',
            params: {
              schoolId: item.schoolId,
              schoolName: item.schoolName,
              type: 0
            }
          })
          break
        case 3:
          if (!this.checkButtonPermission('search_record')) {
            return
          }
          this.$router.push({
            name: 'SchoolRecordList',
            params: {
              schoolId: item.schoolId
            }
          })
          break
        case 4:
          if (!this.checkButtonPermission('add_record')) {
            return
          }
          this.recordModel.schoolId = item.schoolId
          this.dialogAddRecordVisible = true
          break
      }
    },
    addRecordItem() {
      if (!this.recordModel.record) {
        this.$errorMsg('请输入服务内容')
        return
      }
      this.dialogAddRecordVisible = false
      this.$http({
        url: this.$urlPath.addSchoolRecord,
        data: this.recordModel
      }).then(res => {
        this.$successMsg('服务添加成功')
      })
    },
    grantToOffSchool(item) {
      if (!this.checkButtonPermission('dis_off_mat')) {
        return
      }
      this.$router.push({
        name: 'GrantTextBookToOffLineSchool',
        params: { schoolId: item.schoolId }
      })
    }
  }
}
</script>

<style></style>
