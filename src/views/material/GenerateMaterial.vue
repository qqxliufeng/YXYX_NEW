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
              :type="currentProgressNo > 0 ? 'success' : 'danger'"
              :underline="false"
            >{{ currentProgressNo >= 1 ? '已完成' : '未开始' }}</el-link>
          </div>
          <div
            v-if="currentProgressNo === 0"
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
              v-if="currentProgressNo < 1"
              size="mini"
              type="danger"
              :underline="false"
            >未开始</el-link>
            <el-link
              v-else-if="currentProgressNo === 1 || currentProgressNo === 2"
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
            v-if="currentProgressNo === 1 || currentProgressNo === 2"
            class="margin"
          >
            <div class="margin flex justify-between align-center">
              <el-link :underline="false">单词文件压缩包</el-link>
              <el-button
                :type="currentProgressNo === 1 ? 'primary' : 'success'"
                size="mini"
                :loading="downSingleLoading"
                :disabled="currentProgressNo !== 1"
                @click="downSingle"
              >{{ currentProgressNo === 1 ? '点击下载' : '下载成功' }}</el-button>
            </div>
            <div
              v-if="currentProgressNo === 2"
              class="margin flex justify-between align-center"
            >
              <el-link :underline="false">例句文件压缩包</el-link>
              <el-button
                :type="currentProgressNo === 2 ? 'primary' : 'success'"
                size="mini"
                :loading="downExampleLoading"
                :disabled="currentProgressNo !== 2"
                @click="downExample"
              >{{ currentProgressNo === 2 ? '点击下载' : '下载成功' }}</el-button>
            </div>
          </div>
          <div
            v-else-if="currentProgressNo > 2"
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
        <!--  start 更改图片名称 -->
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
              v-if="currentProgressNo < 3"
              size="mini"
              type="danger"
              :underline="false"
            >未开始</el-link>
            <el-button
              v-else-if="currentProgressNo === 3"
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
            v-if="currentProgressNo > 3"
            class="flex justify-center align-center flex-direction padding"
          >
            <i class="el-icon-success success-icon" />
            <div class="success-tip">图片名称更改成功</div>
          </div>
          <div
            v-if="currentProgressNo < 3"
            class="flex justify-center align-center flex-direction padding"
          >
            <i class="el-icon-error error-icon" />
            <div class="success-tip">等待更改</div>
          </div>
        </el-card>
        <!-- end 更改图片名称 -->
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
              v-if="currentProgressNo < 4"
              size="mini"
              type="danger"
              :underline="false"
            >未开始</el-link>
            <el-button
              v-else-if="currentProgressNo === 4"
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
            v-if="currentProgressNo === 4"
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
            v-else-if="currentProgressNo < 4"
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
        <el-card
          class="card-wrapper"
          :body-style="{padding: 0}"
        >
          <div
            slot="header"
            class="flex justify-between"
          >
            <span class="title text-bold">生成资源包</span>
            <el-link
              v-if="currentProgressNo < 5"
              :loading="generateResourceLoading"
              type="danger"
            >未开始</el-link>
            <el-button
              v-else-if="currentProgressNo === 5"
              :loading="generateResourceLoading"
              type="primary"
              size="mini"
              @click="generateResourcePackage"
            >生成资源包</el-button>
            <el-link
              v-else
              :loading="generateResourceLoading"
              type="success"
            >已完成</el-link>
          </div>
          <div
            v-if="currentProgressNo > 5"
            class="flex justify-center align-center flex-direction padding"
          >
            <i class="el-icon-success success-icon" />
            <div class="success-tip">教材资源生成成功</div>
          </div>
          <div
            v-if="currentProgressNo < 5"
            class="flex justify-center align-center flex-direction padding"
          >
            <i class="el-icon-error error-icon" />
            <div class="success-tip">等待生成</div>
          </div>
        </el-card>
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
import generateMaterialMixins from '../../mixins/generate-material-mixins'
export default {
  name: 'GenerateMaterial',
  mixins: [generateMaterialMixins],
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
    }
  }
}
</script>
<style lang="scss" scoped>
>>> .el-upload-dragger {
  width: 210px;
  height: 150px;
}
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
