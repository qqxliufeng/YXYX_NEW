<template>
  <div class="container">
    <el-card body-style="padding: 0">
      <div
        slot="header"
        class="flex justify-between align-center"
      >
        <span class="title text-bold">添加学校信息</span>
        <el-button
          type="primary"
          size="small"
          @click="addSchoolInfo"
        >保存</el-button>
      </div>
    </el-card>
    <el-card style="margin-top: 10px">
      <div slot="header">
        <span class="title text-bold">基本信息</span>
      </div>
      <el-form
        label-width="100px"
        label-position="right"
      >
        <el-form-item label="学校名称">
          <el-col :span="10">
            <el-input
              v-model="schoolModel.schoolName"
              placeholder="请输入学校名称（必填）"
              maxlength="30"
            />
          </el-col>
        </el-form-item>
        <el-form-item label="学校管理者">
          <el-col :span="10">
            <el-select
              v-model="schoolModel.schoolLeaderId"
              placeholder="请选择学校管理者（必填）"
              style="width: 100%"
              filterable
              @change="changeTeacher"
            >
              <el-option
                v-for="item of teacherList"
                :key="item.userId"
                :label="item.username"
                :value="item.userId"
              />
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="管理者姓名">
          <el-col :span="10">
            <el-input
              v-model="schoolModel.schoolLeaderName"
              placeholder="请输入管理者姓名（必填）"
              maxlength="10"
            />
          </el-col>
        </el-form-item>
        <el-form-item label="联系方式">
          <el-col :span="10">
            <el-input
              v-model="schoolModel.schoolTel"
              placeholder="请输入联系方式（必填）"
              maxlength="11"
            />
          </el-col>
        </el-form-item>
        <el-form-item label="加盟类型">
          <el-col :span="10">
            <el-radio-group v-model="schoolModel.schoolType">
              <el-radio :label="0">普通加盟校</el-radio>
              <el-radio :label="1">独家加盟</el-radio>
              <el-radio :label="2">独家加盟校代理</el-radio>
            </el-radio-group>
          </el-col>
        </el-form-item>
        <el-form-item label="省/市/区">
          <el-col :span="10">
            <el-cascader
              v-model="schoolModel.tempProvince"
              style="width: 100%"
              :options="level"
              :props="{label: 'name', value: 'name'}"
              clearable
            />
          </el-col>
        </el-form-item>
        <el-form-item label="详细地址">
          <el-row
            v-for="item of schoolModel.addressDetailList"
            :key="item.id"
            style="margin-bottom: 10px"
          >
            <el-col :span="7">
              <el-input
                v-model="item.address"
                placeholder="请输入详细地址（必填）"
              />
            </el-col>
            <el-col
              v-if="item.canAdd"
              :span="2"
              class="text-center"
            >
              <el-button
                size="mini"
                type="primary"
                @click="addAddress"
              >添加</el-button>
            </el-col>
            <el-col
              v-if="item.canDelete"
              :span="1"
              class="text-center"
            >
              <el-button
                size="mini"
                type="danger"
                @click="deleteAddress(item)"
              >删除</el-button>
            </el-col>
          </el-row>

        </el-form-item>
      </el-form>
    </el-card>
    <el-card style="margin-top: 10px">
      <div slot="header">
        <span class="title text-bold">其它信息</span>
      </div>
      <el-form>
        <el-form-item label="督导老师">
          <el-col :span="10">
            <el-select
              v-model="schoolModel.superviseId"
              placeholder="请选择督导老师（必填）"
              style="width: 100%"
              filterable
            >
              <el-option
                v-for="item of youXingUserList"
                :key="item.userId"
                :label="item.username"
                :value="item.userId"
              />
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="销售顾问">
          <el-col :span="10">
            <el-select
              v-model="schoolModel.salesId"
              placeholder="请选择销售顾问（必填）"
              style="width: 100%"
              filterable
            >
              <el-option
                v-for="item of youXingUserList"
                :key="item.userId"
                :label="item.username"
                :value="item.userId"
              />
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="到期日期">
          <el-col :span="10">
            <el-date-picker
              v-model="schoolModel.endTime"
              style="width: 100%"
              type="date"
              placeholder="选择到期时间"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
            />
          </el-col>
        </el-form-item>
        <el-form-item label="备注说明">
          <el-col :span="10">
            <el-input
              type="textarea"
              :rows="2"
              placeholder="请输入备注"
            />
          </el-col>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card style="margin-top: 10px">
      <div slot="header">
        <span class="title text-bold">学习卡信息</span>
      </div>
      <el-form>
        <el-form-item label="添加类型">
          <el-col :span="10">
            <el-radio-group v-model="schoolModel.saveType">
              <el-radio :label="0">批量</el-radio>
            </el-radio-group>
          </el-col>
        </el-form-item>
        <el-form-item label="学习卡信息：">
          <el-col :span="8">
            <el-button
              size="mini"
              type="primary"
              @click="addStudyCard"
            >添加</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="deleteStudyCard"
            >删除</el-button>
          </el-col>
        </el-form-item>
        <el-form-item>
          <div>
            <el-row>
              <el-col
                :span="8"
                class="text-center"
              >
                <el-link
                  :underline="false"
                  type="primary"
                >学习卡类型</el-link>
              </el-col>
              <el-col
                :span="8"
                class="text-center"
              >
                <el-link
                  :underline="false"
                  type="primary"
                >学习卡数量</el-link>
              </el-col>
              <el-col
                :span="8"
                class="text-center"
              >
                <el-link
                  :underline="false"
                  type="primary"
                >学习卡教材</el-link>
              </el-col>
            </el-row>
            <el-row
              v-for="item of schoolModel.studyCardParams"
              :key="item.id"
              style="margin-bottom: 10px"
            >
              <el-col
                :span="8"
                class="text-center"
              >
                <el-select
                  v-model="item.cardType"
                  placeholder="请选择学习卡类型（必填）"
                  style="width: 70%"
                  filterable
                >
                  <el-option
                    v-for="cardTypeItem of studyCardTypeList"
                    :key="cardTypeItem.value"
                    :label="cardTypeItem.label"
                    :value="cardTypeItem.value"
                  />
                </el-select>
              </el-col>
              <el-col
                :span="8"
                class="text-center"
              >
                <el-input-number
                  v-model="item.cardNum"
                  size="small"
                />
              </el-col>
              <el-col
                :span="8"
                class="text-center text-cut"
              >
                <el-link
                  :underline="false"
                  @click="selectTextBookList(item)"
                >{{ item.textbookNames || '点击选择学习卡教材' }}</el-link>
              </el-col>
            </el-row>
          </div>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card
      body-style="padding: 0"
      style="margin-top: 10px"
    >
      <div
        slot="header"
        class="flex justify-end align-center"
      >
        <el-button
          type="primary"
          size="small"
          @click="addSchoolInfo"
        >保存</el-button>
      </div>
    </el-card>
    <el-dialog
      title="教材列表"
      :visible.sync="dialogTableVisible"
    >
      <el-table
        ref="multiTable"
        v-loading="tableLoading"
        :data="textbookList"
        max-height="800px"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="55"
        />
        <el-table-column
          property="textbookId"
          label="ID"
        />
        <el-table-column
          property="textbookName"
          label="教材名称"
        />
      </el-table>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          :size="$style.dialogButtonSize"
          @click="dialogTableVisible = false"
        >取消</el-button>
        <el-button
          :size="$style.dialogButtonSize"
          type="primary"
          @click="handleTextBookConfirm"
        >确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import schoolMixins from '../../mixins/school-mixins'
