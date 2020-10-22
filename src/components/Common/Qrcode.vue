<template>
  <div>
    <el-dialog
      title="学习卡二维码"
      :visible.sync="dialogFormVisible"
      width="40%"
    >
      <div>
        <div class="text-center margin-tb"><canvas id="canvas" class="canvas" /></div>
        <h3 class="text-center">{{ code }}</h3>
      </div>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          size="mini"
          @click="dialogFormVisible = false"
        >我知道了</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import QRCode from 'qrcode'
export default {
  name: 'Qrcode',
  data() {
    return {
      dialogFormVisible: false,
      code: ''
    }
  },
  methods: {
    show(code) {
      this.code = code
      this.dialogFormVisible = true
      this.$nextTick(_ => {
        QRCode.toCanvas(document.getElementById('canvas'), code, (error) => {
          if (error) console.error(error)
          console.log('success!')
        })
      })
    }
  }
}
</script>

<style scoped>
.canvas{
  width: 200px !important;
  height: 200px !important;
}
</style>
