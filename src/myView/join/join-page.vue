<template>
  <div>
    <Row :gutter="20">
      <i-col span="12">
        <Card title="最代码10群" shadow>
          <img class="qq-group-img" :src="qqFans" alt="">
          <p class="qq-group-intro">本群为最代码官方10群，里边有很多大佬哦，博主也在这里，项目有问题@人间蒸发。</p>
          <p class="qq-group-intro">也可点击这里直接加我好友
            <a target="_blank" href="http://wpa.qq.com/msgrd?v=3&amp;uin=289373410&amp;site=qq&amp;menu=yes"><img border="0" src="http://wpa.qq.com/pa?p=2:289373410:52" alt="点击这里联系我" title="点击这里联系我"></a></p>
        </Card>
      </i-col>
      <i-col span="12">
        <Card title="伊成交流群" shadow>
          <img class="qq-group-img" :src="qqFans2" alt="">
          <p class="qq-group-intro">本群为伊成交流群，里边有很多大佬哦，博主也在这里，项目有问题@人间蒸发。</p>
          <p class="qq-group-intro">也可点击这里直接加我好友 
            <a target="_blank" href="http://wpa.qq.com/msgrd?v=3&amp;uin=289373410&amp;site=qq&amp;menu=yes"><img border="0" src="http://wpa.qq.com/pa?p=2:289373410:52" alt="点击这里联系我" title="点击这里联系我"></a></p>
        </Card>
      </i-col>
    </Row>
  </div>
</template>

<script>
import qqFans from '@/assets/images/zuidaima.png'
import qqFans2 from '@/assets/images/yicheng.png' 
import button_111 from '@/assets/images/button_111.png' 
export default {
  name: 'join_page',
  data () {
    return {
      qqFans,
      qqFans2
    }
  }
}
</script>

<style>
.qq-group-img{
  display: block;
  margin: 0 auto;
  width: 240px;
}
.qq-group-intro{
  padding: 20px;
  font-size: 16px;
}
</style>
