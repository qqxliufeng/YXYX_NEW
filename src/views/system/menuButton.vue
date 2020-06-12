<template>
  <div class="container">
    <table-header
      :title="$route.params.menuName + '菜单下的按钮'"
      :show-add="true"
      :show-delete="false"
      :show-search="false"
      @onadd="onAdd"
    />
    <el-card :body-style="{padding: '0'}">
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
        <el-table-column align="center" prop="buttonId" label="ID" />
        <el-table-column align="center" prop="buttonSequence" label="序号" show-overflow-tooltip />
        <el-table-column align="center" prop="buttonName" label="菜单名称" />
        <el-table-column align="center" prop="buttonCode" label="菜单编码" />
        <el-table-column align="center" prop="createTime" label="创建时间" show-overflow-tooltip />
        <el-table-column
          align="center"
          label="操作"
        >
          <template slot-scope="scope">
            <el-button type="primary" :size="$style.tableButtonSize" @click="handleUpdate(scope.row)">编辑</el-button>
            <el-button type="danger" :size="$style.tableButtonSize" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import tableMixins from '../../mixins/table-mixins'
export default {
  name: 'MenuButton',
  mixins: [tableMixins],
  mounted() {
    this.getData()
  },
  methods: {
    onAdd() {},
    handleDelete(item) {
      this.$warningConfirm('是否要删除此按钮？', _ => {
        this.$http({
          url: this.$urlPath.deleteMenuButton,
          data: {
            buttonId: item.buttonId
          }
        }).then(res => {
          this.$successMsg('删除成功')
          this.getData()
        })
      })
    },
    handleUpdate() {},
    getData() {
      this.$http({
        url: this.$urlPath.queryAllButtonInMenu,
        methods: this.HTTP_GET,
        data: {
          menuId: this.$route.params.menuId
        }
      }).then(res => {
        this.loading = false
        this.tableData = res.obj
      })
    }
  }
}
</script>
