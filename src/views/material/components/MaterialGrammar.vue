<template>
  <div id="content-wrapper">
    <table-header
      ref="tableHeader"
      title="查询内容"
      :form-model-array="formModelArray"
      :show-delete="false"
      :show-add="isSuperAdmin"
      :show-search="true"
      :can-collapse="true"
      @onsearch="onSearch"
      @onadd="onAdd"
      @table-header-collapse="onCollapsed"
    >
      <template slot="other">
        <el-button
          v-if="isSuperAdmin"
          type="danger"
          size="mini"
          @click="downExcel"
        >下载Excel模板</el-button>
      </template>
    </table-header>
    <el-card
      ref="tableContainer"
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
        :height="tableConfig.style.myHeight"
      >
        <el-table-column
          align="center"
          label="序号"
          fixed="left"
        >
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="textbookName"
          label="教材名称"
          fixed="left"
          width="150"
        />
        <el-table-column
          align="center"
          label="体验教材"
        >
          <template slot-scope="scope">
            <table-status :status="{ label: scope.row.isExper === 1 ? '是' : '否', type: scope.row.isExper === 1 ? 'danger' : 'primary'}" />
          </template>
        </el-table-column>
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
          v-if="isSuperAdmin"
          align="center"
          prop="createTime"
          label="创建时间"
          width="160"
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
          label="操作"
          :width="isSuperAdmin ? 250 : 120"
          fixed="right"
        >
          <template slot-scope="scope">
            <el-button
              v-if="isSuperAdmin"
              type="primary"
              :size="$style.tableButtonSize"
              @click="handlerUpdate(scope.row)"
            >编辑</el-button>
            <el-button
              v-if="isSuperAdmin"
              type="danger"
              :size="$style.tableButtonSize"
              @click="deleteItem(scope.row)"
            >删除</el-button>
            <el-dropdown
              v-if="isSuperAdmin"
              style="display: inline-block; margin-left: 10px"
              :size="$style.tableButtonSize"
              type="success"
              split-button
              @command="handleMaterialCommand"
            >
              更多
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :command="{tag: 1, item: scope.row}">查看已授权的学校</el-dropdown-item>
                <el-dropdown-item :command="{tag: 2, item: scope.row}">生成/编辑教材</el-dropdown-item>
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
    <!-- 增加教材对话框 -->
    <el-dialog
      :title="mode === 'add' ? '添加教材' : '编辑教材信息'"
      :visible.sync="dialogFormVisible"
      top="5vh"
    >
      <el-form class="dialog-container">
        <el-form-item label="教材名称">
          <el-col :span="$style.dialogColSpan">
            <el-input
              v-model="materialModel.textbookName"
              placeholder="请输入教材名称"
            />
          </el-col>
        </el-form-item>
        <el-form-item label="教材类型">
          <el-col :span="$style.dialogColSpan">
            <el-select
              v-model="materialModel.textbookType"
              style="width: 100%"
              placeholder="请选择教材类型"
            >
              <el-option
                label="语法"
                :value="1"
              />
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="教材类别">
          <el-col :span="$style.dialogColSpan">
            <el-select
              v-model="materialModel.textbookCategory"
              style="width: 100%"
              placeholder="请选择教材类型"
            >
              <el-option
                v-for="item of textbookCategorys"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="教材版本">
          <el-col :span="$style.dialogColSpan">
            <el-select
              v-model="materialModel.textbookVersion"
              style="width: 100%"
              placeholder="请选择教材版本"
            >
              <el-option
                v-for="item of textbookVersion"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="是否体验">
          <el-col :span="$style.dialogColSpan">
            <el-radio-group v-model="materialModel.isExper">
              <el-radio :label="0">否</el-radio>
              <el-radio :label="1">是</el-radio>
            </el-radio-group>
          </el-col>
        </el-form-item>
        <el-form-item label="用户开放">
          <el-col :span="$style.dialogColSpan">
            <el-radio-group v-model="materialModel.isOpenUser">
              <el-radio :label="0">开放</el-radio>
              <el-radio :label="1">不开放</el-radio>
            </el-radio-group>
          </el-col>
        </el-form-item>
        <el-form-item label="有无视频">
          <el-col :span="$style.dialogColSpan">
            <el-radio-group v-model="materialModel.isHasVideo">
              <el-radio :label="0">有</el-radio>
              <el-radio :label="1">没有</el-radio>
            </el-radio-group>
          </el-col>
        </el-form-item>
        <el-form-item label="教材封面">
          <el-col :span="$style.dialogColSpan">
            <el-upload
              class="avatar-uploader"
              :action="uploadCoverUrl"
              list-type="picture-card"
              :headers="headers"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
              :on-remove="handleRemove"
              :limit="1"
              :file-list="fileList"
              :on-exceed="handlerExceed"
              name="textBookCoverFile"
            >
              <i
                slot="default"
                class="el-icon-plus avatar-uploader-icon"
              />
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
          @click="handlerFormConfirm"
        >确定</el-button>
      </div>
    </el-dialog>
    <!-- 增加教材对话框 -->
    <!-- 查看教材授权的学校对话框 -->
    <el-dialog
      title="授权学校列表"
      :visible.sync="dialogGrantSchoolVisible"
      top="10vh"
    >
      <div class="dialog-container">
        <el-table
          v-loading="grantSchoolLoading"
          :stripe="tableConfig.stripe"
          :header-cell-style="tableConfig.headerCellStyle"
          :data="grantSchoolTableData"
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
        </el-table>
      </div>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          :size="$style.dialogButtonSize"
          @click="dialogGrantSchoolVisible = false"
        >知道了</el-button>
      </div>
    </el-dialog>
    <!-- 查看教材授权的学校对话框 -->
  </div>
