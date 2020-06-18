<template>
  <div>
    {{ $route.params.studentId }}
  </div>
</template>

<script>
// 给线下的学生分配教材
import tableMixins from '../../mixins/table-mixins'
export default {
  name: 'GrantTextBookToStudent',
  mixins: [tableMixins],
  data() {
    return {

    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData() { }
  }
}
</script>
