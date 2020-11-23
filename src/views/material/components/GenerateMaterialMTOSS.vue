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
        <span class="title text-bold">手动上传文件到OSS</span>
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
        >我已上传完成</el-button>
        <el-link
          v-else
          size="mini"
          type="success"
          :underline="false"
        >已完成</el-link>
      </div>
      <div style="text-align: center">
        <div style="padding: 50px; font-size: 16px;font-weight: bold">
          请手动将视频、单词音频、例句音频、图片，上传到OSS服务器上
        </div>
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
      default: 4
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
        url: this.$urlPath.finishOSSFile,
        data: {
          textBookId: this.$route.params.textbookId
        }
      }).then(res => {
        this.uploadZipLoading = false
        console.log(res)
        this.$successMsg('更改成功')
        this.$emit('uploadToOSSSuccess')
      }).catch(_ => {
        this.uploadZipLoading = false
        this.$successMsg('更改失败')
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
