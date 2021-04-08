<template>
  <!--gutter：间隔-->
  <!--lg,md,sm,xs分别表示多少px？
     .col-xs- 超小屏幕 手机 (<768px)
     .col-sm- 小屏幕 平板 (≥768px)
     .col-md- 中等屏幕 桌面显示器 (≥992px)
     .col-lg- 大屏幕 大桌面显示器 (≥1200px)-->
  <div >
    <Row :gutter="40" type="flex" justify="center" v-for="(row) in listTemp">
      <i-col :xs="12" :md="8" :lg="4" v-for="(infor,j) in row" :key="`infor-${j}`" style="height: 180px;padding-bottom: 50px;">
        <infor-card shadow :color="infor.color" :icon="infor.icon" :icon-size="36">
          <count-to :end="infor.count" count-class="count-style"></count-to>
          <p>{{ infor.title }}</p>
        </infor-card>
      </i-col>
    </Row>
  </div>
</template>

<script>
import InforCard from '_c/info-card'
import CountTo from '_c/count-to'
import { ChartPie, ChartBar } from '_c/charts'
export default {
  name: 'home',
  components: {
    InforCard,
    CountTo,
  },
  data () {
    return {
      inforCardData: [
        { title: '房东数量', icon: 'ios-person', count: 100, color: '#2d8cf0' },
        { title: '房屋数量', icon: 'ios-home', count: 100, color: '#19be6b' },
        { title: '门锁数量', icon: 'ios-unlock', count: 100, color: '#ff9900' },
        { title: '用户数量', icon: 'ios-person-outline', count: 70, color: '#ed3f14' },
        { title: '正常锁具', icon: 'md-lock', count: 90, color: '#2d8cf0' },
        { title: '故障锁具', icon: 'ios-construct', count: 10, color: '#19be6b' },
        { title: '自用', icon: 'md-person', count: 0, color: '#ff9900' },
        { title: '租用', icon: 'md-people', count: 100, color: '#ed3f14' },

      ],
    }
  },
  computed: {
    listTemp: function () {
      let list = this.inforCardData;
      let arrTemp = [];
      let index = 0;
      let sectionCount = 4;
      for (let i = 0; i < list.length; i++) {
        index = parseInt(i / sectionCount);
        if (arrTemp.length <= index) {
          arrTemp.push([]);
        }
        arrTemp[index].push(list[i]);
      }
      return arrTemp;
    }
  },
  mounted () {
    //
  }
}
</script>

<style lang="less">
.count-style{
  font-size: 50px;
}
</style>
