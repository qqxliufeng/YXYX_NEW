<template>
  <div class="container">
    <div class="generate-content-wrapper">
      <div class="content-info">
        <el-card
          class="card-wrapper"
          :body-style="{padding: 0}"
        >
          <div
            slot="header"
            class="flex justify-between"
          >
            <span class="title text-bold">填写基本信息</span>
            <el-link
              size="mini"
              type="success"
              :underline="false"
            >已完成</el-link>
          </div>
          <div class="flex justify-center align-center flex-direction padding">
            <i class="el-icon-success success-icon" />
            <div class="success-tip">基本信息已填写完成</div>
          </div>
        </el-card>
        <generate-material-upload-excel
          :should-step="0"
          :current-step="currentProgressNo"
          @uploadExcelSuccess="addStep"
        />
        <generate-material-down-txt
          :should-step1="1"
          :should-step2="2"
          :current-step="currentProgressNo"
          @downTxtSingleSuccess="addStep"
          @downTxtExampleSuccess="addStep"
        />
        <generate-material-change-image
          :should-step="3"
          :current-step="currentProgressNo"
          @changeImageSuccess="addStep"
        />

        <generate-material-upload-zip
          :should-step="4"
          :current-step="currentProgressNo"
          @uploadZipSuccess="addStep"
        />

        <generate-material-resource-package
          :should-step="5"
          :current-step="currentProgressNo"
        />
      </div>
      <div class="step-wrapper">
        <div style="height: 500px; width: 150px">
          <el-steps
            direction="vertical"
            :active="currentProgressNo + 1"
            process-status="process"
            finish-status="success"
          >
            <el-step
              title="基本信息"
              description="教材的基本信息"
            />
            <el-step
              title="导入单词"
              description="导入单词excel文件"
            />
            <el-step
              title="下载单词"
              description="下载单词压缩包"
            />
            <el-step
              title="下载例句"
              description="下载例句压缩包"
            />
            <el-step
              title="更改名称"
              description="点击按钮更改名称"
            />
            <el-step
              title="上传文件"
              description="例句(音频)、图片、MP3(单词音频)"
            />
            <el-step
              title="生成资源"
              description="生成资源包，存储到服务器，发送移动端"
            />
          </el-steps>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import GenerateMaterialUploadExcel from './components/GenerateMaterialUploadExcel'
import GenerateMaterialDownTxt from './components/GenerateMaterialDownTxt'
import GenerateMaterialChangeImage from './components/GenerateMaterialChangeImage'
import GenerateMaterialUploadZip from './components/GenerateMaterialUploadZip'
import GenerateMaterialResourcePackage from './components/GenerateMaterialResourcePackage'
export default {
  name: 'GenerateMaterial',
  components: {
    GenerateMaterialUploadExcel,
    GenerateMaterialDownTxt,
    GenerateMaterialChangeImage,
    GenerateMaterialUploadZip,
    GenerateMaterialResourcePackage
  },
  data() {
    return {
      currentProgressNo: 0
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      this.$http({
        url: this.$urlPath.queryTextBookProgressNo,
        methods: this.HTTP_GET,
        data: {
          textbookId: this.$route.params.textbookId
        }
      }).then(res => {
        this.currentProgressNo = res.obj
      })
    },
    addStep() {
      this.currentProgressNo = this.currentProgressNo + 1
    }
  }
}
</script>
<style lang="scss" scoped>
.generate-content-wrapper {
  .content-info {
    margin-right: 25%;
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
  }
  .step-wrapper {
    position: fixed;
    top: 0;
    bottom: 0;
    right: 5%;
    display: flex;
    align-items: center;
  }
}
</style>
