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
        <span class="title text-bold">生成资源包</span>
        <!-- <el-link
          v-if="currentStep < shouldStep"
          :loading="generateResourceLoading"
          type="danger"
        >未开始</el-link> -->
        <el-button
          :loading="generateResourceLoading"
          type="primary"
          size="mini"
          @click="generateResourcePackage"
        >生成资源包</el-button>
        <!-- <el-link
          v-else
          :loading="generateResourceLoading"
          type="success"
        >已完成</el-link> -->
      </div>
      <div
        v-if="currentStep > shouldStep"
        class="flex justify-center align-center flex-direction padding"
      >
        <i class="el-icon-success success-icon" />
        <div class="success-tip">教材资源生成成功</div>
      </div>
      <div
        v-if="currentStep < shouldStep"
        class="flex justify-center align-center flex-direction padding"
      >
        <i class="el-icon-error error-icon" />
        <div class="success-tip">等待生成</div>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'GenerateMaterialResourcePackage',
  props: {
    shouldStep: {
      type: Number,
      default: 7
    },
    currentStep: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      generateResourceLoading: false
    }
  },
  methods: {
    generateResourcePackage() {
      this.generateResourceLoading = true
      this.$http({
        url: this.$urlPath.wordZipResourceFile,
        data: {
          textbookId: this.$route.params.textbookId
        }
      }).then(res => {
        if (res.status === 200) {
          this.generateResourceLoading = false
          this.$successMsg('生成资源包成功')
          this.$closeCurrentView()
        } else {
          this.$errorMsg('生成资源包失败')
        }
      }).catch(_ => {
        this.generateResourceLoading = false
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
