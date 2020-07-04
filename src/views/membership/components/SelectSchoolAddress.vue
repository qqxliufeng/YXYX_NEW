<template>
  <div>
    <baidu-map
      class="map-wrapper"
      :center="center"
      :zoom="16"
      ak="oW2UEhdth2tRbEE4FUpF9E5YVDCIPYih"
    >
      <bm-local-search
        :keyword="addressKeyword"
        :auto-viewport="false"
        :location="center"
        :panel="false"
        @searchcomplete="searchComplete"
      />
    </baidu-map>
  </div>
</template>

<script>
import BaiduMap from 'vue-baidu-map/components/map/Map'
import BmLocalSearch from 'vue-baidu-map/components/search/LocalSearch'
export default {
  name: 'SelectSchoolAddress',
  components: {
    BaiduMap,
    BmLocalSearch
  },
  data() {
    return {
      center: '济南'
    }
  }
}
</script>

<style>
</style>
