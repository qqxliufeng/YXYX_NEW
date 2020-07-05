<template>
  <div>
    <!-- 增加服务记录对话框 -->
    <el-dialog
      title="添加学校地址"
      :visible.sync="showAddressDialog"
      width="80%"
      top="10vh"
      :show-close="false"
      :close-on-click-modal="false"
    >
      <div style="position: relative">
        <baidu-map
          class="map-wrapper"
          :center="location"
          :zoom="16"
          ak="oW2UEhdth2tRbEE4FUpF9E5YVDCIPYih"
        >
          <bm-local-search
            :keyword="addressKeyword"
            :auto-viewport="true"
            :location="location"
            @infohtmlset="infohtmlset"
          />
          <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT" />
          <div class="input-wrapper">
            <el-input
              v-model="addressKeyword"
              placeholder="请输入学校地址"
              clearable
            />
          </div>
        </baidu-map>
      </div>
      <div
        slot="title"
        class="dialog-footer flex justify-between"
      >
        <el-link :underline="false">添加学校地址</el-link>
        <div>
          <el-button
            :size="$style.dialogButtonSize"
            @click="cancelDialog"
          >取消</el-button>
          <el-button
            :size="$style.dialogButtonSize"
            type="primary"
            @click="addAddressItem"
          >添加</el-button>
        </div>
      </div>
    </el-dialog>
    <!-- 增加服务记录对话框 -->
  </div>
</template>

<script>
import BaiduMap from 'vue-baidu-map/components/map/Map'
import BmLocalSearch from 'vue-baidu-map/components/search/LocalSearch'
import BmNavigation from 'vue-baidu-map/components/controls/Navigation'
export default {
  name: 'SelectSchoolAddress',
  components: {
    BaiduMap,
    BmLocalSearch,
    BmNavigation
  },
  props: {
    showAddressDialog: {
      type: Boolean,
      default: false
    },
    location: {
      type: String,
      default: '济南'
    },
    address: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      addressKeyword: '',
      tempAddress: null
    }
  },
  watch: {
    addressKeyword(newVal) {
      if (!newVal) {
        this.tempAddress = null
      }
    },
    showAddressDialog(newVal) {
      if (newVal) {
        this.addressKeyword = this.address || ''
        if (!this.address) {
          this.tempAddress = null
        }
      }
    }
  },
  methods: {
    addAddressItem() {
      if (!this.tempAddress) {
        this.$errorMsg('请选择一个地理位置')
        return
      }
      this.$emit('on-select-address', this.tempAddress)
    },
    infohtmlset(val) {
      this.tempAddress = val
    },
    cancelDialog() {
      this.$emit('cancel-dialog', {})
    }
  }
}
</script>

<style lang="scss" scoped>
.map-wrapper {
  width: 100%;
  height: 60vh;
  position: relative;
  .input-wrapper {
    position: absolute;
    width: 50%;
    top: 10px;
    left: 10px;
  }
}
</style>
