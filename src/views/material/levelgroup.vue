<template>
  <div class="container">
    <material-table-header
      :show-course="true"
      :show-level="true"
      @on-change-value="onChangeValue"
    />
  </div>
</template>

<script>
import MaterialTableHeader from './components/MaterialTableHeader'
import tableMixins from '../../mixins/table-mixins'
export default {
  name: 'LevelGroup',
  components: {
    MaterialTableHeader
  },
  mixins: [tableMixins],
  methods: {
    onChangeValue() { }
  }
}
</script>
