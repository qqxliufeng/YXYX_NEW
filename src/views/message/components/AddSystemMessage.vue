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
              <el-radio-button
                v-if="isSuperAdmin"
                :label="3"
              >全平台</el-radio-button>
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
            <el-button
              v-if="messageModel.sendType !== 3 && (messageModel.schools.length > 0 || messageModel.classes.length > 0 || messageModel.students.lenght > 0)"
              size="small"
              type="success"
              class="margin-left"
              @click="seeTarget"
            >查看列表</el-button>
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
    <SelectTargetList
      ref="selectTargetList"
      @confirm="selectedTargetConfirm"
    />
    <TargetDetails ref="targetDetails" />
  </div>
</template>

<script>
import userMixins from '@/mixins/user-mixins'
import SelectTargetList from './SelectTargetList'
import TargetDetails from './TargetDetails'
export default {
  name: 'AddSystemMessage',
  components: { SelectTargetList, TargetDetails },
  mixins: [userMixins],
  data() {
    return {
      dialogFormVisible: false,
      loading: false,
      messageModel: {
        title: '',
        messageContent: '',
        sendType: this.isSuperAdmin ? 3 : 0, // 0学校 1班级 2个人 3全平台
        schools: [], // 学校主键ID
        classes: [], // 班级主键ID
        students: [] // 学生主键ID
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
  watch: {
    'messageModel.sendType'() {
      this.messageModel.schools = []
      this.messageModel.classes = []
      this.messageModel.students = []
    }
  },
  methods: {
    showDialog() {
      this.loading = false
      this.messageModel = {
        title: '',
        messageContent: '',
        sendType: this.isSuperAdmin ? 3 : 0,
        schools: [], // 学校主键ID
        classes: [], // 班级主键ID
        students: [] // 学生主键ID
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

      if (this.messageModel.sendType === 0 && this.messageModel.schools.length === 0) {
        this.$errorMsg('请至少选择一个学校')
        return
      }
      if (this.messageModel.sendType === 1 && this.messageModel.classes.length === 0) {
        this.$errorMsg('请至少选择一个班级')
        return
      }
      if (this.messageModel.sendType === 2 && this.messageModel.students.length === 0) {
        this.$errorMsg('请至少选择一个学生')
        return
      }
      const systemMessageToList = []
      this.messageModel.sendType === 0 && this.messageModel.schools.forEach(item => {
        systemMessageToList.push({
          schoolId: item.schoolId
        })
      })
      this.messageModel.sendType === 1 && this.messageModel.classes.forEach(item => {
        systemMessageToList.push({
          schoolId: item.schoolId,
          classId: item.classId
        })
      })
      this.messageModel.sendType === 2 && this.messageModel.students.forEach(item => {
        systemMessageToList.push({
          schoolId: item.schoolId,
          classId: item.classId,
          studentId: item.studentId
        })
      })
      this.loading = true
      this.$http({
        url: this.$urlPath.saveSystemMessage,
        data: {
          title: this.messageModel.title,
          messageContent: this.messageModel.messageContent,
          sendType: this.messageModel.sendType,
          systemMessageToList: systemMessageToList,
          createSchoolId: this.$store.getters.schoolId
        },
        contentType: 'application/json; charset=UTF-8'
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
      this.$refs.selectTargetList.showSchoolList(this.messageModel.sendType)
    },
    seeTarget() {
      let data = null
      if (this.messageModel.sendType === 0) {
        data = this.messageModel.schools
      } else if (this.messageModel.sendType === 1) {
        data = this.messageModel.classes
      } else if (this.messageModel.sendType === 2) {
        data = this.messageModel.students
      }
      this.$refs.targetDetails.show({}, data)
    },
    selectedTargetConfirm({ mode = 0, val }) {
      if (mode === 0) {
        this.messageModel.schools = val
      } else if (mode === 1) {
        this.messageModel.classes = val
      } else if (mode === 2) {
        this.messageModel.students = val
      }
    }
  }
}
</script>
