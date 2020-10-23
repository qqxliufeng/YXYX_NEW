export default {
  data() {
    return {
      submitLoading: false
    }
  },
  methods: {
    startSubmitLoading() {
      this.submitLoading = true
    },
    closeSubmitLoading() {
      this.submitLoading = false
    }
  }
}
