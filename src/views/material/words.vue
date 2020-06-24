<template>
  <div class="container">
    <el-card :body-style="{padding: 0}">
      <div slot="header">
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
            />
            <el-button
              style="height: 30px"
              type="primary"
              :size="$style.tableButtonSize"
              @click="onSearch"
            >搜索</el-button>
          </div>
        </el-col>
      </el-row>
    </el-card>
    <el-card :body-style="{padding: 0}">
      <el-table
        v-loading="loading"
        :stripe="tableConfig.stripe"
        :header-cell-style="tableConfig.headerCellStyle"
        :data="tableData"
        :border="tableConfig.border"
        :size="tableConfig.size"
        :default-sort="tableConfig.defalutSort"
        :style="tableConfig.style"
      >
        <!-- 单词	音标	解释	易混词	课程	发音	例句	例句解释	操作 -->
        <!-- audioAddr: "/home/books/10/mp3//1.mp3"
        confWord1: "in"
        confWord2: "white"
        confWord3: "the"
        confWordList: null
        courseCode: "1"
        createId: 1
        createTime: 1585124434000
        dr: 0
        exampAudioAddr: "/home/books/10/egs//1.mp3"
        exampExplanation: "嗨，辛迪！你好吗？"
        exampSentence: "Hi, Cindy! How are you?"
        groupCode: "1-1-1"
        levelCode: "1-1"
        spellAnswer: "Hi"
        spellQuestion: "________, Cindy! How are you?"
        status: 0
        textbookId: 1
        updateId: null
        updateTime: null
        wordCode: "hi"
        wordExplain: "interj.(用于打招呼)嗨；喂"
        wordId: 1
        wordImageAddr: "/home/books/10/image//1"
        wordSounds: "[haɪ]" -->
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
                :src="baseIp + scope.row.audioAddr"
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
          min-width="250"
          fixed="right"
        >
          <template slot-scope="scope">
            <el-button
              type="primary"
              :size="$style.tableButtonSize"
              @click="handlerUpdate(scope.row)"
            >编辑</el-button>
            <el-button
              type="warning"
              :size="$style.tableButtonSize"
              @click="wordInfo(scope.row)"
            >详情</el-button>
            <el-dropdown
              style="display: inline-block; margin-left: 10px"
              :size="$style.tableButtonSize"
              type="success"
              split-button
              @command="handleWordCommand"
            >
              更多
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :command="{tag: 1, item: scope.row}">查看已授权的学校</el-dropdown-item>
                <el-dropdown-item :command="{tag: 2, item: scope.row}">生成/编辑教材</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
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
  </div>
</template>

<script>
import tableMixins from '../../mixins/table-mixins'
import { baseIp } from '../../api/url-path'
import { Loading } from 'element-ui'
export default {
  name: 'Words',
  mixins: [tableMixins],
  data() {
    return {
      baseIp,
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
      ]
    }
  },
  watch: {
    materialId(newVal, oldVal) {
      this.getData(newVal)
    }
  },
  mounted() {
    this.getMaterialList()
  },
  methods: {
    getMaterialList() {
      const loadingInstance = Loading.service({
        target: document.getElementsByClassName('container')[0]
      })
      this.$http({
        url: this.$urlPath.queryTextBookList,
        methods: this.HTTP_GET,
        data: {
          pageNum: 0,
          pageSize: 1000
        }
      }).then(res => {
        this.$nextTick(_ => {
          loadingInstance.close()
        })
        this.materialList = res.obj.list
        if (this.materialList && this.materialList.length > 0) {
          this.materialId = this.materialList[0].textbookId
        }
      }).catch(error => {
        console.log(error)
        this.$nextTick(_ => {
          loadingInstance.close()
        })
      })
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
      audio.play()
    },
    onSearch() {
      this.page = 1
      this.$http({
        url: this.$urlPath.queryWordInfoListLike,
        methods: this.HTTP_GET,
        data: {
          wordCode: this.formModelArray[0].value,
          pageNum: this.page,
          pageSize: this.pageSize
        }
      }).then(res => {
        this.onSuccess(res.obj)
      })
    },
    handlerUpdate(item) { },
    wordInfo(item) { },
    handleWordCommand() {
    }
  }
}
</script>
<style lang="scss" scoped>
>>> .el-divider--vertical {
  height: 2em;
}
</style>
