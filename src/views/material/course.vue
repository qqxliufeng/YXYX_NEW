<template>
  <div class="container">
    <material-table-header
      :show-course="true"
      :show-level="true"
    />
  </div>
</template>

<script>
import MaterialTableHeader from './components/MaterialTableHeader'
export default {
  name: 'Course',
  components: {
    MaterialTableHeader
  }
}
</script>

<style>
</style>
