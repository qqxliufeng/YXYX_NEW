<template>
  <div class="container">
    <el-card
      ref="tableHeader"
      :body-style="{padding: 0}"
    >
      <div
        slot="header"
        class="title text-bold text-sm"
      >
        请选择教材
      </div>
      <el-row style="padding: 10px">
        <el-col :span="8">
          <div class="flex">
            <el-link :underline="false">选择教材</el-link>
            <el-select
              v-model="materialId"
              class="flex-sub"
              style="margin-left: 10px"
              placeholder="请选择教材"
            >
              <el-option
                v-for="item of materialList"
                :key="item.textbookId"
                :label="item.textbookName"
                :value="item.textbookId"
              />
            </el-select>
          </div>
        </el-col>
        <el-col
          :span="1"
          class="text-center"
          style="margin-top: 2px"
        >
          <el-divider direction="vertical" />
        </el-col>
        <el-col :span="15">
          <div class="flex align-center">
            <el-link :underline="false">单词内容</el-link>
            <el-input
              v-model="formModelArray[0].value"
              placeholder="单词内容"
              class="flex-sub margin-lr-lg"
              clearable
            />
            <el-button
              style="height: 30px"
              type="primary"
              :size="$style.tableButtonSize"
              icon="el-icon-search"
              @click="onSearch"
            >搜索</el-button>
          </div>
        </el-col>
      </el-row>
    </el-card>
    <el-card
      ref="tableContainer"
      :body-style="{padding: 0}"
      class="table-container"
      :style="tableCardStyle"
    >
      <el-table
        v-loading="loading"
        :stripe="tableConfig.stripe"
        :header-cell-style="tableConfig.headerCellStyle"
        :data="tableData"
        :border="tableConfig.border"
        :size="tableConfig.size"
        :default-sort="tableConfig.defalutSort"
        :style="tableConfig.style"
        :height="tableConfig.style.myHeight"
      >
        <el-table-column
          align="center"
          prop="wordCode"
          label="单词"
          fixed="left"
          width="90"
        />
        <el-table-column
          align="center"
          prop="wordSounds"
          label="音标"
          min-width="180"
        />
        <el-table-column
          align="center"
          prop="wordExplain"
          label="解释"
          min-width="180"
        />
        <el-table-column
          align="center"
          label="易混词"
          min-width="180"
        >
          <template slot-scope="scope">
            <div>
              {{ scope.row.confWord1 + ',' + scope.row.confWord2 + ',' + scope.row.confWord3 }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="audio"
          label="发音"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              size="mini"
              style="font-size: 30px"
              icon="el-icon-video-play"
              @click="playAudio(scope.row)"
            >
              <audio
                :id="scope.row.audioAddr"
                :src="baseImageIp + scope.row.audioAddr"
              />
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="例句"
          prop="exampSentence"
          min-width="180"
        />
        <el-table-column
          align="center"
          label="例句解释"
          prop="exampExplanation"
          min-width="180"
        />
        <el-table-column
          align="center"
          label="操作"
          fixed="right"
        >
          <template slot-scope="scope">
            <el-button
              type="warning"
              :size="$style.tableButtonSize"
              @click="wordInfo(scope.row)"
            >详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <table-foot
      :total="total"
      :page-size="pageSize"
      :page-num="page"
      @prev-click="prevClick"
      @next-click="nextClick"
      @current-change="currentChange"
      @refresh="reloadData"
    />
    <!-- 单词详情对话框 -->
    <el-dialog
      title="单词详情"
      :visible.sync="dialogInfoVisible"
      top="10vh"
    >
      <el-form class="dialog-container">
        <el-form-item label="单词名称">
          <el-col
            :span="$style.dialogColSpan"
            class="text-right"
          >
            <el-link
              type="primary"
              :underline="false"
            >
              {{ tempWord.wordCode }}
            </el-link>
          </el-col>
        </el-form-item>
        <el-form-item
          label="单词音标"
          class="text-right"
        >
          <el-col :span="$style.dialogColSpan">
            <el-button
              type="text"
              size="mini"
              style="font-size: 16px"
              @click="playDialogAudio"
            >
              <i
                class="el-icon-video-play"
                style="font-size: 20px; color: red;"
              />
              <audio
                :id="'dialog-' + tempWord.audioAddr"
                :src="baseImageIp + tempWord.audioAddr"
              />
              {{ tempWord.wordSounds }}
            </el-button>
          </el-col>
        </el-form-item>
        <el-form-item
          label="单词解释"
          class="text-right"
        >
          <el-col :span="$style.dialogColSpan">
            <el-link
              type="primary"
              :underline="false"
            >
              {{ tempWord.wordExplain }}
            </el-link>
          </el-col>
        </el-form-item>
        <el-form-item
          label="易混词"
          class="text-right"
        >
          <el-col :span="$style.dialogColSpan">
            <el-link
              type="primary"
              :underline="false"
            >
              {{ tempWord.confWord1 + '，' + tempWord.confWord2 + '，' + tempWord.confWord3 }}
            </el-link>
          </el-col>
        </el-form-item>
        <el-form-item
          label="单词例句"
          class="text-right"
        >
          <el-col :span="$style.dialogColSpan">
            <el-button
              type="text"
              size="mini"
              style="font-size: 16px;"
              @click="playExampleAudio(tempWord)"
            >
              <i
                class="el-icon-video-play"
                style="font-size: 20px; color: red;"
              />
              <audio
                id="dialog-audio-player"
                :src="baseImageIp + tempWord.exampAudioAddr"
              />
              {{ tempWord.exampSentence }}
            </el-button>
          </el-col>
        </el-form-item>
        <el-form-item
          label="例句解释"
          class="text-right"
        >
          <el-col :span="$style.dialogColSpan">
            <el-link
              type="primary"
              :underline="false"
            >
              {{ tempWord.exampExplanation }}
            </el-link>
          </el-col>
        </el-form-item>
        <el-form-item
          label="拼写问题"
          class="text-right"
        >
          <el-col :span="$style.dialogColSpan">
            <el-link
              type="primary"
              :underline="false"
            >
              {{ tempWord.spellQuestion }}
            </el-link>
          </el-col>
        </el-form-item>
        <el-form-item
          label="拼写答案"
          class="text-right"
        >
          <el-col :span="$style.dialogColSpan">
            <el-link
              type="primary"
              :underline="false"
            >
              {{ tempWord.spellAnswer }}
            </el-link>
          </el-col>
        </el-form-item>
        <el-form-item
          label="所属关卡"
          class="text-right"
        >
          <el-col :span="$style.dialogColSpan">
            <el-link
              type="primary"
              :underline="false"
            >
              {{ tempWord.levelCode }}
            </el-link>
          </el-col>
        </el-form-item>
        <el-form-item
          label="所属分组"
          class="text-right"
        >
          <el-col :span="$style.dialogColSpan">
            <el-link
              type="primary"
              :underline="false"
            >
              {{ tempWord.groupCode }}
            </el-link>
          </el-col>
        </el-form-item>
        <el-form-item
          label="创建时间"
          class="text-right"
        >
          <el-col :span="$style.dialogColSpan">
            <el-link
              type="primary"
              :underline="false"
            >
              {{ tempWord.createTime | parseTime }}
            </el-link>
          </el-col>
        </el-form-item>
        <el-form-item
          label="单词图片"
          class="text-right"
        >
          <el-col :span="$style.dialogColSpan">
            <div class="text-right">
              <el-image
                :src="baseImageIp + tempWord.wordImageAddr"
                style="width: 100px; height: 100px"
              />
            </div>
          </el-col>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          :size="$style.dialogButtonSize"
          type="primary"
          @click="dialogInfoVisible = false"
        >知道了</el-button>
      </div>
    </el-dialog>
    <!-- 单词详情对话框 -->
  </div>
</template>

<script>
import tableMixins from '../../mixins/table-mixins'
import { baseImageIp } from '../../api/url-path'
export default {
  name: 'Words',
  mixins: [tableMixins],
  data() {
    return {
      baseImageIp,
      materialId: '',
      materialList: [],
      formModelArray: [
        {
          id: 1,
          value: '',
          label: '单词内容',
          name: 'wordCode',
          span: 5,
          type: 'input'
        }
      ],
      dialogInfoVisible: false,
      tempWord: {}
    }
  },
  watch: {
    materialId(newVal, oldVal) {
      this.formModelArray.forEach(it => {
        it.value = ''
      })
      this.getData(newVal)
    },
    tableData(newVal) {
      if (newVal && newVal.length > 0) {
        newVal.forEach(it => {
          if (it.audioAddr) it.audioAddr = it.audioAddr.replace('/opt/nginx/yxvue/dist', '')
          if (it.exampAudioAddr) it.exampAudioAddr = it.exampAudioAddr.replace('/opt/nginx/yxvue/dist', '')
          if (it.wordImageAddr) it.wordImageAddr = it.wordImageAddr.replace('/opt/nginx/yxvue/dist', '')
        })
      }
    }
  },
  mounted() {
    this.getMaterialList()
  },
  methods: {
    initData() {
      this.likeSearchUrl = this.$urlPath.queryWordInfoListLike
    },
    getMaterialList() {
      this.$showLoading(closeLoading => {
        this.$http({
          url: this.$urlPath.queryTextBookList,
          methods: this.HTTP_GET,
          data: {
            pageNum: 0,
            pageSize: 1000
          }
        }).then(res => {
          closeLoading()
          this.materialList = res.obj.list
          if (this.materialList && this.materialList.length > 0) {
            this.materialId = this.materialList[0].textbookId
          } else {
            this.loading = false
          }
        }).catch(_ => {
          closeLoading()
        })
      })
    },
    externalParam(form) {
      form.textbookId = this.materialId
    },
    getData() {
      if (!this.materialId) {
        this.$errorMsg('暂没有相关的教材')
        return
      }
      this.$http({
        url: this.$urlPath.queryWordInfoList,
        methods: this.HTTP_GET,
        data: {
          textbookId: this.materialId,
          pageNum: this.page,
          pageSize: this.pageSize
        }
      }).then(res => {
        this.onSuccess(res.obj)
      })
    },
    playAudio(item) {
      const audio = document.getElementById(item.audioAddr)
      if (audio !== null && item.audioAddr !== null) {
        audio.play()
      } else {
        this.$errorMsg('单词播放失败，请检查播放地址是否正常')
      }
    },
    playDialogAudio() {
      const audio = document.getElementById('dialog-' + this.tempWord.audioAddr)
      if (audio !== null && this.tempWord.audioAddr !== null) {
        audio.play()
      } else {
        this.$errorMsg('单词播放失败，请检查播放地址是否正常')
      }
    },
    playExampleAudio(item) {
      const audio = document.getElementById('dialog-audio-player')
      if (audio === null) {
        this.$errorMsg('例句播放失败，请检查播放地址是否正常')
        return
      }
      if (audio.paused) {
        audio.play()
      }
    },
    handlerUpdate(item) { },
    wordInfo(item) {
      this.tempWord = item
      this.dialogInfoVisible = true
    },
    handleWordCommand() {
    }
  }
}
</script>
<style lang="scss" scoped>
>>> .el-divider--vertical {
  height: 2em;
}
>>> .el-card__header {
  padding: 10px;
}
</style>
