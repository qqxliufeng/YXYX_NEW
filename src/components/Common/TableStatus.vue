<template>
  <div>
    <el-link
      :type="status.type"
      :underline="false"
    >{{ status.label }}</el-link>
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
