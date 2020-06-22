<template>
  <div>
    <el-tag
      :type="status.type"
      effect="dark"
      size="mini"
    >{{ status.label }}</el-tag>
  </div>
</template>

<script>
export default {
  name: 'TableStatus',
  props: {
    status: {
      type: Object,
      default: () => {
        return {
          label: '正常',
          type: 'primary'
        }
      }
    }
  }
}
</script>
