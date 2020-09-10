<template>
  <div v-if="arenaModel">
    <el-dialog
      title="竞技场详细信息"
      :visible.sync="dialogFormVisible"
      width="60%"
      top="8vh"
    >
      <el-form
        :model="arenaModel"
        label-width="80px"
        class="dialog-container"
      >
        <el-form-item label="比赛名称">
          <el-col :span="20">
            <el-link
              type="primary"
              :underline="false"
            >{{ arenaModel.arenaName }}</el-link>
          </el-col>
        </el-form-item>
        <el-form-item label="教材名称">
          <el-col :span="20">
            <el-link
              type="primary"
              :underline="false"
            >{{ arenaModel.textbookName }}</el-link>
            <el-link
              v-if="arenaModel.isExper === 1"
              class="margin-left"
              type="danger"
            >说明：该教材为体验教材</el-link>
          </el-col>
        </el-form-item>
        <el-form-item label="课程信息">
          <el-col :span="20">
            <el-link
              type="primary"
              :underline="false"
            >{{ arenaModel.courseNames }}</el-link>
          </el-col>
        </el-form-item>
        <el-form-item label="所选单词">
          <el-col :span="20">
            <el-button
              type="danger"
              size="mini"
              @click="getRandomWordList"
            >查看单词</el-button>
          </el-col>
        </el-form-item>
        <el-form-item label="所选题型">
          <el-col :span="20">
            <el-col :span="20">
              <el-checkbox-group
                v-model="questionType"
                disabled
              >
                <el-checkbox
                  v-for="item of subjectTypes"
                  :key="item.value"
                  :label="item.value"
                >
                  {{ item.name }}
                </el-checkbox>
              </el-checkbox-group>
            </el-col>
          </el-col>
        </el-form-item>
        <el-form-item label="开始时间">
          <el-col :span="20">
            <el-link
              type="primary"
              :underline="false"
            >{{ arenaModel.beginArenaTime }}</el-link>
          </el-col>
        </el-form-item>
        <el-form-item label="比赛时长">
          <el-col :span="20">
            <el-link
              type="primary"
              :underline="false"
            >{{ arenaModel.useArenaTime }}分钟</el-link>
          </el-col>
        </el-form-item>
        <el-form-item label="截止时间">
          <el-col :span="20">
            <el-link
              type="primary"
              :underline="false"
            >{{ arenaModel.endArenaTime }}</el-link>
          </el-col>
        </el-form-item>
        <el-form-item label="报名截止">
          <el-col :span="20">
            <el-link
              type="primary"
              :underline="false"
            >{{ arenaModel.comeInArenaEndTime }}</el-link>
          </el-col>
        </el-form-item>
        <el-form-item label="参赛学校">
          <el-col :span="20">
            <el-button
              v-if="isSuperAdmin"
              type="primary"
              size="small"
              @click="openSchoolList"
            >查看参赛学校</el-button>
            <el-link v-else>
              4123456
            </el-link>
          </el-col>
        </el-form-item>
        <el-form-item label="参赛学生">
          <el-col :span="20">
            <el-button
              v-if="isSuperAdmin"
              type="primary"
              size="small"
              @click="openJoinStu"
            >查看参赛学生</el-button>
            <el-button
              v-if="isSuperAdmin"
              type="danger"
              size="small"
              @click="openUnJoinStu"
            >查看未参赛学生</el-button>
          </el-col>
        </el-form-item>
        <el-form-item label="奖品设置">
          <el-col :span="20">
            <el-link
              v-if="arenaModel.rewardType === 0"
              type="primary"
              :underline="false"
            >线下奖励</el-link>
            <el-link
              v-else
              type="primary"
              :underline="false"
            >线上奖励</el-link>
          </el-col>
        </el-form-item>
        <el-form-item v-if="arenaModel.rewardType === 0">
          <div>
            <el-link
              type="danger"
              :underline="false"
            >1-3名：{{ arenaModel.offlineReward13 }}</el-link>
          </div>
          <div>
            <el-link
              type="danger"
              :underline="false"
            >4-10名：{{ arenaModel.offlineReward410 }}</el-link>
          </div>
        </el-form-item>
        <el-form-item v-else>
          <div>
            <el-link
              type="danger"
              :underline="false"
            >
              排名前10名者，可获得优币奖励，详情如下：<br>
              第一名：100优币<br>
              第二名：95优币<br>
              第三名：90优币<br>
              第四名：85优币<br>
              第五名：80优币<br>
              第六名：75优币<br>
              第七名：70优币<br>
              第八名：65优币<br>
              第九名：60优币<br>
              第十名：55优币<br>
            </el-link>
          </div>
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
    <el-drawer
      :visible.sync="drawerSchoolList"
      direction="rtl"
      :with-header="false"
    >
      <div class="padding">
        <div class="flex justify-between align-center">
          <el-button
            type="primary"
            size="mini"
            @click="drawerSchoolList = false"
          >确定</el-button>
        </div>
        <el-table
          ref="multipleTable"
          v-loading="loading"
          :stripe="tableConfig.stripe"
          :header-cell-style="tableConfig.headerCellStyle"
          :data="schoolList"
          :border="tableConfig.border"
          :size="tableConfig.size"
          :default-sort="tableConfig.defalutSort"
          :style="tableConfig.style"
          height="80vh"
        >
          <el-table-column
            align="center"
            label="学校名称"
            prop="schoolName"
          />
          <el-table-column
            align="center"
            label="学校状态"
            prop="schoolName"
          >
            <template slot-scope="scope">
              <el-link
                :underline="false"
                :type="scope.row.isOnLine === 0 ? 'primary' : 'danger' "
              >{{ scope.row.isOnLine === 0 ? '线下学校': '线上学校' }}</el-link>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-drawer>
    <!--  选择的单词  -->
    <el-drawer
      :visible.sync="drawerWordList"
      direction="rtl"
      :with-header="false"
      size="40%"
    >
      <div class="padding">
        <div class="flex justify-between align-center">
          <el-button
            type="primary"
            size="mini"
            @click="drawerWordList = false"
          >关闭</el-button>
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
            align="center"
            label="题型"
          >
            <template slot-scope="scoped">
              {{ scoped.row.questionType | questionTypeFilter }}
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import userMixins from '@/mixins/user-mixins'
import tableMixins from '@/mixins/table-mixins'
export default {
  name: 'ArenaDetails',
  filters: {
    questionTypeFilter(item) {
      switch (item) {
        case 1:
          return '拼写(填空题)'
        case 2:
          return '听力(选择)'
        case 3:
          return '看图(选择)'
        case 4:
          return '句子翻译(选择)'
        case 5:
          return '单词翻译(汉译英、选择题)'
        case 6:
          return '英译汉'
      }
    }
  },
  mixins: [userMixins, tableMixins],
  props: {
    arenaModel: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      dialogFormVisible: false,
      drawerSchoolList: false,
      drawerWordList: false,
      randomWordLoading: false,
      randomWordList: [],
      schoolList: [],
      subjectTypes: [
        {
          name: '拼写(填空题)',
          value: 1
        },
        {
          name: '听力(选择)',
          value: 2
        },
        {
          name: '看图(选择)',
          value: 3
        },
        {
          name: '句子翻译(选择)',
          value: 4
        },
        {
          name: '单词翻译(汉译英、选择题)',
          value: 5
        },
        {
          name: '英译汉',
          value: 6
        }
      ]
      // arenaModel: {
      //   name: '',
      //   textBookId: '',
      //   courseCodes: [],
      //   wordsNum: 20,
      //   questionType: [],
      //   beginArenaTime: new Date().getTime() + 10 * 60 * 1000,
      //   useArenaTime: 60,
      //   arenaEndTime: 0,
      //   selectedSchoolList: [],
      //   rewardType: 0,
      //   offlineReward13: '',
      //   offlineReward410: '',
      //   replacedItem: null,
      //   lockRandomWord: false
      // }
    }
  },
  computed: {
    questionType() {
      return this.arenaModel ? this.arenaModel.questionType.split(',').map(it => parseInt(it)) : []
    }
  },
  methods: {
    showDialog() {
      this.dialogFormVisible = true
    },
    getRandomWordList() {
      this.drawerWordList = true
      this.randomWordLoading = true
      this.$http({
        url: this.$urlPath.queryArenaWordList,
        methods: this.HTTP_GET,
        data: {
          arenaId: this.arenaModel.arenaId
        }
      }).then(res => {
        this.randomWordLoading = false
        this.randomWordList = res.obj
      })
    },
    openJoinStu() {
      this.$http({
        url: this.$urlPath.queryArenaJoinStudentList,
        methods: this.HTTP_GET,
        data: {
          arenaId: this.arenaModel.arenaId
        }
      }).then(res => {
        console.log(res)
      })
    },
    openUnJoinStu() {
      this.$http({
        url: this.$urlPath.queryArenaUnJoinStudentList,
        methods: this.HTTP_GET,
        data: {
          arenaId: this.arenaModel.arenaId
        }
      }).then(res => {
        console.log(res)
      })
    },
    openSchoolList() {
      this.drawerSchoolList = true
      this.$http({
        url: this.$urlPath.queryArenaSchoolList,
        methods: this.HTTP_GET,
        data: {
          arenaId: this.arenaModel.arenaId
        }
      }).then(res => {
        this.loading = false
        this.schoolList = res.obj
      })
    }
  }
}
</script>

<style>
</style>
