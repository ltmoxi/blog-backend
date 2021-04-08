<style scoped>
    .time{
        font-size: 12px;
    }
    .content{
        padding-left: 5px;
        font-size: 14px;
        font-weight: bold;
        color: #0968F7;
    }
    .time1{
        font-size: 12px;
    }
    .content1{
        padding-left: 5px;
        font-size: 14px;
        font-weight: bold;
        color: #57C43C;
    }
    .time2{
        font-size: 12px;
    }
    .content2{
        padding-left: 5px;
        font-size: 14px;
        font-weight: bold;
        color: red;
    }
</style>

<template>
  <!--gutter：间隔-->
  <!--lg,md,sm,xs分别表示多少px？
     .col-xs- 超小屏幕 手机 (<768px)
     .col-sm- 小屏幕 平板 (≥768px)
     .col-md- 中等屏幕 桌面显示器 (≥992px)
     .col-lg- 大屏幕 大桌面显示器 (≥1200px)-->
  <div>
    <Row :gutter="40" type="flex" justify="center" v-for="(row) in listTemp">
      <i-col :xs="12" :md="8" :lg="4" v-for="(infor,j) in row" :key="`infor-${j}`" style="height: 150px;padding-bottom: 50px;">
        <infor-card shadow :color="infor.color" :icon="infor.icon" :icon-size="36">
          <count-to :end="infor.count" count-class="count-style"></count-to>
          <p>{{ infor.title }}</p>
        </infor-card>
      </i-col>
    </Row>
    <h1><span style="margin-left: 220px;">公告栏</span></h1>
      <Scroll :on-reach-bottom="handleReachTop" loading-text="已加载全部" style="width: 800px">
            <TimelineItem color="#0968F7">
                    <Icon type="md-volume-down" slot="dot" size="20"></Icon>
                    <span>注意：</span>
            </TimelineItem>
        <Card dis-hover v-for="(item, index) in list" :key="index"  style="margin: 0px 0 ; border:0px">
            <TimelineItem>
              <p class="time"> {{ item.createTime }}</p>
              <p class="content"> {{ item.notice }}</p>
            </TimelineItem>
        </Card>
     </Scroll>
     <h2><span style="margin-left: 220px;">表扬</span>
         <span style="margin-left: 380px;">批评</span>
     </h2>
      <Scroll :on-reach-bottom="handleReachTop1" loading-text="已加载全部" style="width: 380px;margin-left:215px">
         <TimelineItem color="green">
                    <Icon type="md-volume-down" slot="dot" size="20"></Icon>
                    <span>注意：</span>
            </TimelineItem>
        <Card dis-hover v-for="(item, index) in list1" :key="index" style="margin: 0px 0 ; border:0px">
            <TimelineItem color="green">
              <p class="time1"> {{ item.createTime }}</p>
              <p class="content1"> {{ item.notice }}</p>
            </TimelineItem>
        </Card>
     </Scroll>
      <Scroll :on-reach-bottom="handleReachTop2" loading-text="已加载全部" style="width: 380px;margin-left: 635px; margin-top:-300px">
        <TimelineItem color="red">
              <Icon type="md-volume-down" slot="dot" size="20"></Icon>
              <span>注意：</span>
          </TimelineItem>
        <Card dis-hover v-for="(item, index) in list2" :key="index" style="margin: 0px 0 ; border:0px">
            <TimelineItem color="red">
              <p class="time2" > {{ item.createTime }}</p>
              <p class="content2"> {{ item.notice }}</p>
            </TimelineItem>
        </Card>
     </Scroll>
  </div>
</template>

<script>
import InforCard from '_c/info-card'
import CountTo from '_c/count-to'
import { ChartPie, ChartBar } from '_c/charts'
import { statisticAllData,statisticAllNotice } from '@/api/data'
export default {
  name: 'home',
  components: {
    InforCard,
    CountTo,
  },
  data () {
    return {
      inforCardData: [
        { title: '超级管理员数量', icon: 'ios-person', count: 0, color: '#2d8cf0' },
        { title: '老师数量', icon: 'md-people', count: 0, color: '#19be6b' },
        { title: '学生数量', icon: 'ios-people', count: 0, color: '#ff9900' },
        { title: '班级数量', icon: 'ios-home', count: 0, color: '#ed3f14' },
      ],
     split1: 0.5,
     split3: 0.5,
     split4: 0.5,
     //notices:[],
     list: [],
     list1: [],
     list2: []
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
  methods: {
      handleReachTop () {
        return new Promise(resolve => {
            setTimeout(() => {
               const first = this.list[this.list.length - 1];
                for (let i = 1; i < first.length; i++) {
                    this.list.push(first + i);
                }
                resolve();
            }, 1000);
        });
      },
      handleReachTop1 () {
        return new Promise(resolve => {
            setTimeout(() => {
                const first = this.list1[this.list1.length - 1];
                for (let i = 1; i < first.length; i++) {
                    this.list1.push(first + i);
                }
                resolve();
            }, 1000);
        });
      },
      handleReachTop2 () {
        return new Promise(resolve => {
            setTimeout(() => {
                const first = this.list2[this.list2.length - 1];
                for (let i = 1; i < first.length; i++) {
                    this.list2.push(first + i);
                }
                resolve();
            }, 1000);
        });
      }
  },
  mounted () {
    // 初始化
    statisticAllData().then(res => {
      // console.log(JSON.stringify(res.data.result));
      if(res.data.success){
        this.inforCardData[0].count = res.data.result.statisticDto.superAdminCount;
        this.inforCardData[1].count = res.data.result.statisticDto.teacherCount;
        this.inforCardData[2].count = res.data.result.statisticDto.studentCount;
        this.inforCardData[3].count = res.data.result.statisticDto.courseCount;
      }else if(res.data.errorMsg){
        this.$Message.warning({
          content:res.data.errorMsg
        })
      }
    })
    statisticAllNotice().then(res =>{
      //console.log("131321321"+JSON.stringify(res));
      if(res.data.success){
        var noticesArr = res.data.result.notices;
        for(var i in noticesArr){
            var objCourses = {};
            objCourses.notice = noticesArr[i].notice;
            objCourses.createTime = noticesArr[i].createTime;
            this.list.push(objCourses)
         };   
         var noticesArr1 = res.data.result.notices1;
         for(var i in noticesArr1){
            var objCourses = {};
            objCourses.notice = noticesArr1[i].notice;
            objCourses.createTime = noticesArr1[i].createTime;
            this.list1.push(objCourses)
         }; 
         var noticesArr2 = res.data.result.notices2;
         for(var i in noticesArr2){
            var objCourses = {};
            objCourses.notice = noticesArr2[i].notice;
            objCourses.createTime = noticesArr2[i].createTime;
            this.list2.push(objCourses)
         }; 
      }else if(res.data.errorMsg){
        this.$Message.warning({
          content:res.data.errorMsg
        })
      }
    })
  }
}
</script>

<style >
.count-style{
  font-size: 50px;
}
.demo-split{
        height: 200px;
        border: 1px solid #dcdee2;
    }
.demo-split-pane{
        padding: 10px;
    }
/*.demo >>> .ivu-carousel-item{
 background: red;
 height: 400px;
}*/
</style>
