import { baseIp } from '@/api/url-path'
import { getToken } from '@/utils/auth'
import { blobToFile } from '@/api/common'
import axios from 'axios'
export default {
  data() {
    return {
      uploadExcelUrl: baseIp + this.$urlPath.importTextBook,
      uploadZipUrl: baseIp + this.$urlPath.importAudioAndImage,
      headers: {
        'Authorization': `Bearer ${getToken()}`
      },
      postData: {
        textbookId: this.$route.params.textbookId
      },
      currentProgressNo: 0,
      downSingleLoading: false,
      downExampleLoading: false,
      uploadZipLoading: false,
      generateResourceLoading: false,
      zipFormData: new FormData()
    }
  },
  methods: {
    beforeUploadExcel(file) {
      console.log(file)
      const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      if (!isExcel) {
        this.$errorMsg('只能上传Excel文件')
        return false
      }
    },
    onUploadExcelSuccess(response, file, fileList) {
      if (response && response.status === 200) {
        this.currentProgressNo = this.currentProgressNo + 1
      } else {
        this.$errorMsg(response.msg)
      }
    },
    onUploadExcelError(err, file, fileList) {
      console.log(err)
      this.$errorMsg('文件上传失败')
    },
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
        console.log(res)
        blobToFile(res)
        this.currentProgressNo = this.currentProgressNo + 1
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
        this.currentProgressNo = this.currentProgressNo + 1
      }).catch(_ => {
        this.downExampleLoading = false
      })
    },

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
      this.zipFormData.append('textBookId', this.$route.params.textbookId)
      this.uploadZipLoading = true
      axios.post(this.uploadZipUrl, this.zipFormData, {
        headers: this.headers
      }).then(res => {
        this.uploadZipLoading = false
        if (res.status === 200) {
          if (res.data.status === 200) {
            this.$successMsg('文件上传成功')
            this.currentProgressNo = this.currentProgressNo + 1
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
    },
    generateResourcePackage() {
      this.generateResourceLoading = true
      this.$http({
        url: this.$urlPath.wordZipResourceFile,
        data: {
          textbookId: this.$route.params.textbookId
        }
      }).then(res => {
        this.generateResourceLoading = false
        this.$successMsg('生成资源包成功')
        this.$closeCurrentView()
      }).catch(_ => {
        this.generateResourceLoading = false
      })
    }
  }
}
