<!--
 * @Descripttion: 描述
 * @version: 版本
 * @Author: lf
 * @Date: 2020-06-08 14:35:29
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-06-13 17:17:31
-->
<template>
  <div
    class="container"
    style="padding: 0"
  >
    <table-header
      :form-model-array="formModelArray"
      :show-add="true"
      :show-delete="false"
      :show-search="true"
      @onadd="onAdd"
      @onsearch="onSearch($urlPath.querySchoolListLike)"
    />
    <el-card :body-style="{padding: '2px'}">
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
          label="管理员"
        >
          <template slot-scope="scope">{{ scope.row.schoolLeaderName | emptyFormat }}</template>
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
            <span class="text-cut">{{ scope.row.province + '/' + scope.row.city + '/' + scope.row.area }}</span>
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
          :formatter="statusFormat"
        />
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
              @click="changeLockStatus({item: scope.row, statusField: 'status', data: { schoolId: scope.row.schoolId }, lockUrl: $urlPath.lockSchool, unLockUrl: $urlPath.unLockSchool})"
            >{{ scope.row.status === 0 ? '禁用' : '解锁' }}</el-button>
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
                <el-dropdown-item :command="{tag: 1, item: scope.row}">已分配的学习卡</el-dropdown-item>
                <el-dropdown-item :command="{tag: 2, item: scope.row}">未分配的学习卡</el-dropdown-item>
                <el-dropdown-item :command="{tag: 3, item: scope.row}">查询服务记录</el-dropdown-item>
                <el-dropdown-item :command="{tag: 4, item: scope.row}">增加服务记录</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <table-foot
      :total="total"
      :page-size="pageSize"
      @prev-click="prevClick"
      @next-click="nextClick"
      @current-change="currentChange"
      @refresh="reloadData"
    />
    <!-- 增加服务记录对话框 -->
    <el-dialog
      title="添加服务记录"
      :visible.sync="dialogAddRecordVisible"
    >
      <el-form
        label-position="left"
        label-width="120px"
        style="width: 90%; "
      >
        <el-form-item label="服务内容">
          <el-col :span="24">
            <el-input
              v-model="recordModel.content"
              style="width: 100%"
              type="textarea"
              :rows="5"
              maxlength="200"
              placeholder="请输入服务内容"
              show-word-limit
            />
          </el-col>
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
import TableMixins from '../../mixins/table-mixins'
export default {
  name: 'VIPShcool',
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
        content: ''
      }
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    getAddressInfo(item) {
      if (item.addressDetailList && item.addressDetailList.length > 0) {
        return item.addressDetailList.map(it => it.address).join(',')
      }
      return '暂无详细地址'
    },
    statusFormat(item) {
      if (parseInt(item.status) === 0) {
        return '正常'
      }
      if (parseInt(item.status) === 1) {
        return '禁用'
      }
      return '未知'
    },
    onAdd() {
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
      this.$router.push({
        name: 'EditSchool',
        params: { schoolId: item.schoolId }
      })
    },
    handleSchoolCommand({ tag, item }) {
      switch (tag) {
        case 1:
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
          this.$http({
            url: this.$urlPath.querySchoolRecordList,
            methods: this.HTTP_GET,
            data: {
              schoolId: item.schoolId,
              pageNum: 0,
              pageSize: 10
            }
          }).then(res => {
            console.log(res)
          })
          break
        case 4:
          this.recordModel.schoolId = item.schoolId
          this.dialogAddRecordVisible = true
          break
      }
    },
    addRecordItem() {
      if (!this.recordModel.content) {
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
    }
  }
}
</script>

<style>
</style>
