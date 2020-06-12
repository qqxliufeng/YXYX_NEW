<!--
 * @Descripttion: 描述
 * @version: 版本
 * @Author: lf
 * @Date: 2020-06-08 14:35:29
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-06-12 19:04:17
-->
<template>
  <div class="container" style="padding: 0">
    <table-header
      :form-model-array="formModelArray"
      :show-add="true"
      :show-delete="false"
      :show-search="true"
      @onsearch="onSearch"
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
        <!-- addressDetail: "小河南街子书堂读书馆绘本馆"
        addressDetailList: null
        area: "灵石县"
        city: "晋中"
        createId: 1
        createTime: 1584084541000
        dr: 0
        endTime: 1623254400000
        isOnLine: 0
        note: null
        province: "山西"
        salesId: 1
        schoolId: 1
        schoolLeaderId: 1
        schoolLeaderName: null
        schoolName: "子书堂"
        schoolTel: "	18935447667"
        schoolType: 0
        status: 0
        superviseId: 1
        updateId: null
        updateTime: null-->
        <el-table-column align="center" label="学校名称" prop="schoolName" />
        <el-table-column align="center" label="账号" prop="schoolTel" />
        <el-table-column align="center" label="管理员">
          <template slot-scope="scope">{{ scope.row.schoolLeaderName | emptyFormat }}</template>
        </el-table-column>
        <el-table-column align="center" label="联系方式" prop="schoolTel" />
        <el-table-column align="center" label="地区" show-overflow-tooltip>
          <template slot-scope="scope">
            <span
              class="text-cut"
            >{{ scope.row.province + '/' + scope.row.city + '/' + scope.row.area }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="详细地址" prop="addressDetail" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="text-cut">{{ scope.row.addressDetail }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="创建时间" prop="createTime">
          <template slot-scope="scope">{{ scope.row.createTime | parseTime }}</template>
        </el-table-column>
        <el-table-column align="center" label="到期时间">
          <template slot-scope="scope">{{ scope.row.endTime | parseTime }}</template>
        </el-table-column>
        <el-table-column align="center" label="状态" prop="status" :formatter="statusFormat" />
        <el-table-column align="center" label="操作" fixed="right" min-width="150">
          <template slot-scope="scope">
            <el-button
              :size="$style.tableButtonSize"
              type="danger"
              @click="changeAccountStatus(scope.row)"
            >{{ scope.row.status === 0 ? '禁用' : '正常' }}</el-button>
            <el-button
              :size="$style.tableButtonSize"
              type="primary"
              @click="editAccountInfo(scope.row)"
            >编辑</el-button>
            <el-dropdown
              style="margin-left: 10px"
              :size="$style.tableButtonSize"
              type="success"
              split-button
              @command="handleSchoolCommand"
            >
              更多操作
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :command="{tag: 1, item: scope.row}">已分配的学习卡</el-dropdown-item>
                <el-dropdown-item :command="{tag: 2, item: scope.row}">未分配的学习卡</el-dropdown-item>
                <el-dropdown-item :command="{tag: 3, item: scope.row}">查询服务记录</el-dropdown-item>
                <el-dropdown-item :command="{tag: 4, item: scope.row}">增加服务记录</el-dropdown-item>
                <el-dropdown-item :command="{tag: 5, item: scope.row}">查看学校详情</el-dropdown-item>
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
    <el-dialog title="添加服务记录" :visible.sync="dialogAddRecordVisible">
      <el-form label-position="left" label-width="120px" style="width: 90%; ">
        <el-form-item label="服务内容">
          <el-col :span="24">
            <el-input
              style="width: 100%"
              v-model="recordModel.content"
              type="textarea"
              :rows="5"
              maxlength="200"
              placeholder="请输入服务内容"
              show-word-limit
            ></el-input>
          </el-col>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :size="$style.dialogButtonSize" @click="addRecordItem" type="primary">添加</el-button>
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
          label: '省/市/区',
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
    statusFormat(item) {
      if (parseInt(item.status) === 0) {
        return '正常'
      }
      if (parseInt(item.status) === 1) {
        return '禁用'
      }
      return '未知'
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
    onSearch() {
      this.loading = true
      const form = this.generatorFormObj(this.formModelArray)
      this.$http({
        url: this.$urlPath.querySchoolListLike,
        methods: this.HTTP_GET,
        data: form
      }).then(res => {
        this.onSuccess(res.obj)
      })
    },
    changeAccountStatus(item) {
      if (item.status === 0) {
        this.$warningConfirm('是否要禁用此账号？', () => {
          this.$http({
            url: this.$urlPath.lockSchool,
            methods: this.HTTP_POST,
            data: {
              schoolId: item.schoolId
            }
          }).then(res => {
            this.$successMsg(res.msg)
            item.status = 1
          })
        })
      } else {
        this.$warningConfirm('是否要解封此账号？', () => {
          this.$http({
            url: this.$urlPath.unLockSchool,
            methods: this.HTTP_POST,
            data: {
              schoolId: item.schoolId
            }
          }).then(res => {
            this.$successMsg(res.msg)
            item.status = 0
          })
        })
      }
    },
    editAccountInfo(item) {
      this.$router.push({
        name: 'VipSchoolInfo',
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
        case 5:
          this.$http({
            url: this.$urlPath.querySchoolBySchoolId,
            methods: this.HTTP_GET,
            data: {
              schoolId: item.schoolId
            }
          }).then(res => {
            console.log(res)
          })
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
