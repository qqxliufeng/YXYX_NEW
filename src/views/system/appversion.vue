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
        <el-table-column
          align="center"
          label="序号"
        >
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="terminalType"
          label="终端类型"
        />
        <el-table-column
          align="center"
          prop="versionNo"
          label="版本名称"
        />
        <el-table-column
          align="center"
          label="强制升级"
        >
          <template slot-scope="scope">
            <table-status :status="{label: scope.row.isUpgrade === 1 ? '是' : '否', type: scope.row.isUpgrade === 1 ? 'primary' : 'danger'}" />
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="status"
          label="上架状态"
        >
          <template slot-scope="scope">
            <table-status :status="{label: scope.row.versionStatus === 0 ? '未上架' : '已上架', type: scope.row.versionStatus === 0 ? 'danger' : 'primary'}" />
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="createTime"
          label="创建时间"
          width="160"
        >
          <template slot-scope="scope">
            {{ scope.row.createTime | parseTime }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="操作"
        >
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.versionStatus === 0"
              type="primary"
              :size="$style.tableButtonSize"
              @click="upApp(scope.row)"
            >上架</el-button>
            <el-button
              v-else
              type="danger"
              :size="$style.tableButtonSize"
              @click="downApp(scope.row)"
            >下架</el-button>
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
    <el-dialog
      title="添加新的版本"
      :visible.sync="dialogFormVisible"
      top="10vh"
    >
      <el-form
        ref="dataForm"
        class="dialog-container"
      >
        <el-form-item label="终端类型">
          <el-col :span="$style.dialogColSpan">
            <el-select
              v-model="appVersionModel.terminalType"
              style="width: 100%"
              class="filter-item"
              placeholder="请选择终端类型"
            >
              <el-option
                v-for="item of formModelArray[0].selectOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="版本名称">
          <el-col :span="$style.dialogColSpan">
            <el-input
              v-model="appVersionModel.versionNo"
              placeholder="请输入版本名称（必填），如：1.0.1"
            />
          </el-col>
        </el-form-item>
        <el-form-item
          label="立即上架"
          prop="status"
        >
          <el-col :span="$style.dialogColSpan">
            <el-radio-group v-model="appVersionModel.versionStatus">
              <el-radio :label="0">否</el-radio>
              <el-radio :label="1">是</el-radio>
            </el-radio-group>
          </el-col>
        </el-form-item>
        <el-form-item
          label="强制升级"
          prop="status"
        >
          <el-col :span="$style.dialogColSpan">
            <el-radio-group v-model="appVersionModel.isUpgrade">
              <el-radio :label="0">否</el-radio>
              <el-radio :label="1">是</el-radio>
            </el-radio-group>
          </el-col>
        </el-form-item>
        <el-form-item
          label="升级内容"
          prop="status"
        >
          <el-col :span="$style.dialogColSpan">
            <el-input
              v-model="appVersionModel.upgradePoint"
              type="textarea"
              :rows="3"
              placeholder="请输入升级内容（非必填）"
              maxlength="100"
              style="width: 100%"
              show-word-limit
            />
          </el-col>
        </el-form-item>
        <el-form-item
          label="上传文件"
          prop="status"
        >
          <el-col :span="$style.dialogColSpan">
            <el-upload
              class="upload-demo"
              drag
              :action="uploadZipUrl"
              name="appVersionFile"
              :headers="headers"
              :on-success="onUploadSuccess"
            >
              <i class="el-icon-upload" />
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            </el-upload>
          </el-col>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          :size="$style.dialogButtonSize"
          @click="dialogFormVisible = false"
        >取消</el-button>
        <el-button
          :size="$style.dialogButtonSize"
          type="primary"
          @click="handleDialogConfirm"
        >确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import tableMixins from '../../mixins/table-mixins'
import { baseIp } from '../../api/url-path'
import { getToken } from '../../utils/auth'
export default {
  name: 'AppVersion',
  mixins: [tableMixins],
  data() {
    return {
      formModelArray: [
        {
          id: 1,
          value: '',
          label: '终端类型',
          name: 'terminalType',
          span: 5,
          type: 'select',
          selectOptions: [
            {
              label: 'android',
              value: 'android'
            },
            {
              label: 'iOS',
              value: 'iOS'
            }
          ]
        }
      ],
      appVersionModel: {
        terminalType: '', // 终端类型
        versionNo: '', // 版本号
        terminalUrl: '', // 版本下载地址
        isUpgrade: 1, // 是否强制升级
        versionStatus: 0, // 发布状态 0未上架 1已上架
        upgradePoint: '' // 升级提示
      },
      dialogFormVisible: false,
      uploadZipUrl: baseIp + this.$urlPath.uploadAppVersionFile,
      headers: {
        'Authorization': `Bearer ${getToken()}`
      }
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    initData() {
      this.likeSearchUrl = this.$urlPath.queryAppVersionListLike
    },
    getData() {
      this.$http({
        url: this.$urlPath.queryAppVersionList,
        methods: this.HTTP_GET,
        data: {
          pageNum: this.page,
          pageSize: this.pageSize
        }
      }).then(res => {
        this.onSuccess(res.obj)
      })
    },
    onAdd() {
      this.dialogFormVisible = true
      this.appVersionModel = {
        terminalType: 'android', // 终端类型
        versionNo: '', // 版本号
        terminalUrl: '', // 版本下载地址
        isUpgrade: 1, // 是否强制升级
        versionStatus: 0, // 发布状态 0未上架 1已上架
        upgradePoint: '' // 升级提示
      }
    },
    handleDialogConfirm() {
      if (!this.appVersionModel.terminalType) {
        this.$errorMsg('请选择终端类型')
        return
      }
      if (!this.appVersionModel.versionNo) {
        this.$errorMsg('请输入版本名称')
        return
      }
      if (!this.appVersionModel.terminalUrl) {
        this.$errorMsg('请上传升级包')
        return
      }
      this.$showLoading(closeLoading => {
        this.$http({
          url: this.$urlPath.saveAppVersion,
          data: this.appVersionModel
        }).then(res => {
          this.dialogFormVisible = false
          closeLoading()
          this.getData()
        }).catch(_ => {
          this.dialogFormVisible = false
          closeLoading()
        })
      })
    },
    onUploadSuccess(response) {
      if (response.status === 200) {
        this.appVersionModel.terminalUrl = response.obj
      }
    },
    upApp(item) {
      this.$warningConfirm('是否要上架此版本？', _ => {
        this.$http({
          url: this.$urlPath.sendAppVersion,
          data: {
            versionId: item.versionId
          }
        }).then(res => {
          this.$successMsg('上架成功')
          this.getData()
        })
      })
    },
    downApp(item) {
      this.$warningConfirm('是否要下架此版本？', _ => {
        this.$http({
          url: this.$urlPath.upAppVersion,
          data: {
            versionId: item.versionId
          }
        }).then(res => {
          this.$successMsg('下架成功')
          this.getData()
        })
      })
    }
  }
}
</script>
