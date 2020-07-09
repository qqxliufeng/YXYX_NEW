<template>
  <div class="container">
    <el-card v-if="schoolInfo">
      <div
        slot="header"
        class="info-wrapper flex justify-between align-center"
      >
        <el-link class="title text-bold text-lg">{{ schoolInfo.schoolName }}</el-link>
        <table-status :status="statusFormat()" />
      </div>
      <div class="info-wrapper">
        <div class="item-container">
          <div class="item-wrapper">
            <span class="item-title">学校账号</span>
            <el-link
              :underline="false"
              type="primary"
              class="item-value"
            >{{ schoolInfo.schoolTel }}</el-link>
          </div>
          <el-divider />
          <div class="item-wrapper">
            <span class="item-title">学校类型</span>
            <el-link
              :underline="false"
              type="primary"
              class="item-value"
            >{{ getSchoolType() }}</el-link>
          </div>
          <el-divider />
          <div class="item-wrapper">
            <span class="item-title">管理员</span>
            <el-link
              :underline="false"
              class="item-value"
            >{{ schoolInfo.schoolLeaderName || '暂无名称' }}</el-link>
          </div>
          <el-divider />
          <div class="item-wrapper">
            <span class="item-title">在线状态</span>
            <el-link
              :underline="false"
              class="item-value"
              type="danger"
            >{{ `${schoolInfo.isOnLine === 0 ? '线下' : '线上'}学校` }}</el-link>
          </div>
          <el-divider />
          <div class="item-wrapper">
            <span class="item-title">创建时间</span>
            <el-link
              :underline="false"
              class="item-value"
            >{{ schoolInfo.createTime | parseTime }}</el-link>
          </div>
          <el-divider />
          <div class="item-wrapper">
            <span class="item-title">到期时间</span>
            <el-link
              :underline="false"
              class="item-value"
              type="danger"
            >{{ schoolInfo.endTime | parseTime }}</el-link>
          </div>
          <el-divider />
          <div class="item-wrapper">
            <span class="item-title">学校地址</span>
            <el-link
              :underline="false"
              class="item-value"
            >{{ schoolInfo.province + '/' + schoolInfo.city + '/' + schoolInfo.area }}</el-link>
          </div>
          <el-divider />
          <div class="item-wrapper">
            <span class="item-title">详细地址</span>
            <ul v-if="schoolInfo.addressDetailList.length > 0">
              <li
                v-for="(item, index) of schoolInfo.addressDetailList"
                :key="index"
                style="line-height: 25px"
              >
                <el-link
                  :underline="false"
                  class="item-value"
                >{{ item.address || '暂无' }}</el-link>
              </li>
            </ul>
            <el-link
              v-else
              :underline="false"
              class="item-value"
            >{{ schoolInfo.addressDetail }}</el-link>
          </div>
          <el-divider />
          <div class="item-wrapper">
            <span class="item-title">备注</span>
            <el-link
              :underline="false"
              class="item-value"
              type="danger"
            >{{ schoolInfo.note || '暂无' }}</el-link>
          </div>
        </div>
        <div class="button-wrapper">
          <div class="button-item">
            <el-button
              v-if="schoolInfo.isOnLine === 0"
              type="warning"
              size="small"
              @click="grantedMaterial"
            >
              查看分配教材
            </el-button>
            <el-button
              v-else
              type="warning"
              size="small"
              @click="grantedStudyCard"
            >已分配学习卡</el-button>
          </div>
          <div class="button-item">
            <el-button
              type="success"
              size="small"
              @click="searchServiceRecord"
            >查看服务记录</el-button>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import userMixins from '../../mixins/user-mixins'
export default {
  name: 'VipSchoolInfo',
  mixins: [userMixins],
  data() {
    return {
      schoolInfo: null
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    statusFormat() {
      if (parseInt(this.schoolInfo.status) === 0) {
        return { label: '正常', type: 'primary' }
      }
      if (parseInt(this.schoolInfo.status) === 1) {
        return { label: '禁用', type: 'danger' }
      }
      return { label: '未知', type: 'warning' }
    },
    getSchoolType() {
      switch (this.schoolInfo.schoolType) {
        case 0:
          return '普通加盟校(集团发展)'
        case 1:
          return '独家加盟(集团发展)'
        case 2:
          return '独家加盟校代理(独家加盟校自己发展)'
      }
    },
    getData() {
      if (!this.$store.getters.schoolId) {
        this.$errorMsg('暂无学校信息')
        return
      }
      this.$showLoading(closeLoading => {
        this.$http({
          url: this.$urlPath.querySchoolBySchoolId,
          methods: this.HTTP_GET,
          data: {
            schoolId: this.$store.getters.schoolId
          }
        }).then(res => {
          closeLoading()
          this.schoolInfo = res.obj
          this.saveSchoolStatus(this.schoolInfo.isOnLine)
        }).catch(_ => {
          closeLoading()
        })
      })
    },
    grantedStudyCard() {
      if (!this.checkButtonPermission('grant_card_list')) {
        return
      }
      this.$router.push({
        name: 'SchoolStudyCardList',
        params: {
          schoolId: this.$store.getters.schoolId,
          schoolName: this.schoolInfo.schoolName,
          type: 1
        }
      })
    },
    searchServiceRecord() {
      if (!this.checkButtonPermission('search_record')) {
        return
      }
      this.$router.push({
        name: 'SchoolRecordList',
        params: {
          schoolId: this.$store.getters.schoolId
        }
      })
    },
    grantedMaterial() {
      if (!this.checkButtonPermission('search_material')) {
        return
      }
      this.$router.push({
        name: 'OffLineSchoolTextBook',
        params: {
          schoolId: this.$store.getters.schoolId
        }
      })
    },
    checkButtonPermission(btnCode) {
      if (!btnCode) {
        this.$errorMsg('按钮编码不能为空')
        return false
      }
      const checkResult = this.$menuButtonModel.checkPermission('VIPShcool', btnCode)
      if (!checkResult) {
        this.$errorMsg('当前账号权限不足，无法操作此功能，请联系管理员')
        return false
      }
      return true
    }
  }
}
</script>
<style lang="scss" scoped>
>>> .el-divider {
  background-color: #f5f5f5;
}
.info-wrapper {
  display: flex;
  justify-content: space-between;
  .item-container {
    flex: 2;
    padding: 0 10px;
    .item-wrapper {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .item-title {
        font-size: 14px;
      }
      .item-value {
        font-size: 16px;
      }
    }
  }
  .button-wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    .button-item {
      margin-top: 20px;
    }
  }
}
</style>
