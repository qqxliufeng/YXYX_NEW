<template>
  <div>
    <el-dialog
      :title="title"
      :visible.sync="dialogChartVisible"
      width="60%"
      top="8vh"
    >
      <div class="text-right padding">
        选择月份
        <el-select
          v-model="selectMonth"
          size="mini"
          @change="onMonthChange"
        >
          <el-option
            v-for="item in months"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </div>
      <div
        id="echart"
        :class="className"
        :style="{height:height,width:width}"
      />
      <div class="text-center padding-bottom text-lg text-bold text-black">
        学习时长趋势图
      </div>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          size="mini"
          @click="dialogChartVisible = false"
        >我知道了</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from '@/mixins/resize'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '98%'
    },
    height: {
      type: String,
      default: '400px'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    xAxisData: {
      type: Array,
      required: true
    },
    chartData: {
      type: Array,
      required: true
    },
    title: {
      type: String,
      default: '分析图'
    },
    months: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      chart: null,
      dialogChartVisible: false,
      selectMonth: ''
    }
  },
  watch: {
    months(newVal) {
      if (newVal && newVal.length > 0) {
        this.selectMonth = newVal[0]
        this.$emit('onMonthChange', this.selectMonth)
      }
    }
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    onMonthChange(month) {
      this.$emit('onMonthChange', month)
    },
    show() {
      if (this.dialogChartVisible) {
        this.$nextTick(() => {
          this.chart || this.initChart()
          this.chart && this.chart.resize()
          this.setOptions(this.chartData)
        })
      } else {
        this.dialogChartVisible = true
        this.selectMonth = this.months[0]
        this.$nextTick(() => {
          this.chart || this.initChart()
          this.chart && this.chart.resize()
          this.setOptions(this.chartData)
        })
      }
    },
    initChart() {
      this.chart = echarts.init(document.getElementById('echart'), 'macarons')
    },
    setOptions(chartData = []) {
      this.chart && this.chart.setOption({
        xAxis: {
          name: '日期',
          data: this.xAxisData,
          boundaryGap: false,
          axisTick: {
            show: false
          },
          axisLabel: {
            rotate: '80'
          }
        },
        grid: {
          left: 10,
          right: 10,
          bottom: 20,
          top: 30,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        yAxis: {
          name: '时长(单位:分)',
          axisTick: {
            show: false
          }
        },
        legend: {
          data: ['expected']
        },
        series: [{
          name: '', itemStyle: {
            normal: {
              color: '#FF005A',
              lineStyle: {
                color: '#FF005A',
                width: 2
              }
            }
          },
          smooth: true,
          type: 'line',
          data: chartData,
          animationDuration: 2800,
          animationEasing: 'cubicInOut'
        }
        ]
      })
    }
  }
}
</script>
