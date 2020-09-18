<template>
  <div v-if="examModel">
    <el-dialog
      title="竞技场详细信息"
      :visible.sync="dialogFormVisible"
      width="60%"
      top="8vh"
    >
      <el-form
        :model="examModel"
        label-width="80px"
        class="dialog-container"
      >
        <el-form-item label="考试名称">
          <el-col :span="20">
            <el-link
              type="primary"
              :underline="false"
            >{{ examModel.examName }}</el-link>
          </el-col>
        </el-form-item>
        <el-form-item label="教材名称">
          <el-col :span="20">
            <el-link
              type="primary"
              :underline="false"
            >{{ examModel.textbookName }}</el-link>
            <el-link
              v-if="examModel.isExper === 1"
              class="margin-left"
              type="danger"
            >说明：该教材为体验教材</el-link>
          </el-col>
        </el-form-item>
        <el-form-item label="开始时间">
          <el-col :span="20">
            <el-link
              type="primary"
              :underline="false"
            >{{ examModel.beginExamTime }}</el-link>
          </el-col>
        </el-form-item>
        <el-form-item label="考试时长">
          <el-col :span="20">
            <el-link
              type="primary"
              :underline="false"
            >{{ examModel.useExamTime }}分钟</el-link>
          </el-col>
        </el-form-item>
        <el-form-item label="结束时间">
          <el-col :span="20">
            <el-link
              type="primary"
              :underline="false"
            >{{ examModel.endExamTime }}</el-link>
          </el-col>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          size="mini"
          @click="dialogFormVisible = false"
        >知道了</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'TestPaperDetails',
  props: {
    examModel: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      dialogFormVisible: false
    }
  },
  methods: {
    show() {
      this.dialogFormVisible = true
      this.getInfo()
    },
    getInfo() {
      this.$http({
        url: this.$urlPath.queryExamInfo,
        methods: this.HTTP_GET,
        data: {
          examId: this.examModel.examId
        }
      }).then(res => {
        console.log(res)
      })
    }
  }
}
</script>