</template>

<script>
import tableMixins from '@/mixins/table-mixins'
import { blobToExecl } from '@/api/common'
import textBookMixins from '@/mixins/text-book-mixins'
import userMixins from '@/mixins/user-mixins'
import { getToken } from '@/utils/auth'
import { baseIp } from '@/api/url-path'
import { getImagePath } from '@/filters'
const textbookCategorys = [
  {
    label: '中考',
    value: 0
  },
  {
    label: '小升初',
    value: 1
  }
]
const textbookVersion = [
  {
    label: '综合版',
    value: '综合版'
  }
]
export default {
  name: 'MaterialGrammar',
  mixins: [tableMixins, textBookMixins, userMixins],
  data() {
    return {
      textbookCategorys,
      textbookVersion,
      formModelArray: [
        {
          id: 1,
          value: '',
          label: '教材名称',
          name: 'textbookName',
          span: 5,
          type: 'input'
        },
        {
          id: 3,
          value: '',
          label: '教材类别',
          name: 'textbookCategory',
          span: 5,
          type: 'select',
          selectOptions: textbookCategorys
        },
        {
          id: 4,
          value: '',
          label: '教材版本',
          name: 'textbookVersion',
          span: 5,
          type: 'select',
          selectOptions: textbookVersion
        }
      ],
      materialModel: {
        textbookName: '', // 教材名称
        unLockCoins: 0, // 解锁所需优钻
        textbookType: 1, // 教材类型 0词汇 1语法 2体验 3自然拼读
        textbookCategory: 0, // 教材类别 0YouCan 1拳心同步 2智能英语
        textbookVersion: '综合版', // 教材版本主键ID
        isOpenUser: 0, // 是否对用户开放 0是 1否 否：可以为学校授权，也可以不授权  如果授权，需要传学校主键ID到后台
        isExper: 0, // 是否体验版 0 否 1是
        schoolIds: '', // 学校主键ID，多个学校则主键用逗号隔开即可，如：1,2,3,4
        isHasVideo: 0, // 是否有视频 0是 1否
        coverUrl: '' // 教材封面
      },
      mode: 'add',
      dialogFormVisible: false,
      dialogGrantSchoolVisible: false,
      grantSchoolLoading: false,
      grantSchoolTableData: [],
      uploadCoverUrl: baseIp + this.$urlPath.uploadGrammarTextBookCoverImage,
      headers: {
        'Authorization': `Bearer ${getToken()}`
      },
      fileList: []
    }
  },
  watch: {
    dialogFormVisible(newVal) {
      if (!newVal) {
        this.fileList = []
      }
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    categoryFormatter(item) {
      switch (item.textbookCategory) {
        case 0:
          return '中考'
        case 1:
          return '小升初'
      }
    },
    initData() {
      this.likeSearchUrl = this.$urlPath.queryGrammarTextBookList
    },
    getAddressInfo(item) {
      if (item.addressDetailList && item.addressDetailList.length > 0) {
        return item.addressDetailList.map(it => it.address).join(',')
      }
      return '暂无详细地址'
    },
    onAdd() {
      if (!this.checkButtonPermission('add')) {
        return
      }
      this.dialogFormVisible = true
      this.mode = 'add'
      this.fileList = []
      this.materialModel = {
        textbookName: '', // 教材名称
        unLockCoins: 0, // 解锁所需优钻
        textbookType: 1, // 教材类型 0词汇 1语法 2体验 3自然拼读
        textbookCategory: 0, // 教材类别 0YouCan 1拳心同步 2智能英语
        textbookVersion: '综合版', // 教材版本
        isOpenUser: 0, // 是否对用户开放 0是 1否 否：可以为学校授权，也可以不授权  如果授权，需要传学校主键ID到后台
        isExper: 0,
        schoolIds: '', // 学校主键ID，多个学校则主键用逗号隔开即可，如：1,2,3,4
        isHasVideo: 0, // 是否有视频 0是 1否
        coverUrl: '' // 教材封面
      }
    },
    getData() {
      this.$http({
        url: this.$urlPath.queryGrammarTextBookList,
        methods: this.HTTP_GET,
        data: {
          pageNum: this.page,
          pageSize: this.pageSize
        }
      }).then(res => {
        this.onSuccess(res.obj)
      })
    },
    handleMaterialCommand({ tag, item }) {
      switch (tag) {
        case 1: // 查看授权的学校
          if (!this.checkButtonPermission('look_grant_stu')) {
            return
          }
          this.dialogGrantSchoolVisible = true
          this.grantSchoolLoading = true
          this.$http({
            url: this.$urlPath.querySchoolByTextBookId,
            methods: this.HTTP_GET,
            data: {
              textbookId: item.textbookId
            }
          }).then(res => {
            this.grantSchoolLoading = false
            this.grantSchoolTableData = res.obj
          })
          break
        case 2: // 生成教材
          if (!this.checkButtonPermission('gene_material')) {
            return
          }
          this.$router.push({
            name: 'GenerateMaterial',
            params: {
              textbookId: item.textbookId
            }
          })
          break
        case 3:
          this.jumpSpell(item)
          break
      }
    },
    handlerFormConfirm() {
      if (!this.materialModel.textbookName) {
        this.$errorMsg('请输入教材名称')
        return
      }
      if (!this.materialModel.coverUrl) {
        this.$errorMsg('请选择一张教材封面')
        return
      }
      this.dialogFormVisible = false
      this.$showLoading(closeLoading => {
        if (this.mode === 'add') {
          this.$http({
            url: this.$urlPath.saveGrammarTextBook,
            data: this.materialModel
          }).then(res => {
            closeLoading()
            this.dialogFormVisible = false
            this.grantSchoolLoading = false
            this.$successMsg('教材添加成功')
            this.getData()
            this.$nextTick(_ => {
              this.$warningConfirm('教材基本信息创建成功，是否要创建教材其它信息？', _ => {
                this.$router.push({
                  name: 'GenerateMaterial',
                  params: {
                    textbookId: res.obj,
                    progressNo: 0
                  }
                })
              })
            })
          }).catch(_ => {
            closeLoading()
            this.dialogFormVisible = false
            this.grantSchoolLoading = false
          })
        } else {
          this.$http({
            url: this.$urlPath.editGrammarTextBook,
            data: this.materialModel
          }).then(res => {
            closeLoading()
            this.$successMsg('教材修改成功')
            this.getData()
          }).catch(_ => {
            closeLoading()
          })
        }
      })
    },
    handlerUpdate(item) {
      if (!this.checkButtonPermission('edit')) {
        return
      }
      this.dialogFormVisible = true
      this.mode = 'edit'
      this.materialModel.textbookId = item.textbookId
      this.materialModel.textbookName = item.textbookName
      this.materialModel.unLockCoins = item.unLockCoins // 解锁所需优钻
      this.materialModel.textbookType = item.textbookType // 教材类型 0词汇 1语法 2体验 3自然拼读
      this.materialModel.textbookCategory = item.textbookCategory // 教材类别 0YouCan 1拳心同步 2智能英语
      this.materialModel.textbookVersion = item.textbookVersion // 教材版本主键ID
      this.materialModel.isOpenUser = item.isOpenUser // 是否对用户开放 0是 1否 否：可以为学校授权，也可以不授权  如果授权，需要传学校主键ID到后台
      this.materialModel.isExper = item.isExper
      this.materialModel.schoolIds = item.schoolIds // 学校主键ID，多个学校则主键用逗号隔开即可，如：1,2,3,4
      this.materialModel.isHasVideo = item.isHasVideo // 是否有视频 0是 1否
      this.materialModel.coverUrl = item.coverUrl
      if (this.materialModel.coverUrl) {
        this.fileList.push(
          {
            name: 'cover.png',
            url: getImagePath(item.coverUrl)
          }
        )
      }
    },
    deleteItem(item) {
      if (!this.checkButtonPermission('delete')) {
        return
      }
      this.$warningConfirm('确定要删除此教材信息，删除后不可恢复。', _ => {
        this.$http({
          url: this.$urlPath.deleteGrammarTextBook,
          data: {
            textbookId: item.textbookId
          }
        }).then(res => {
          this.$successMsg('教材删除成功')
          this.tableData.splice(this.tableData.indexOf(item), 1)
        })
      })
    },
    downExcel() {
      if (!this.checkButtonPermission('down_excel')) {
        return
      }
      this.$http({
        url: this.$urlPath.uploadGrammarTextBookExcelTemplate,
        methods: this.HTTP_GET,
        data: {},
        responseType: `blob`
      }).then(res => {
        blobToExecl(res, '教材模板')
      })
    },
    beforeAvatarUpload(file) {
      const isJPGOrPNG = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 < 500
      if (!isJPGOrPNG) {
        this.$message.error('上传教材封面图片只能是 JPG或者PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传教材封面图片大小不能超过 500KB!')
      }
      return isJPGOrPNG && isLt2M
    },
    handleAvatarSuccess(res, file) {
      if (res.status === 200) this.materialModel.coverUrl = res.obj
    },
    handleRemove(file) {
      this.materialModel.coverUrl = ''
    },
    handlerExceed() {
      this.$errorMsg('最多只能上传 1 张封面图片')
    }
  }
}
</script>
<style lang="scss" scoped>
>>> .el-tabs__header{
  margin: 0 0 5px
}
>>> .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
>>> .avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 150px;
  height: 150px;
  line-height: 150px;
  text-align: center;
}
.avatar {
  width: 150px;
  height: 150px;
  display: block;
}
</style>
