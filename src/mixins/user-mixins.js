export default {
  methods: {
    checkPhoneIsExist(phone, cb) {
      this.$http({
        url: this.$urlPath.queryUserPhoneIsExit,
        methods: this.HTTP_GET,
        data: {
          phone
        }
      }).then(res => {
        cb(res)
      })
    }
  }
}
