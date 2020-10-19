<template>
  <div class="container">
    <table-header
      ref="tableHeader"
      title="选择教材"
      :form-model-array="formModelArray"
      :show-delete="false"
      :show-add="true"
      :show-search="true"
      :can-collapse="false"
      @onsearch="onSearch"
      @onadd="onAdd"
    >
      <template slot="center">
        <el-select
          v-model="textBookId"
          class="margin-left"
          size="small"
          placeholder="请选择教材"
        >
          <el-option
            v-for="item of materialList"
            :key="item.textbookId"
            :label="item.textbookName"
            :value="item.textbookId"
          />
        </el-select>
      </template>
    </table-header>
    <el-card
      ref="tableContainer"
      :body-style="{padding: 0}"
      class="table-container"
      :style="tableCardStyle"
    >
      <el-table
        ref="table"
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
          label="序号"
          fixed="left"
          width="100"
        >
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <!-- aOption: null
        answer: "名词"
        bOption: null
        cOption: null
        courseCode: "1"
        createId: 1
        createTime: 1603096065000
        dOption: null
        dr: 0
        eOption: null
        knowledgeId: 1
        levelCode: "1-1"
        practiceId: 287
        status: 0
        subject: "表示人、地、事、物名称的词叫做______："
        subjectType: 1
        textBookId: 25
        updateId: null
        updateTime: null -->
        <el-table-column
          align="center"
          prop="subject"
          label="题目"
          width="300"
        />
        <el-table-column
          align="center"
          prop="answer"
          label="答案"
          width="150"
        >
          <template slot-scope="scope">
            <div v-if="scope.row.subjectType === 1">{{ scope.row.answer }}</div>
            <el-link v-else type="primary" size="mini" @click="showAnswerList(scope.row)">{{ scope.row.answer }}</el-link>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="createTime"
          label="创建时间"
          width="160"
        >
          <template slot-scope="scope">
            <div>{{ scope.row.createTime | parseTime }}</div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="status"
          label="状态"
        >
          <template slot-scope="scope">
            <table-status :status="statusFormatter(scope.row)" />
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="操作"
          fixed="right"
          width="200"
        >
          <template slot-scope="scope">
            <el-button
              type="primary"
              :size="$style.tableButtonSize"
              @click="handlerUpdate(scope.row)"
            >编辑</el-button>
            <el-button
              type="danger"
              :size="$style.tableButtonSize"
              @click="deleteItem(scope.row)"
            >删除</el-button>
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
    <!-- 显示答案选项列表 -->
    <el-dialog
      title="选项"
      :visible.sync="dialogAnswerListVisible"
    >
      <el-form v-if="tempItem" class="dialog-container">
        <el-form-item label="选项A">
          <el-col :span="$style.dialogColSpan">
            <el-link :type="tempItem.answer.indexOf('A') !== -1 ? 'success' : 'danger'">
              {{ tempItem && tempItem.aOption }}
            </el-link>
          </el-col>
        </el-form-item>
        <el-form-item label="选项B">
          <el-col :span="$style.dialogColSpan">
            <el-link>
              {{ tempItem && tempItem.bOption }}
            </el-link>
          </el-col>
        </el-form-item>
        <el-form-item label="选项C">
          <el-col :span="$style.dialogColSpan">
            <el-link>
              {{ tempItem && tempItem.cOption }}
            </el-link>
          </el-col>
        </el-form-item>
        <el-form-item label="选项D">
          <el-col :span="$style.dialogColSpan">
            <el-link>
              {{ tempItem && tempItem.dOption }}
            </el-link>
          </el-col>
        </el-form-item>
        <el-form-item label="选项E">
          <el-col :span="$style.dialogColSpan">
            <el-link>
              {{ tempItem && tempItem.eOption }}
            </el-link>
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
          @click="dialogAnswerListVisible = false"
        >我知道了</el-button>
      </div>
    </el-dialog>
    <!-- 显示答案选项列表 -->
  </div>
</template>

<script>
import tableMixins from '@/mixins/table-mixins'
import materialMixins from '@/mixins/material-mixins'
export default {
  name: 'GrammarPractise',
  mixins: [tableMixins, materialMixins],
  data() {
    return {
      formModelArray: [
        {
          id: 1,
          value: '',
          label: '课程编码',
          name: 'textBookId',
          span: 5,
          type: 'select',
          selectOptions: []
        },
        {
          id: 2,
          value: '',
          label: '关卡编码',
          name: 'textBookId',
          span: 5,
          type: 'select',
          selectOptions: []
        },
        {
          id: 3,
          value: '',
          label: '知识点',
          name: 'textBookId',
          span: 5,
          type: 'select',
          selectOptions: []
        }
      ],
      textBookId: '',
      dialogAnswerListVisible: false,
      tempItem: null
    }
  },
  watch: {
    textBookId(newVal, oldVal) {
      this.getData()
    }
  },
  mounted() {
    this.getMaterialList(this.$urlPath.queryGrammarTextBookList, _ => {
      this.textBookId = this.materialList[0].textbookId
    })
  },
  methods: {
    statusFormatter(item) {
      switch (item.status) {
        case 0:
          return {
            label: '正常',
            value: 0
          }
        case 1:
          return {
            label: '禁用',
            value: 1
          }
      }
    },
    onAdd() {},
    getData() {
      this.$http({
        url: this.$urlPath.queryPracticeList,
        methods: this.HTTP_GET,
        data: {
          pageNum: this.page,
          pageSize: this.pageSize,
          textBookId: this.textBookId
        }
      }).then(res => {
        this.onSuccess(res.obj)
      })
    },
    showAnswerList(item) {
      this.tempItem = item
      this.dialogAnswerListVisible = true
    }
  }
}
</script>

<style>

</style>
