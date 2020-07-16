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
        <span class="title text-bold">上传文件</span>
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
        >提交</el-button>
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
        <el-row>
          <el-col :span="8">
            <el-upload
              class="upload-wrapper"
              drag
              action="http://"
              :on-change="changeExampleZip"
              :on-remove="removeExampleZip"
              :auto-upload="false"
            >
              <i class="el-icon-upload" />
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
              <div
                slot="tip"
                class="el-upload__tip"
              >上传例句文件zip</div>
            </el-upload>
          </el-col>
          <el-col :span="8">
            <el-upload
              class="upload-wrapper"
              drag
              action="http://"
              :on-change="changeImageZip"
              :on-remove="removeImageZip"
              :auto-upload="false"
            >
              <i class="el-icon-upload" />
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
              <div
                slot="tip"
                class="el-upload__tip"
              >上传图片文件zip</div>
            </el-upload>
          </el-col>
          <el-col :span="8">
            <el-upload
              class="upload-wrapper"
              drag
              action="http://"
              :on-change="changeMP3Zip"
              :on-remove="removeMP3Zip"
              :auto-upload="false"
            >
              <i class="el-icon-upload" />
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
              <div
                slot="tip"
                class="el-upload__tip"
              >上传mp3文件zip</div>
            </el-upload>
          </el-col>
        </el-row>
      </div>
      <div
        v-else-if="currentStep < shouldStep"
        class="flex justify-center align-center flex-direction padding"
      >
        <i class="el-icon-error error-icon" />
        <div class="success-tip">等待上传</div>
      </div>
      <div
        v-else
        class="flex justify-center align-center flex-direction padding"
      >
        <i class="el-icon-success success-icon" />
        <div class="success-tip">文件上传成功</div>
      </div>
    </el-card>
  </div>
</template>

<script>
import axios from 'axios'
import { baseIp } from '../../../api/url-path'
import { getToken } from '../../../utils/auth'
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
      uploadZipUrl: baseIp + this.$urlPath.importAudioAndImage,
      uploadZipLoading: false,
      zipFormData: new FormData(),
      headers: {
        'Authorization': `Bearer ${getToken()}`
      }
    }
  },
  methods: {
    changeExampleZip(file, fileList) {
      this.zipFormData.append('egsZipFile', file.raw)
    },
    changeImageZip(file, fileList) {
      this.zipFormData.append('imageZipFile', file.raw)
    },
    changeMP3Zip(file, fileList) {
      this.zipFormData.append('mp3ZipFile', file.raw)
    },
    removeExampleZip(file, fileList) {
      this.zipFormData.delete('egsZipFile')
    },
    removeImageZip(file, fileList) {
      this.zipFormData.delete('imageZipFile')
    },
    removeMP3Zip(file, fileList) {
      this.zipFormData.delete('mp3ZipFile')
    },
    submitZip() {
      if (this.zipFormData.get('egsZipFile') === null) {
        this.$errorMsg('请上传例句zip文件')
        return
      }
      if (this.zipFormData.get('imageZipFile') === null) {
        this.$errorMsg('请上传图片zip文件')
        return
      }
      if (this.zipFormData.get('mp3ZipFile') === null) {
        this.$errorMsg('请上传mp3 zip文件')
        return
      }
      if (!this.zipFormData.has('textBookId')) {
        this.zipFormData.append('textBookId', this.$route.params.textbookId)
      }
      this.uploadZipLoading = true
      axios.post(this.uploadZipUrl, this.zipFormData, {
        headers: this.headers
      }).then(res => {
        this.uploadZipLoading = false
        if (res.status === 200) {
          if (res.data.status === 200) {
            this.$successMsg('文件上传成功')
            this.$emit('uploadZipSuccess')
          } else {
            this.$errorMsg(res.data.msg)
          }
        } else {
          this.$errorMsg('文件上传失败')
        }
      }).catch(_ => {
        this.uploadZipLoading = false
        this.$errorMsg('文件上传失败')
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
