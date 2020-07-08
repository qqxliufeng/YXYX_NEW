<!--
 * @Author: your name
 * @Date: 2020-06-12 16:27:36
 * @LastEditTime: 2020-06-12 17:21:30
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Editv
 * @FilePath: /YXYX_NEW/src/views/system/GrantMenuButton.vue
-->
<template>
  <div class="container">
    <el-card :body-style="{padding: 0}">
      <div slot="header">
        <span class="text-bold">提示：请选择指定的菜单后选择对应的按钮</span>
      </div>
    </el-card>
    <el-card
      style="margin-top: 10px"
      :body-style="{padding: '20px'}"
    >
      <el-collapse v-model="menuIds">
        <el-collapse-item
          v-for="item of tableData"
          :key="item.menuId"
          :title="item.menuName"
          :name="item.menuId"
        >
          <div v-if="item.menuButtons.length > 0">
            <el-row>
              <el-col :span="22">
                <el-checkbox
                  v-for="buttonItem of item.menuButtons"
                  :key="buttonItem.buttonId"
                  v-model="buttonItem.select"
                  style="margin-bottom: 10px"
                >{{ buttonItem.buttonName }}</el-checkbox>
              </el-col>
              <el-col :span="2">
                <el-button
                  size="mini"
                  type="danger"
                  @click="confirmGrantButton(item)"
                >确定分配</el-button>
              </el-col>
            </el-row>
          </div>
          <div
            v-else
            class="text-left text-gray"
          >
            <span>该菜单下暂无按钮选项</span>
          </div>
        </el-collapse-item>
      </el-collapse>
      <!-- <el-table
        v-loading="loading"
        :stripe="tableConfig.stripe"
        :header-cell-style="tableConfig.headerCellStyle"
        :data="tableData"
        :border="tableConfig.border"
        :size="tableConfig.size"
        :default-sort="tableConfig.defalutSort"
        :style="tableConfig.style"
        default-expand-all
      >
        <el-table-column
          type="expand"
          label="展开/收缩"
          width="100"
        >
          <template slot-scope="scope">
            <div v-if="scope.row.menuButtons.length > 0">
              <el-row>
                <el-col :span="22">
                  <el-checkbox
                    v-for="item of scope.row.menuButtons"
                    :key="item.buttonId"
                    v-model="item.select"
                    style="margin-bottom: 10px"
                  >{{ item.buttonName }}</el-checkbox>
                </el-col>
                <el-col :span="2">
                  <el-button
                    size="mini"
                    type="danger"
                    class="margin-left"
                    @click="confirmGrantButton(scope.row)"
                  >确定分配</el-button>
                </el-col>
              </el-row>
            </div>
            <div
              v-else
              class="text-center"
            >
              <span>该菜单下暂无按钮选项</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="menuName"
          label="菜单名称"
          width
        />
        <el-table-column
          align="center"
          prop="menuSequence"
          label="序号"
          show-overflow-tooltip
        />
        <el-table-column
          align="center"
          prop="createTime"
          label="创建时间"
          width
        />
      </el-table> -->
    </el-card>
  </div>
</template>

<script>
import tableMixins from '../../mixins/table-mixins'
export default {
  name: 'GrantMenuButton',
  mixins: [tableMixins],
  data() {
    return {
      menuIds: []
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    confirmGrantButton(item) {
      this.$warningConfirm('确定要为该用户分配或取消这些按钮功能吗？', _ => {
        this.$http({
          url: this.$urlPath.grantButtonToUser,
          data: {
            userId: this.$route.params.userId,
            menuId: item.menuId,
            buttonIds: item.menuButtons
              .filter(it => it.select)
              .map(it => it.buttonId)
              .join(',')
          }
        }).then(res => {
          this.$successMsg('按钮分配成功')
        })
      })
    },
    getData() {
      this.$http({
        url: this.$urlPath.queryMenuAndButtonByUser,
        methods: this.HTTP_GET,
        data: {
          userId: this.$route.params.userId,
          roleId: this.$route.params.roleId
        }
      }).then(res => {
        this.loading = false
        this.tableData = res.obj
        this.menuIds = this.tableData.map(it => it.menuId)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
>>> .el-collapse-item__content {
  padding-bottom: 0;
}
</style>
