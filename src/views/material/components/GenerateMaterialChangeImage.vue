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
        <span class="title text-bold">更改图片名称</span>
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
          :loading="changeImageNameLoading"
          @click="changeImageName"
        >更改名称</el-button>
        <el-link
          v-else
          size="mini"
          type="success"
          :underline="false"
        >已完成</el-link>
      </div>
      <div
        v-if="currentStep > shouldStep"
        class="flex justify-center align-center flex-direction padding"
      >
        <i class="el-icon-success success-icon" />
        <div class="success-tip">图片名称更改成功</div>
      </div>
      <div
        v-if="currentStep < shouldStep"
        class="flex justify-center align-center flex-direction padding"
      >
        <i class="el-icon-error error-icon" />
        <div class="success-tip">等待更改</div>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'GenerateMaterialChangeImage',
  props: {
    shouldStep: {
      type: Number,
      default: 3
    },
    currentStep: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      changeImageNameLoading: false
    }
  },
  methods: {
    changeImageName() {
      this.$confirm(`<ul>
                    <li>操作之前，请确保备份图片资源</li>
                    <li>请使用Windows操作系统，不支持其它操作系统</li>
                    <li>图片格式只能为jpg/jpeg</li>
                    <li>请将图片保存在<strong style="color: red">D://books/images/${this.$route.params.textbookId}</strong>目录下面</li>
                    <li>此操作后期不可更改撤改，请谨慎操作</li>
                    </ul>`, '重要提示', {
        dangerouslyUseHTMLString: true,
        cancelButtonText: '再想想',
        confirmButtonText: '确定更改'
      }).then(_ => {
        this.changeImageNameLoading = true
        this.$http({
          url: this.$urlPath.updateImageName,
          methods: this.HTTP_GET,
          data: {
            textbookId: this.$route.params.textbookId
          }
        }).then(res => {
          this.changeImageNameLoading = false
          this.$emit('changeImageSuccess')
        }).catch(_ => {
          this.changeImageNameLoading = false
        })
      }).catch(_ => {
        console.log('error了')
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
