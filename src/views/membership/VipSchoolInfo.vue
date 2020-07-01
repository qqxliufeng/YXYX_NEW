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
          <span class="item-title">在线状态</span>
          <el-link
            :underline="false"
            class="item-value"
          >{{ schoolInfo.schoolLeaderName || '暂无名称' }}</el-link>
        </div>
        <el-divider />
        <div class="item-wrapper">
          <span class="item-title">管理员</span>
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
              >{{ item || '暂无' }}</el-link>
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
        <el-divider />
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'VipSchoolInfo',
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
        }).catch(_ => {
          closeLoading()
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.info-wrapper {
  width: 60%;
  margin: 0 auto;
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
</style>
