<!--
 * @Author: your name
 * @Date: 2020-06-13 10:35:14
 * @LastEditTime: 2020-06-13 11:22:33
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /YXYX_NEW/src/views/membership/vipstudent.vue
-->
<template>
  <div class="container" />
</template>

<script>
import tableMixins from '../../mixins/table-mixins'
export default {
  name: 'VipStudent',
  mixins: [tableMixins],
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      this.$http({
        url: this.$urlPath.queryStudentList,
        methods: this.HTTP_GET,
        data: {
          pageNum: this.page,
          pageSize: this.pageSize
        },
        withUserId: false
      }).then(res => {
        console.log(res)
      })
    }
  }
}
</script>

