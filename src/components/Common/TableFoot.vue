<template>
  <div class="flex justify-center footer-wrapper">
    <el-card
      :body-style="{padding: '5px'}"
      style="width: 100%; text-align: center"
    >
      <el-pagination
        style="width: 100%"
        :total="total"
        :page-size="pageSize"
        :current-page.sync="currentPage"
        layout="total, prev, pager, next, jumper"
        @current-change="currentChange"
        @prev-click="prevClick"
        @next-click="nextClick"
      />
    </el-card>
    <!-- <el-button type="danger" icon="el-icon-refresh" circle @click="refresh" /> -->
  </div>
</template>

<script>
export default {
  name: 'TableFoot',
  props: {
    total: {
      type: Number,
      default: 0
    },
    pageNum: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: 10
    }
  },
  data() {
    return {
      currentPage: this.pageNum
    }
  },
  watch: {
    pageNum(newVal, oldVal) {
      this.currentPage = newVal
    }
  },
  methods: {
    prevClick(currentPage) {
      this.$emit('prev-click', currentPage)
    },
    nextClick(currentPage) {
      this.$emit('next-click', currentPage)
    },
    currentChange(currentPage) {
      this.$emit('current-change', currentPage)
    },
    refresh() {
      this.$emit('refresh')
    }
  }
}
</script>
<style scoped>
.footer-wrapper {
  width: 100%;
  margin-top: 10px;
}
</style>
