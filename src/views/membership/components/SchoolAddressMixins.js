export default {
  data() {
    return {
      showAddressDialog: false,
      tempAddress: {},
      tempAddressInfo: '',
      location: '济南'
    }
  },
  watch: {
    'schoolModel.tempProvince'(newVal, oldVal) {
      if (newVal.length === 0) {
        this.schoolModel.addressDetailList = []
        this.schoolModel.addressDetailList.push(
          {
            id: new Date().getTime(),
            address: '',
            point: null,
            canAdd: true,
            canDelete: false
          })
      } else {
        this.location = newVal[1]
      }
    }
  },
  methods: {
    onAddressFocus(item) {
      if (this.schoolModel.tempProvince.length === 0) {
        this.$errorMsg('请先选择省市区')
        return
      }
      this.tempAddress = item
      this.showAddressDialog = true
      this.tempAddressInfo = item.address
    },
    onSelectedAddress(address) {
      this.showAddressDialog = false
      this.tempAddress.id = address.uid || new Date().getTime()
      this.tempAddress.address = address.address
      this.tempAddress.point = address.point
    },
    selectAddress(item) {
      this.showAddressDialog = true
    },
    addAddress() {
      this.schoolModel.addressDetailList.push({
        id: new Date().getTime(),
        address: '',
        point: null,
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
    cancelDialog() {
      this.showAddressDialog = false
    }
  }
}
