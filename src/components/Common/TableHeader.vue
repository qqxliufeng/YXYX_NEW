<template>
  <div style="margin-bottom: 5px">
    <el-card :body-style="{padding: '0px'}">
      <div
        slot="header"
        class="flex align-center"
      >
        <el-link
          :underline="false"
          @click="collapsed"
        >{{ title }}
          <i
            v-if="canCollapse"
            :class="isCollapse ? 'el-icon-caret-bottom' : 'el-icon-caret-top'"
          />
        </el-link>
        <div class="flex-sub">
          <slot name="center" />
        </div>
        <el-button
          v-if="showAdd"
          type="warning"
          size="mini"
          icon="el-icon-plus"
          @click="onadd"
        >添加</el-button>
        <el-button
          v-if="showDelete"
          type="danger"
          size="mini"
          icon="el-icon-delete"
          @click="ondelete"
        >批量删除</el-button>
        <slot name="other" />
      </div>
      <el-collapse-transition>
        <div v-if="isCollapse && showSearch && formModelArray.length > 0">
          <el-row>
            <el-col :span="22">
              <el-form
                :inline="true"
                size="small"
                :gutter="5"
              >
                <el-form-item
                  v-for="item of formModelArray"
                  :key="item.id"
                  :label="item.label"
                  style="padding: 10px"
                >
                  <el-input
                    v-if="item.type === 'input'"
                    v-model="item.value"
                    placeholder="请输入内容"
                    clearable
                  />
                  <el-cascader
                    v-else-if="item.type === 'address'"
                    v-model="item.value"
                    :options="level"
                    :props="{label: 'name', value: 'name'}"
                    clearable
                  />
                  <el-select
                    v-else-if="item.type === 'select'"
                    v-model="item.value"
                    clearable
                  >
                    <el-option
                      v-for="it of item.selectOptions"
                      :key="it.value"
                      :label="it.label"
                      :value="it.value"
                    />
                  </el-select>
                </el-form-item>
              </el-form>
            </el-col>
            <el-col
              :span="2"
              style="margin-top: 10px; text-align: right; padding-right: 10px"
            >
              <el-button
                v-if="showSearch && formModelArray.length > 0"
                type="primary"
                size="mini"
                icon="el-icon-search"
                @click="onsearch"
              >查询</el-button>
            </el-col>
          </el-row>
        </div>
      </el-collapse-transition>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'TableHeader',
  props: {
    title: {
      type: String,
      default: '查询内容'
    },
    formModelArray: {
      type: Array,
      default: _ => {
        return []
      }
    },
    showAdd: {
      type: Boolean,
      default: true
    },
    showDelete: {
      type: Boolean,
      default: true
    },
    showSearch: {
      type: Boolean,
      default: true
    },
    canCollapse: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      level: this.$privinceData,
      isCollapse: true
    }
  },
  watch: {
    isCollapse() {
      setTimeout(_ => {
        this.$emit('table-header-collapse')
      }, 350)
    }
  },
  methods: {
    onadd() {
      this.$emit('onadd')
    },
    ondelete() {
      this.$emit('ondelete')
    },
    onsearch() {
      this.$emit('onsearch')
    },
    collapsed() {
      if (!this.canCollapse) {
        return
      }
      this.isCollapse = !this.isCollapse
    }
  }
}
</script>

<style lang="scss" scoped>
>>> .el-card__header {
  padding: 10px;
}
>>> .el-form-item {
  margin-bottom: 0px;
}
</style>