export default {
  name: 'AddSchool',
  mixins: [schoolMixins],
  data() {
    return {
      level: this.$privinceData,
      studyCardTypeList: [
        {
          label: 'P',
          value: '小学正式卡'
        },
        {
          label: 'TP',
          value: '小学体验卡'
        },
        {
          label: 'M',
          value: '初中正式卡'
        },
        {
          label: 'TM',
          value: '初中体验卡'
        }
      ],
      textbookList: [],
      schoolModel: {
        schoolName: '', //        学校名称
        schoolLeaderId: '', //    学校管理者ID
        schoolLeaderName: '', //  管理者姓名
        schoolTel: '', //         学校联系方式
        schoolType: 0, //        加盟校类型 0普通加盟校(集团发展) 1独家加盟(集团发展) 2 独家加盟校代理(独家加盟校自己发展)
        province: '', //          省
        city: '', //             市
        area: '', //              区
        addressDetailList: [
          {
            id: new Date().getTime(),
            address: '',
            canAdd: true,
            canDelete: false
          }
        ], //     详细地址地址可以添加多个，转成list,传到后台，list中的字段为：address
        superviseId: '', //       督导老师ID
        salesId: '', //           销售顾问ID
        note: '', //             备注
        endTime: '', //           到期日期
        // 学习卡相关信息参数：(将list集合转成json，传到后台)，学习卡信息非必输项
        saveType: 0, // 增加学习卡的方式  0批量
        studyCardParams: [
          {
            id: new Date().getTime(),
            cardType: '', //          学习卡类型(P小学正式卡  TP小学体验卡 M初中正式卡 TM初中体验卡)
            cardNum: 0, //			  学习卡数量(批量增加方式)
            cardCode: '', //		  学习卡编码(查询学习卡编码方式,暂时不增加此字段)
            textbookIds: '', //		  教材主键ID，多个用逗号隔开
            textbookNames: ''
          }
        ]
      },
      dialogTableVisible: false,
      tableLoading: false,
      tempStudyCardItem: null,
      multipleSelection: []
    }
  },
  mounted() {
    this.getTeacherList()
    this.getYouXingList()
  },
  methods: {
    changeTeacher(value) {
      this.schoolModel.schoolLeaderName = this.teacherList.filter(it => it.userId === value)[0].username
    },
    addSchoolInfo() { },
    addAddress() {
      this.schoolModel.addressDetailList.push({
        id: new Date().getTime(),
        address: '',
        canAdd: true,
        canDelete: true
      })
    },
    deleteAddress(addressItem) {
      if (this.schoolModel.addressDetailList.length === 1) {
        return
      }
      this.schoolModel.addressDetailList.splice(this.schoolModel.addressDetailList.indexOf(addressItem), 1)
    },
    addStudyCard() {
      const item = {
        id: new Date().getTime(),
        cardType: '', //          学习卡类型(P小学正式卡  TP小学体验卡 M初中正式卡 TM初中体验卡)
        cardNum: 0, //			  学习卡数量(批量增加方式)
        cardCode: '', //		  学习卡编码(查询学习卡编码方式,暂时不增加此字段)
        textbookIds: '', //		  教材主键ID，多个用逗号隔开
        textbookNames: ''
      }
      this.schoolModel.studyCardParams.push(item)
    },
    deleteStudyCard() {
      if (this.schoolModel.studyCardParams.length === 0) {
        return
      }
      this.schoolModel.studyCardParams.pop()
    },
    selectTextBookList(item) {
      this.tempStudyCardItem = item
      this.dialogTableVisible = true
      if (this.textbookList.length === 0) {
        this.tableLoading = true
        this.$http({
          url: this.$urlPath.queryTextBookList,
          methods: this.HTTP_GET,
          data: {
            pageNum: 0,
            pageSize: 1000
          }
        }).then(res => {
          this.tableLoading = false
          this.textbookList = res.obj.list
          if (this.textbookList && this.textbookList.length > 0) {
            this.textbookList.forEach(it => {
              this.$set(it, 'selected', false)
            })
          }
        })
      } else {
        if (this.tempStudyCardItem.textbookIds === '') {
          this.textbookList.forEach(it => {
            it.selected = false
          })
        } else {
          const ids = this.tempStudyCardItem.textbookIds.split(',')
          this.textbookList.forEach(it => {
            it.selected = ids.includes(it.textbookId.toString())
          })
        }
      }
      const selectedItems = this.textbookList.filter(it => it.selected)
      if (selectedItems.length > 0) {
        this.$nextTick(_ => {
          this.$refs.multiTable.toggleRowSelection(selectedItems, true)
        })
      } else {
        this.$nextTick(_ => {
          this.$refs.multiTable.clearSelection()
        })
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleTextBookConfirm() {
      this.dialogTableVisible = false
      if (this.multipleSelection.length === 0) {
        this.tempStudyCardItem.textbookNames = ''
        this.tempStudyCardItem.textbookIds = ''
        return
      }
      const tempList = this.multipleSelection.map(it => {
        return { name: it.textbookName, id: it.textbookId }
      })
      this.tempStudyCardItem.textbookNames = tempList.map(it => it.name).join(',')
      this.tempStudyCardItem.textbookIds = tempList.map(it => it.id).join(',')
    }
  }
}
</script>

