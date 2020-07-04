<template>
  <div class="container">
    <el-card
      ref="tableHeader"
      :body-style="{padding: '0px'}"
    >
      <div
        slot="header"
        style="height: 29px"
        class="flex justify-between"
      >
        <el-link :underline="false">奖品信息</el-link>
        <el-link
          v-if="editMode"
          :underline="false"
          style="margin-left: 10px"
          type="danger"
        >以下奖信息为系统默认信息，请修改信息后再进行提交</el-link>
        <div class="flex-sub" />
        <el-button
          v-if="editMode"
          type="primary"
          size="mini"
          @click="saveGoodsInfo"
        >保存</el-button>
      </div>
    </el-card>
    <el-card
      :body-style="{ padding: 0 }"
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
        @selection-change="handleSelectionChange"
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
          label="奖品名称"
          prop="prizeName"
        />
        <el-table-column
          align="center"
          prop="prizeImage"
          label="奖品图片"
        >
          <template slot-scope="scope">
            <el-image
              :src="scope.row.prizeImage"
              fit="cover"
              style="width: 50px; height: 50px"
            />
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="prizeCount"
          label="奖品数量"
        />
        <el-table-column
          align="center"
          prop="winweight"
          label="中奖概率"
        >
          <template slot-scope="scope">
            {{ getWeight(scope.row) + '%' }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="prizeNote"
          label="奖品说明"
        />
        <el-table-column
          v-if="editMode"
          align="center"
          prop="createTime"
          label="操作"
        >
          <template slot-scope="scope">
            <el-button
              type="primary"
              :size="$style.tableButtonSize"
              @click="handlerUpdate(scope.row, scope.$index)"
            >编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!--添加修改抽奖对话框-->
    <el-dialog
      title="编辑奖品信息"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        ref="dataForm"
        class="dialog-container"
      >
        <el-form-item label="奖品名称">
          <el-col :span="$style.dialogColSpan">
            <el-select
              v-model="goodsModel.value"
              class="filter-item"
              style="width: 100%"
              placeholder="请选择奖品"
            >
              <el-option
                v-for="item of goodsList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item
          label="奖品数量"
          prop="deptCode"
        >
          <el-col :span="$style.dialogColSpan">
            <el-input-number
              v-model="goodsModel.prizeCount"
              :min="1"
              style="width: 100%"
            />
          </el-col>
        </el-form-item>
        <el-form-item
          label="中奖概率"
          prop="parentDeptId"
        >
          <el-col :span="$style.dialogColSpan">
            <div
              class="flex"
              style="width: 100%"
            >
              <el-input-number
                v-model="goodsModel.winweight"
                class="flex-sub"
                :min="1"
                :max="99"
              />
              <el-link
                :underline="false"
                class="margin-left"
              >说明：所有奖品中奖概率相加不得超过100%</el-link>
            </div>
          </el-col>
        </el-form-item>
        <el-form-item
          label="奖品说明"
          prop="parentDeptId"
        >
          <el-col :span="$style.dialogColSpan">
            <el-input
              v-model="goodsModel.prizeNote"
              placeholder="请输入奖品说明"
              clearable
              type="textarea"
              maxlength="100"
              :rows="3"
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
          @click="dialogFormVisible = false"
        >取消</el-button>
        <el-button
          :size="$style.dialogButtonSize"
          type="primary"
          @click="handleDialogConfirm"
        >确定</el-button>
      </div>
    </el-dialog>
    <!--添加修改抽奖对话框-->
  </div>
</template>

<script>
import tableMixins from '../../mixins/table-mixins'
import { baseImageIp } from '../../api/url-path'
export default {
  name: 'PrizeGoodsInfo',
  mixins: [tableMixins],
  data() {
    return {
      mode: 'add',
      dialogFormVisible: false,
      goodsList: [
        {
          label: '优币',
          value: 1
        },
        {
          label: '再接再厉',
          value: 2
        },
        {
          label: '学校纪念T桖',
          value: 3
        },
        {
          label: '棒棒糖',
          value: 4
        },
        {
          label: '可乐',
          value: 5
        },
        {
          label: '橡皮',
          value: 6
        },
        {
          label: '精美文具',
          value: 7
        },
        {
          label: '精美水杯',
          value: 8
        },
        {
          label: '精美书包',
          value: 9
        },
        {
          label: '精美笔记本',
          value: 10
        },
        {
          label: '纪念圆珠笔',
          value: 11
        },
        {
          label: '纪念雨伞',
          value: 12
        },
        {
          label: '电影票',
          value: 13
        },
        {
          label: '10元手机充值卡',
          value: 14
        }
      ],
      goodsModel: {
        value: '',
        prizeName: '', // 奖品名称
        prizeImage: '', // 奖品图片地址
        prizeCount: '', // 奖品数量
        winweight: 10, // 中奖概率
        prizeNote: ''// 奖品说明
      },
      tempSelectGoods: null,
      editMode: false
    }
  },
  watch: {
    'goodsModel.value'(newVal, oldVal) {
      if (newVal) {
        this.goodsModel.prizeNote = this.goodsList.find(it => it.value === Number(newVal)).label
      }
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    getWeight(item) {
      return item.winweight < 1 ? item.winweight * 100 : item.winweight
    },
    handlerUpdate(item, index) {
      this.tempSelectGoods = item
      this.dialogFormVisible = true
      this.goodsModel.value = item.value
      this.goodsModel.prizeName = item.prizeName // 奖品名称
      this.goodsModel.prizeImage = item.prizeImage // 奖品图片地址
      this.goodsModel.prizeCount = item.prizeCount // 奖品数量
      this.goodsModel.winweight = item.winweight // 中奖概率
      this.goodsModel.prizeNote = item.prizeNote// 奖品说明
    },
    saveGoodsInfo() {
      if (this.tableData.length !== 8) {
        this.$errorMsg('请添加 8 个奖品信息')
        return
      }
      const weight = this.tableData.reduce((acc, cur) => {
        acc += cur.winweight
        return acc
      }, 0)
      if (weight !== 100) {
        this.$errorMsg('总中奖概率必须等于100%，当前总中奖概率为：' + weight + '%')
        return
      }
      this.$showLoading(closeLoading => {
        this.$http({
          url: this.$urlPath.savePrizeDetail,
          data: {
            prizeDetailList: this.tableData.map(it => {
              return {
                prizeId: this.$route.params.prizeId,
                prizeCount: it.prizeCount,
                prizeImage: it.prizeImage,
                prizeName: it.prizeName,
                prizeNote: it.prizeNote,
                winweight: it.winweight / 100
              }
            })
          },
          withUserId: false,
          withRoleId: false,
          contentType: 'application/json; charset=UTF-8'
        }).then(res => {
          closeLoading()
          this.$successMsg('奖品添加成功')
          this.$closeCurrentView()
        }).catch(_ => {
          closeLoading()
        })
      })
    },
    handleDialogConfirm() {
      if (!this.goodsModel.prizeNote) {
        this.$errorMsg('请输入奖品说明')
        return
      }
      const tempModel = this.goodsList.find(it => it.value === this.goodsModel.value)
      this.tempSelectGoods.prizeName = tempModel.label
      this.tempSelectGoods.value = this.goodsModel.value
      this.tempSelectGoods.prizeImage = `${baseImageIp}/prizeImages/${this.goodsModel.value}.jpg`
      this.tempSelectGoods.prizeCount = this.goodsModel.prizeCount
      this.tempSelectGoods.winweight = this.goodsModel.winweight
      this.tempSelectGoods.prizeNote = this.goodsModel.prizeNote
      // 重置数据
      this.dialogFormVisible = false
      this.goodsModel = {
        value: '',
        prizeName: '', // 奖品名称
        prizeImage: '', // 奖品图片地址
        prizeCount: '', // 奖品数量
        winweight: '', // 中奖概率
        prizeNote: ''// 奖品说明
      }
    },
    getData() {
      this.$http({
        url: this.$urlPath.queryPrizeDetailList,
        methods: this.HTTP_GET,
        data: {
          prizeId: this.$route.params.prizeId
        }
      }).then(res => {
        this.loading = false
        this.tableData = res.obj
        this.editMode = this.tableData.length === 0
        if (this.editMode) {
          [1, 2, 3, 4, 5, 6, 7, 8].forEach(it => {
            this.tableData.push({
              value: 1,
              prizeName: '优币', // 奖品名称
              prizeImage: `${baseImageIp}/prizeImages/1.jpg`, // 奖品图片地址
              prizeCount: 1, // 奖品数量
              winweight: 10, // 中奖概率
              prizeNote: '优币'// 奖品说明
            })
          })
          this.tableData[7].winweight = 30
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
>>> .el-card__header {
  padding: 10px;
}
>>> .table-container {
  bottom: 0;
}
</style>
