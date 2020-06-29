<template>
  <div class="container">
    <el-card :body-style="{padding: 0}">
      <div
        slot="header"
        class="flex justify-between align-center"
      >
        <div class="title text-bold">请输入回复内容</div>
        <el-button
          type="primary"
          size="mini"
          @click="submit"
        >提交</el-button>
      </div>
    </el-card>
    <el-card
      :body-style="{padding: 5}"
      style="margin-top: 10px"
    >
      <el-input
        v-model="replyContent"
        type="textarea"
        placeholder="请输入要回复的内容"
        maxlength="500"
        show-word-limit
        :autosize="{ minRows: 10, maxRows: 20}"
      />
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'FeedBackReplay',
  data() {
    return {
      replyContent: ''
    }
  },
  methods: {
    submit() {
      if (!this.replyContent) {
        this.$errorMsg('请输入要回复的内容')
        return
      }
      this.$showLoading(closeDialog => {
        this.$http({
          url: this.$urlPath.saveFeedBackReply,
          data: {
            feedbackId: this.$route.params.feedbackId,
            replyContext: this.replyContent,
            replyUserName: localStorage.getItem('username')
          },
          contentType: 'application/json; charset=UTF-8'
        }).then(res => {
          this.$successMsg('回复成功')
          closeDialog()
          this.$closeCurrentView()
        }).catch(_ => {
          closeDialog()
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
>>> .el-card__header {
  padding: 10px;
}
</style>
