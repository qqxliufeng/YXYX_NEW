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
        <span class="title text-bold">提示：请选择指定的菜单后选择对应的按钮</span>
      </div>
    </el-card>
    <el-card style="margin-top: 10px" :body-style="{padding: 0}">
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
        <el-table-column type="expand" label="点击展开" width="100">
          <template slot-scope="scope">
            <div v-if="scope.row.menuButtons.length > 0">
              <el-checkbox
                v-for="item of scope.row.menuButtons"
                :key="item.buttonId"
                v-model="item.select"
              >{{ item.buttonName }}</el-checkbox>
              <el-button
                size="mini"
                type="danger"
                class="margin-left"
                @click="confirmGrantButton(scope.row)"
              >确定分配</el-button>
            </div>
            <div v-else class="text-center">
              <span>该菜单下暂无按钮选项</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="菜单ID" prop="menuId" />
        <el-table-column align="center" prop="menuSequence" label="序号" show-overflow-tooltip />
        <el-table-column align="center" prop="menuName" label="菜单名称" width />
        <el-table-column align="center" prop="createTime" label="创建时间" width />
      </el-table>
    </el-card>
  </div>
</template>

<script>
import tableMixins from '../../mixins/table-mixins'
export default {
  name: 'GrantMenuButton',
  mixins: [tableMixins],
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
      })
    }
  }
}
</script>
