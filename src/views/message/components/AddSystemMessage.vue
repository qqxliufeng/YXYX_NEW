<template>
  <div>
    <el-dialog
      title="创建消息"
      :visible.sync="dialogFormVisible"
      :width="$isPhone ? '90%' : '60%'"
      top="8vh"
    >
      <el-form
        :model="messageModel"
        label-width="80px"
        class="dialog-container"
      >
        <el-form-item label="消息标题">
          <el-col :span="22">
            <el-input
              v-model="messageModel.title"
              placeholder="请输入消息标题（必填）"
              maxlength="50"
            />
          </el-col>
        </el-form-item>
        <el-form-item label="消息内容">
          <el-col :span="22">
            <el-input
              v-model="messageModel.messageContent"
              type="textarea"
              placeholder="请输入消息内容（必填）"
              maxlength="500"
              :rows="10"
              show-word-limit
            />
          </el-col>
        </el-form-item>
        <el-form-item label="目标群体">
          <el-col :span="20">
            <el-radio-group
              v-model="messageModel.sendType"
              size="small"
            >
              <el-radio-button :label="3">全平台</el-radio-button>
              <el-radio-button :label="0">学校</el-radio-button>
              <el-radio-button :label="1">班级</el-radio-button>
              <el-radio-button :label="2">个人</el-radio-button>
            </el-radio-group>
            <el-button
              v-if="messageModel.sendType !== 3"
              size="small"
              type="danger"
              class="margin-left"
              @click="selectTarget"
            >{{ selectTip }}</el-button>
          </el-col>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          size="mini"
          @click="dialogFormVisible = false"
        >取 消</el-button>
        <el-button
          type="primary"
          size="mini"
          :loading="loading"
          @click="submitSystemMessage"
        >{{ loading ? '发布中…' : '确  定' }}</el-button>
      </div>
    </el-dialog>
    <SelectTargetList ref="selectTargetList" />
  </div>
</template>

<script>
import userMixins from '@/mixins/user-mixins'
import SelectTargetList from './SelectTargetList'
export default {
  name: 'AddSystemMessage',
  components: { SelectTargetList },
  mixins: [userMixins],
  data() {
    return {
      dialogFormVisible: false,
      loading: false,
      messageModel: {
        title: '',
        messageContent: '',
        sendType: this.isSuperAdmin ? 3 : 1, // 0学校 1班级 2个人 3全平台
        schoolId: '', // 学校主键ID
        classId: '', // 班级主键ID
        studentId: '' // 学生主键ID
      }
    }
  },
  computed: {
    selectTip() {
      if (this.messageModel.sendType === 0) {
        return '请选择学校'
      } else if (this.messageModel.sendType === 1) {
        return '请选择班级'
      } else if (this.messageModel.sendType === 2) {
        return '请选择学生'
      } else {
        return ''
      }
    }
  },
  methods: {
    showDialog() {
      this.loading = false
      this.messageModel = {
        title: '',
        messageContent: '',
        sendType: this.isSuperAdmin ? 3 : 1,
        schoolId: '',
        classId: '',
        studentId: ''
      }
      this.dialogFormVisible = true
    },
    submitSystemMessage() {
      if (!this.messageModel.title) {
        this.$errorMsg('请输入消息标题')
        return
      }
      if (!this.messageModel.messageContent) {
        this.$errorMsg('请输入消息内容')
        return
      }
      this.loading = true
      this.$http({
        url: this.$urlPath.saveSystemMessage,
        data: {
          title: this.messageModel.title,
          messageContent: this.messageModel.messageContent,
          sendType: this.messageModel.sendType
        }
      }).then(res => {
        this.loading = false
        this.dialogFormVisible = false
        this.$successMsg('发布成功')
        this.$emit('reload')
      }).catch(_ => {
        this.loading = false
      })
    },
    selectTarget() {
      this.$refs.selectTargetList.showList(this.messageModel.sendType)
    }
  }
}
</script>
