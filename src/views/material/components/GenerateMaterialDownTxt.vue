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
        <span class="title text-bold">下载文件</span>
        <el-link
          v-if="currentStep < shouldStep1"
          size="mini"
          type="danger"
          :underline="false"
        >未开始</el-link>
        <el-link
          v-else-if="currentStep === shouldStep1 || currentStep === shouldStep2"
          size="mini"
          type="warning"
          :underline="false"
        >进行中</el-link>
        <el-link
          v-else
          size="mini"
          type="success"
          :underline="false"
        >已完成</el-link>
      </div>
      <div
        v-if="currentStep === shouldStep1 || currentStep === shouldStep2"
        class="margin"
      >
        <div class="margin flex justify-between align-center">
          <el-link :underline="false">单词文件压缩包</el-link>
          <el-button
            :type="currentStep === shouldStep1 ? 'primary' : 'success'"
            size="mini"
            :loading="downSingleLoading"
            :disabled="currentStep !== shouldStep1"
            @click="downSingle"
          >{{ currentStep === shouldStep1 ? '点击下载' : '下载成功' }}</el-button>
        </div>
        <div
          v-if="currentStep === shouldStep2"
          class="margin flex justify-between align-center"
        >
          <el-link :underline="false">例句文件压缩包</el-link>
          <el-button
            :type="currentStep === shouldStep2 ? 'primary' : 'success'"
            size="mini"
            :loading="downExampleLoading"
            :disabled="currentStep !== shouldStep2"
            @click="downExample"
          >{{ currentStep === shouldStep2 ? '点击下载' : '下载成功' }}</el-button>
        </div>
      </div>
      <div
        v-else-if="currentStep > shouldStep2"
        class="flex justify-center align-center flex-direction padding"
      >
        <i class="el-icon-success success-icon" />
        <div class="success-tip">文件下载成功</div>
      </div>
      <div
        v-else
        class="flex justify-center align-center flex-direction padding"
      >
        <i class="el-icon-error error-icon" />
        <div class="success-tip">等待下载</div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { blobToFile } from '../../../api/common'
export default {
  name: 'GenerateMaterialDownTxt',
  props: {
    shouldStep1: {
      type: Number,
      default: 1
    },
    shouldStep2: {
      type: Number,
      default: 2
    },
    currentStep: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      downSingleLoading: false,
      downExampleLoading: false
    }
  },
  methods: {
    downSingle() {
      this.downSingleLoading = true
      this.$http({
        url: this.$urlPath.uploadTextBookWordTxt,
        methods: this.HTTP_GET,
        data: {
          textBookId: this.$route.params.textbookId
        },
        responseType: `blob`
      }).then(res => {
        this.downSingleLoading = false
        blobToFile(res)
        this.$emit('downTxtSingleSuccess')
      }).catch(_ => {
        this.downSingleLoading = false
      })
    },
    downExample() {
      this.downExampleLoading = true
      this.$http({
        url: this.$urlPath.uploadTextBookEgsTxt,
        methods: this.HTTP_GET,
        data: {
          textBookId: this.$route.params.textbookId
        },
        responseType: `blob`
      }).then(res => {
        this.downExampleLoading = false
        blobToFile(res)
        this.$emit('downTxtExampleSuccess')
      }).catch(_ => {
        this.downExampleLoading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
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
