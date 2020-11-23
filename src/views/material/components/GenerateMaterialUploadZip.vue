<template>
  <div>
    <el-card
      class="card-wrapper"
      :body-style="{padding: 0}"
    >
      <div
        slot="header"
        class="flex justify-between"
      >
        <span class="title text-bold">更改单词对应的例句音频、图片、单词音频文件地址</span>
        <el-link
          v-if="currentStep < shouldStep"
          size="mini"
          type="danger"
          :underline="false"
        >未开始</el-link>
        <el-button
          v-else-if="currentStep === shouldStep"
          size="mini"
          type="warning"
          :loading="uploadZipLoading"
          @click="submitZip"
        >更改地址</el-button>
        <el-link
          v-else
          size="mini"
          type="success"
          :underline="false"
        >已完成</el-link>
      </div>
      <div
        v-if="currentStep === shouldStep"
        style="text-align: center"
      >
        <div style="padding: 50px; font-size: 16px;font-weight: bold">
          请点击右上角按钮更改文件地址
        </div>
      </div>
      <div
        v-else-if="currentStep < shouldStep"
        class="flex justify-center align-center flex-direction padding"
      >
        <i class="el-icon-error error-icon" />
        <div class="success-tip">等待更改</div>
      </div>
      <div
        v-else
        class="flex justify-center align-center flex-direction padding"
      >
        <i class="el-icon-success success-icon" />
        <div class="success-tip">更改文件地址成功</div>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'GenerateMaterialUploadZip',
  props: {
    shouldStep: {
      type: Number,
      default: 5
    },
    currentStep: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      uploadZipLoading: false
    }
  },
  methods: {
    submitZip() {
      this.uploadZipLoading = true
      this.$http({
        url: this.$urlPath.updateWordEgsAndImageAndAudioUrl,
        data: {
          textBookId: this.$route.params.textbookId
        }
      }).then(res => {
        this.uploadZipLoading = false
        this.$successMsg('地址更改成功')
        this.$emit('uploadZipSuccess')
      }).catch(_ => {
        this.uploadZipLoading = false
        this.$errorMsg('地址更改失败')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
>>> .el-upload-dragger {
  width: 210px;
  height: 150px;
}
.card-wrapper {
  margin-bottom: 10px;
  .upload-wrapper {
    margin: 10px;
  }
  .success-icon {
    font-size: 50px;
    color: #13ce66;
  }
  .error-icon {
    font-size: 50px;
    color: #ff4949;
  }
  .success-tip {
    font-size: 14px;
    color: #333;
    margin-top: 10px;
  }
}
</style>
