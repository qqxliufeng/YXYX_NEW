<template>
  <div class="flex justify-center footer-wrapper">
    <el-card
      :body-style="{padding: '5px'}"
      style="width: 100%; text-align: center"
    >
      <div class="flex justify-center align-center">
        <el-pagination
          :total="total"
          :page-size="pageSize"
          :current-page.sync="currentPage"
          layout="total, prev, pager, next, jumper"
          @current-change="currentChange"
          @prev-click="prevClick"
          @next-click="nextClick"
        />
        <el-button
          v-if="showRefresh"
          class="margin-left"
          type="success"
          icon="el-icon-refresh"
          circle
          size="mini"
          @click="refresh"
        />
      </div>
    </el-card>
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
    },
    showRefresh: {
      type: Boolean,
      default: true
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
