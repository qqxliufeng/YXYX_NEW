export default {
  computed: {
    isSuperAdmin() {
      return Number(this.$store.getters.roleId) === 1
    },
    isOnLineSchool() {
      return Number(this.$store.getters.schoolStatus) === 1
    }
  },
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
    },
    saveSchoolStatus(schoolStatus) {
      this.$store.dispatch('user/saveSchoolStatus', schoolStatus)
    }
  }
}
