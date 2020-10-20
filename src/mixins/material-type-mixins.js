export default {
  data() {
    return {
      materialType: 0
    }
  },
  watch: {
    materialType(newVal, oldVal) {
      this.materialTypeChange()
    }
  },
  methods: {
    materialTypeChange() {
      this.getData()
    },
    externalParam(form) {
      form.cardSource = this.materialType
    }
  }
}
