<template>
  <div
    id="content-wrapper"
    class="container"
  >
    <el-card body-style="padding: 0">
      <div
        slot="header"
        class="flex justify-between align-center"
      >
        <span class="title text-bold">编辑学校信息</span>
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
        <el-form-item label="在线状态">
          <el-col :span="10">
            <el-link
              type="danger"
              :underline="false"
            >{{ '当前学校状态为 ' + (schoolModel.isOnLine === 0 ? '线下' : '线上') + ' 状态' }}</el-link>
          </el-col>
        </el-form-item>
        <el-form-item label="学校管理者">
          <el-col :span="10">
            <el-link
              :underline="false"
              type="primary"
            >{{ schoolModel.schoolLeaderName | emptyFormat }}</el-link>
          </el-col>
        </el-form-item>
        <el-form-item label="加盟类型">
          <el-col :span="15">
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
              :placeholder="provincePlaceHolder"
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
                readonly
                type="textarea"
                :rows="2"
                @focus="onAddressFocus(item)"
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
            />
          </el-col>
        </el-form-item>
        <el-form-item label="备注说明">
          <el-col :span="10">
            <el-input
              v-model="schoolModel.note"
              type="textarea"
              :rows="2"
              placeholder="请输入备注"
            />
          </el-col>
        </el-form-item>
      </el-form>
    </el-card>
    <add-study-card-to-school
      v-if="schoolModel.isOnLine === 1"
      ref="studyCardParams"
    />
    <select-school-address
      :show-address-dialog="showAddressDialog"
      :address="tempAddressInfo"
      :location="location"
      @on-select-address="onSelectedAddress"
      @cancel-dialog="cancelDialog"
    />
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
  </div>
</template>

<script>
import schoolMixins from '../../mixins/school-mixins'
import AddStudyCardToSchool from './components/AddStudyCardToSchool'
import SelectSchoolAddress from './components/SelectSchoolAddress'
import SchoolAddressMixins from './components/SchoolAddressMixins'
import { Loading } from 'element-ui'
export default {
  name: 'EditSchool',
  components: {
    AddStudyCardToSchool,
    SelectSchoolAddress
  },
  mixins: [schoolMixins, SchoolAddressMixins],
  data() {
    return {
      level: this.$privinceData,
      provincePlaceHolder: '请选择地区',
      schoolModel: {
        schoolId: '', // 学校ID
        schoolName: '', //        学校名称
        isOnLine: 0, // 学校的在线状态  0 线下 1线上
        schoolType: 0, //        加盟校类型 0普通加盟校(集团发展) 1独家加盟(集团发展) 2 独家加盟校代理(独家加盟校自己发展)
        tempProvince: [],
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
        endTime: '' //           到期日期
      }
    }
  },
  mounted() {
    this.getData()
    this.getYouXingList()
  },
  methods: {
    getData() {
      this.$http({
        url: this.$urlPath.querySchoolBySchoolId,
        methods: this.HTTP_GET,
        data: {
          schoolId: this.$route.params.schoolId
        }
      }).then(res => {
        this.schoolModel.schoolId = res.obj.schoolId
        this.schoolModel.schoolName = res.obj.schoolName
        this.schoolModel.isOnLine = res.obj.isOnLine
        this.schoolModel.schoolLeaderId = res.obj.schoolLeaderId
        this.schoolModel.schoolLeaderName = res.obj.schoolLeaderName
        this.schoolModel.schoolTel = res.obj.schoolTel
        this.schoolModel.schoolType = res.obj.schoolType
        this.schoolModel.tempProvince[0] = res.obj.province
        this.schoolModel.tempProvince[1] = res.obj.city
        this.schoolModel.tempProvince[2] = res.obj.area
        this.schoolModel.superviseId = res.obj.superviseId
        this.schoolModel.salesId = res.obj.salesId
        this.schoolModel.note = res.obj.note
        this.schoolModel.endTime = res.obj.endTime
        if (res.obj.addressDetailList && res.obj.addressDetailList.length !== 0) {
          this.schoolModel.addressDetailList = res.obj.addressDetailList.map((it, index) => {
            return {
              id: it.id,
              address: it.address,
              canAdd: true,
              canDelete: index !== 0,
              point: {
                lat: it.lat,
                lng: it.lng
              }
            }
          })
        }
        this.provincePlaceHolder = this.schoolModel.tempProvince.join('/')
      })
    },
    changeTeacher(value) {
      const tempTeacher = this.teacherList.find(it => it.userId === value)
      this.schoolModel.schoolLeaderName = tempTeacher.username
      this.schoolModel.schoolTel = tempTeacher.phone
    },
    addSchoolInfo() {
      const postData = {}
      if (!this.schoolModel.schoolName) {
        this.$errorMsg('请输入学校名称')
        return
      }
      postData.schoolName = this.schoolModel.schoolName
      if (this.schoolModel.tempProvince.length === 0) {
        this.$errorMsg('请选择省市区')
        return
      }
      postData.province = this.schoolModel.tempProvince[0]
      postData.city = this.schoolModel.tempProvince[1]
      postData.area = this.schoolModel.tempProvince.length === 3 ? this.schoolModel.tempProvince[2] : ''
      if (this.schoolModel.addressDetailList.length === 0 || !this.schoolModel.addressDetailList[0].address) {
        this.$errorMsg('请至少输入一个详细地址')
        return
      }
      postData.addressDetailList = this.schoolModel.addressDetailList.map(it => {
        return {
          address: it.address,
          lng: it.point.lng,
          lat: it.point.lat
        }
      })
      if (!this.schoolModel.superviseId) {
        this.$errorMsg('请选择一个督导老师')
        return
      }
      postData.superviseId = this.schoolModel.superviseId
      if (!this.schoolModel.salesId) {
        this.$errorMsg('请选择一个销售人员')
        return
      }
      postData.salesId = this.schoolModel.salesId
      if (!this.schoolModel.endTime) {
        this.$errorMsg('请选择到期时间')
        return
      }
      postData.endTime = this.schoolModel.endTime
      postData.schoolId = this.schoolModel.schoolId
      postData.note = this.schoolModel.note
      postData.schoolType = this.schoolModel.schoolType
      if (this.$refs.studyCardParams) {
        const { saveType, studyCardParams } = this.$refs.studyCardParams.getStudyCardInfo()
        if (studyCardParams && studyCardParams.length > 0) {
          postData.saveType = saveType
          const filterResult = studyCardParams.some(it => {
            return it.cardType === '' || it.cardNum === 0
          })
          if (filterResult) {
            this.$errorMsg('请输入学习卡的具体信息')
            return
          }
          postData.studyCardParams = studyCardParams.map(it => {
            return {
              cardType: it.cardType,
              cardNum: it.cardNum,
              cardCode: it.cardCode,
              textbookType: it.materialType,
              textbookIds: it.tempTextbookIds.join(',')
            }
          })
        }
      }
      const loadingInstance = Loading.service({
        target: document.getElementById('content-wrapper')
      })
      this.$http({
        url: this.$urlPath.updateSchool,
        data: postData,
        contentType: 'application/json; charset=UTF-8'
      }).then(res => {
        this.$successMsg('学校信息修改成功')
        this.$closeCurrentView()
        this.$nextTick(_ => {
          loadingInstance.close()
        })
      }).catch(error => {
        console.log(error)
        this.$nextTick(_ => {
          loadingInstance.close()
        })
      })
    },
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
    }
  }
}
</script>

