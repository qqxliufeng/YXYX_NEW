<template>
  <div class="container">
    <material-table-header
      :show-course="true"
      :show-level="false"
      @on-change-value="onChangeValue"
    />
  </div>
</template>

<script>
import MaterialTableHeader from './components/MaterialTableHeader'
import tableMixins from '../../mixins/table-mixins'
export default {
  name: 'Level',
  components: {
    MaterialTableHeader
  },
  mixins: [tableMixins],
  methods: {
    onChangeValue({ textbookId, courseCode }) {
      this.getData(textbookId, courseCode)
    },
    getData(textbookId, courseCode) {
      this.$http({
        url: this.$urlPath.queryCourseLevel,
        methods: this.HTTP_GET,
        data: {
          textbookId,
          courseCode,
          pageNum: this.page,
          pageSize: this.pageSize
        }
      }).then(res => {
        console.log(res)
      })
    }
  }
}
</script>
