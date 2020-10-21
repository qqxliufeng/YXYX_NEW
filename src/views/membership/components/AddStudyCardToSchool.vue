<template>
  <div>
    <el-card style="margin-top: 10px">
      <div slot="header">
        <span class="title text-bold">学习卡信息
          <el-link
            :underline="false"
            type="danger"
          >此选项只针对线上学校有效</el-link>
        </span>
      </div>
      <el-form>
        <el-form-item label="添加类型">
          <el-col :span="10">
            <el-radio-group v-model="saveType">
              <el-radio :label="0">批量</el-radio>
            </el-radio-group>
          </el-col>
        </el-form-item>
        <el-form-item label="学习卡信息：">
          <el-col :span="8">
            <el-button
              size="mini"
              type="primary"
              @click="addStudyCard"
            >添加</el-button>
          </el-col>
        </el-form-item>
        <el-form-item>
          <div v-if="studyCardParams.length > 0">
            <el-row>
              <el-col
                :span="5"
                class="text-center"
              >
                <el-link
                  :underline="false"
                  type="primary"
                >教材类别</el-link>
              </el-col>
              <el-col
                :span="5"
                class="text-center"
              >
                <el-link
                  :underline="false"
                  type="primary"
                >学习卡类型</el-link>
              </el-col>
              <el-col
                :span="5"
                class="text-center"
              >
                <el-link
                  :underline="false"
                  type="primary"
                >学习卡数量</el-link>
              </el-col>
              <el-col
                :span="5"
                class="text-center"
              >
                <el-link
                  :underline="false"
                  type="primary"
                >学习卡教材</el-link>
              </el-col>
              <el-col
                :span="4"
                class="text-center"
              >
                <el-link
                  :underline="false"
                  type="primary"
                >操作</el-link>
              </el-col>
            </el-row>
            <el-row
              v-for="item of studyCardParams"
              :key="item.id"
              style="margin-bottom: 10px; border-bottom: 1px solid #f5f5f5; padding-bottom: 5px"
            >
              <el-col
                :span="5"
                class="text-center"
              >
                <el-select
                  v-model="item.materialType"
                  placeholder="教材类别"
                  style="width: 70%"
                  @change="materialTypeChange"
                >
                  <el-option
                    v-for="materialType of $materialTypes"
                    :key="materialType.value"
                    :label="materialType.name"
                    :value="materialType.value"
                  />
                </el-select>
              </el-col>
              <el-col
                :span="5"
                class="text-center"
              >
                <el-select
                  v-model="item.cardType"
                  placeholder="学习卡类型"
                  style="width: 70%"
                  filterable
                >
                  <el-option
                    v-for="cardTypeItem of studyCardTypeList"
                    :key="cardTypeItem.value"
                    :label="cardTypeItem.label"
                    :value="cardTypeItem.value"
                  />
                </el-select>
              </el-col>
              <el-col
                :span="5"
                class="text-center"
              >
                <el-input-number
                  v-model="item.cardNum"
                  :min="1"
                  size="small"
                />
              </el-col>
              <el-col
                :span="5"
                class="text-center text-cut"
              >
                <el-link
                  :underline="false"
                  @click="selectTextBookList(item)"
                >{{ item.textbookNames || '点击选择学习卡教材' }}</el-link>
              </el-col>
              <el-col
                :span="4"
                class="text-center text-cut"
              >
                <el-button
                  size="mini"
                  type="danger"
                  @click="deleteTextBookItem(item)"
                >删除</el-button>
              </el-col>
            </el-row>
          </div>
        </el-form-item>
      </el-form>
    </el-card>
    <el-dialog
      title="教材列表"
      :visible.sync="dialogTableVisible"
    >
      <el-table
        ref="multiTable"
        v-loading="tableLoading"
        :data="textbookList"
        max-height="800px"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="55"
        />
        <el-table-column
          property="textbookId"
          label="ID"
        />
        <el-table-column
          property="textbookName"
          label="教材名称"
        />
      </el-table>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          :size="$style.dialogButtonSize"
          @click="dialogTableVisible = false"
        >取消</el-button>
        <el-button
          :size="$style.dialogButtonSize"
          type="primary"
          @click="handleTextBookConfirm"
        >确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'AddStudyCardToSchool',
  data() {
    return {
      saveType: 0,
      studyCardParams: [],
      studyCardTypeList: [
        {
          value: 'P',
          label: '小学正式卡'
        },
        {
          value: 'M',
          label: '初中正式卡'
        }
      ],
      textbookList: [],
      dialogTableVisible: false,
      tableLoading: false,
      tempStudyCardItem: null,
      multipleSelection: []
    }
  },
  methods: {
    materialTypeChange() {
      console.log('change')
      this.textbookList = []
    },
    addStudyCard() {
      const item = {
        id: new Date().getTime(),
        materialType: 0, // 教材类别，默认是词汇
        cardType: '',
        cardNum: 1, //			  学习卡数量(批量增加方式)
        cardCode: '', //		  学习卡编码(查询学习卡编码方式,暂时不增加此字段)
        textbookIds: '', //		  教材主键ID，多个用逗号隔开
        textbookNames: '',
        tempTextbookIds: []
      }
      this.studyCardParams.push(item)
    },
    selectTextBookList(item) {
      this.tempStudyCardItem = item
      this.dialogTableVisible = true
      if (this.textbookList.length === 0) {
        this.tableLoading = true
        this.$http({
          url: this.getMaterialUrl(item.materialType),
          methods: this.HTTP_GET,
          data: {
            pageNum: 0,
            pageSize: 1000
          }
        }).then(res => {
          this.tableLoading = false
          this.textbookList = res.obj.list
          if (this.textbookList && this.textbookList.length > 0) {
            this.textbookList.forEach(it => {
              this.$set(it, 'selected', false)
            })
          }
        })
      } else {
        this.textbookList.forEach(it => {
          it.selected = this.tempStudyCardItem.tempTextbookIds.includes(it.textbookId)
        })
      }
      this.$nextTick(_ => {
        this.$refs.multiTable.clearSelection()
      })
      const selectedItems = this.textbookList.filter(it => it.selected)
      if (selectedItems.length > 0) {
        this.$nextTick(_ => {
          selectedItems.forEach(row => {
            this.$refs.multiTable.toggleRowSelection(row, true)
          })
        })
      }
    },
    getMaterialUrl(type) {
      switch (type) {
        case 0 :
          return this.$urlPath.queryTextBookList
        case 1:
          return this.$urlPath.queryGrammarTextBookList
      }
    },
    deleteTextBookItem(item) {
      this.studyCardParams.splice(this.studyCardParams.indexOf(item), 1)
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleTextBookConfirm() {
      this.dialogTableVisible = false
      if (this.multipleSelection.length === 0) {
        this.tempStudyCardItem.textbookNames = ''
        this.tempStudyCardItem.tempTextbookIds = []
        return
      }
      const tempList = this.multipleSelection.map(it => {
        return { name: it.textbookName, id: it.textbookId }
      })
      this.tempStudyCardItem.textbookNames = tempList.map(it => it.name).join(',')
      this.tempStudyCardItem.tempTextbookIds = tempList.map(it => it.id)
    },
    getStudyCardInfo() {
      return {
        saveType: this.saveType,
        studyCardParams: this.studyCardParams
      }
    }
  }
}
</script>
