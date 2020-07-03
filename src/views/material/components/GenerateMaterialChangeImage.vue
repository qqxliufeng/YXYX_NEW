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
        >进行中</el-button>
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
        <el-upload
          class="upload-wrapper"
          drag
          :action="uploadImageUrl"
          :before-upload="beforeUploadImage"
          :on-success="onUploadImageSuccess"
          :on-change="onUploadImageChange"
          :headers="headers"
          :data="postData"
          :http-request="changeImageName"
          name="imageNameZipFile"
        >
          <i class="el-icon-upload" />
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div
            slot="tip"
            class="el-upload__tip"
          >
            <div>1、图片压缩包内的文件夹命名必须为：images.zip</div>
            <div>2、文件名称不能包含中文</div>
          </div>
        </el-upload>
      </div>
      <div
        v-else-if="currentStep > shouldStep"
        class="flex justify-center align-center flex-direction padding"
      >
        <i class="el-icon-success success-icon" />
        <div class="success-tip">图片名称更改成功</div>
      </div>
      <div
        v-else
        class="flex justify-center align-center flex-direction padding"
      >
        <i class="el-icon-error error-icon" />
        <div class="success-tip">等待更改</div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { baseIp } from '../../../api/url-path'
import { getToken } from '../../../utils/auth'
import { blobToFile } from '../../../api/common'
import axios from 'axios'
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
      changeImageNameLoading: false,
      uploadImageUrl: baseIp + this.$urlPath.updateImageName,
      headers: {
        'Authorization': `Bearer ${getToken()}`
      },
      postData: {
        textbookId: this.$route.params.textbookId
      },
      zipFormData: new FormData()
    }
  },
  methods: {
    changeImageName(content) {
      this.zipFormData.append('textbookId', this.$route.params.textbookId)
      axios.post(this.uploadImageUrl, this.zipFormData, {
        headers: this.headers,
        responseType: `blob`
      }).then(res => {
        this.changeImageNameLoading = false
        if (res.status === 200) {
          this.$successMsg('文件上传成功，正在下载新的压缩文件……')
          this.$emit('changeImageSuccess')
          blobToFile(res.data, 'changed-image')
        } else {
          this.$errorMsg('文件上传失败')
        }
      }).catch(_ => {
        this.changeImageNameLoading = false
        this.$errorMsg('文件上传失败')
      })
    },
    beforeUploadImage(file) {
      if (file.name !== 'images.zip') {
        this.$errorMsg('文件名称只能为：images.zip')
        return false
      }
      this.$message('文件正常上传，请稍后……')
      this.changeImageNameLoading = true
    },
    onUploadImageSuccess(response, file, fileList) {
      this.changeImageNameLoading = false
      this.$emit('changeImageSuccess')
      this.$successMsg('文件上传成功，更改名称后自动下载新的压缩文件')
      blobToFile(response, 'changed-image')
    },
    onUploadImageChange(file, fileList) {
      this.zipFormData.append('imageNameZipFile', file.raw)
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
