<template>
  <div>
    <!--  选择的单词  -->
    <el-drawer
      :visible.sync="drawerWordList"
      direction="rtl"
      :with-header="false"
      :size="$isPhone ? '80%' : '50%'"
    >
      <div class="padding">
        <div class="flex justify-between align-center">
          <el-button
            type="primary"
            size="mini"
            @click="drawerWordList = false"
          >关闭</el-button>
          <el-button
            v-if="!readOnly"
            type="primary"
            size="mini"
            @click="confirmRandomWordList"
          >确定</el-button>
        </div>
        <el-table
          v-loading="randomWordLoading"
          :stripe="tableConfig.stripe"
          :header-cell-style="tableConfig.headerCellStyle"
          :data="randomWordList"
          :border="tableConfig.border"
          :size="tableConfig.size"
          :default-sort="tableConfig.defalutSort"
          :style="tableConfig.style"
          height="90vh"
        >
          <el-table-column
            align="center"
            label="单词"
            prop="wordCode"
          />
          <el-table-column
            align="center"
            label="解释"
            prop="wordExplain"
          />
          <el-table-column
            v-if="!readOnly"
            align="center"
            label="操作"
          >
            <template slot-scope="scope">
              <el-button
                :disabled="lockRandomWord"
                :size="$style.tableButtonSize"
                type="primary"
                @click="replaceItem(scope.row)"
              >替换</el-button>
              <el-button
                :disabled="lockRandomWord"
                :size="$style.tableButtonSize"
                type="danger"
                @click="deleteItem(scope.row)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-drawer>

    <!--  要替换的所有单词  -->
    <el-drawer
      :visible.sync="drawerAllWordList"
      direction="rtl"
      :with-header="false"
      :size="$isPhone ? '80%' : '40%'"
    >
      <div class="padding">
        <div class="flex justify-between align-center">
          <el-button
            type="primary"
            size="mini"
            @click="drawerAllWordList = false"
          >关闭</el-button>
          <el-input
            v-model="likeWord"
            placeholder="请输入单词"
            size="small"
            style="width: 80%"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="searchWord"
            />
          </el-input>
        </div>
        <el-table
          v-loading="allWordLoading"
          :stripe="tableConfig.stripe"
          :header-cell-style="tableConfig.headerCellStyle"
          :data="allWordList"
          :border="tableConfig.border"
          :size="tableConfig.size"
          :default-sort="tableConfig.defalutSort"
          :style="tableConfig.style"
          height="85vh"
        >
          <el-table-column
            align="center"
            label="单词"
            prop="wordCode"
          />
          <el-table-column
            align="center"
            label="解释"
            prop="wordExplain"
          />
          <el-table-column
            align="center"
            label="操作"
          >
            <template slot-scope="scope">
              <el-button
                :size="$style.tableButtonSize"
                type="primary"
                @click="confirmReplaceItem(scope.row)"
              >选择</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="text-center">
          <el-pagination
            layout="prev, pager, next"
            :total="allWordPageModel.total"
            @current-change="currentChange"
            @prev-click="prevClick"
            @next-click="nextClick"
          />
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import tableMixins from '@/mixins/table-mixins'
export default {
  name: 'WordList',
  mixins: [tableMixins],
  props: {
    randomWordModel: {
      type: Object,
      default: null
    },
    allWordModel: {
      type: Object,
      default: null
    },
    likeWordModel: {
      type: Object,
      default: null
    },
    queryInfoModel: {
      type: Object,
      default: null
    },
    lockRandomWord: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      drawerWordList: false,
      drawerAllWordList: false,
      randomWordLoading: false,
      randomWordList: [],
      allWordLoading: false,
      allWordList: [],
      allWordPageModel: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      replacedItem: null,
      likeWord: '',
      readOnly: false
    }
  },
  methods: {
    show(init) {
      this.drawerWordList = true
      if (init) {
        this.getRandomWordList()
      }
    },
    showReadOnly() {
      this.readOnly = true
      this.drawerWordList = true
      if (!this.queryInfoModel) return
      this.randomWordLoading = true
      this.$http({
        url: this.queryInfoModel.url,
        methods: this.HTTP_GET,
        data: this.queryInfoModel.data
      }).then(res => {
        this.randomWordLoading = false
        this.randomWordList = res.obj
      })
    },
    getRandomWordList() {
      this.randomWordLoading = true
      this.$http({
        url: this.randomWordModel.url,
        methods: this.HTTP_GET,
        data: this.randomWordModel.data
      }).then(res => {
        this.randomWordLoading = false
        this.randomWordList = res.obj
      })
    },
    getRandomWord() {
      return this.randomWordList
    },
    replaceItem(item) {
      this.replacedItem = item
      this.drawerAllWordList = true
      this.allWordPageModel.currentPage = 1
      this.getAllWordList()
    },
    deleteItem(item) {
      this.randomWordList.splice(this.randomWordList.indexOf(item), 1)
    },
    getAllWordList() {
      this.allWordModel.data.pageNum = this.page
      this.allWordModel.data.pageSize = this.pageSize
      this.$http({
        url: this.allWordModel.url,
        methods: this.HTTP_GET,
        data: this.allWordModel.data
      }).then(res => {
        this.allWordLoading = false
        this.allWordList = res.obj.list
        this.allWordPageModel.total = res.obj.total
      })
    },
    searchWord() {
      if (!this.likeWord) {
        this.page = 1
        this.getAllWordList()
        return
      }
      this.allWordLoading = true
      this.likeWordModel.data.wordCode = this.likeWord
      this.$http({
        url: this.likeWordModel.url,
        methods: this.HTTP_GET,
        data: this.likeWordModel.data
      }).then(res => {
        this.allWordLoading = false
        this.allWordList = res.obj
      })
    },
    confirmReplaceItem(item) {
      if (this.replacedItem) {
        if (this.randomWordList.find(it => it.wordId === item.wordId)) {
          this.$errorMsg('该单词已经存在，请更换')
          return
        }
        this.drawerAllWordList = false
        this.randomWordList.splice(this.randomWordList.indexOf(this.replacedItem), 1, item)
        this.replacedItem = null
      } else {
        this.$errorMsg('请先选择要替换的单词')
      }
    },
    confirmRandomWordList() {
      this.drawerWordList = false
      this.$emit('lockRandom', true)
    },
    prevClick(page) {
      this.allWordPageModel.currentPage = page
    },
    nextClick(page) {
      this.allWordPageModel.currentPage = page
    },
    currentChange(page) {
      this.allWordPageModel.currentPage = page
      this.allWordLoading = true
      this.getAllWordList()
    }
  }
}
</script>

<style>
</style>
