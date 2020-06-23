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
        <span class="title text-bold">导入单词</span>
        <el-link
          size="mini"
          :type="currentStep > shouldStep ? 'success' : 'danger'"
          :underline="false"
        >{{ currentStep >= shouldStep + 1 ? '已完成' : '未开始' }}</el-link>
      </div>
      <div
        v-if="currentStep === shouldStep"
        style="text-align: center"
      >
        <el-upload
          class="upload-wrapper"
          drag
          :action="uploadExcelUrl"
          :before-upload="beforeUploadExcel"
          :on-success="onUploadExcelSuccess"
          :on-error="onUploadExcelError"
          :headers="headers"
          :data="postData"
          name="excelFile"
        >
          <i class="el-icon-upload" />
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div
            slot="tip"
            class="el-upload__tip"
          >只能上传Excel文件</div>
        </el-upload>
      </div>
      <div
        v-else
        class="flex justify-center align-center flex-direction padding"
      >
        <i class="el-icon-success success-icon" />
        <div class="success-tip">文件导入成功</div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { baseIp } from '@/api/url-path'
import { getToken } from '@/utils/auth'
export default {
  name: 'GenerateMaterialUploadExcel',
  props: {
    shouldStep: {
      type: Number,
      default: 0
    },
    currentStep: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      uploadExcelUrl: baseIp + this.$urlPath.importTextBook,
      headers: {
        'Authorization': `Bearer ${getToken()}`
      },
      postData: {
        textbookId: this.$route.params.textbookId
      }
    }
  },
  methods: {
    beforeUploadExcel(file) {
      const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      if (!isExcel) {
        this.$errorMsg('只能上传Excel文件')
        return false
      }
    },
    onUploadExcelSuccess(response, file, fileList) {
      if (response && response.status === 200) {
        this.$emit('uploadExcelSuccess')
      } else {
        this.$errorMsg(response.msg)
      }
    },
    onUploadExcelError(err, file, fileList) {
      console.log(err)
      this.$errorMsg('文件上传失败')
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
