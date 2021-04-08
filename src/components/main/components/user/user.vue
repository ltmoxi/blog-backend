<style>
    .demo-upload-list{
        display: inline-block;
        width: 60px;
        height: 60px;
        text-align: center;
        line-height: 60px;
        border: 1px solid transparent;
        border-radius: 4px;
        overflow: hidden;
        background: #fff;
        position: relative;
        box-shadow: 0 1px 1px rgba(0,0,0,.2);
        margin-right: 4px;
    }
    .demo-upload-list img{
        width: 100%;
        height: 100%;
    }
    .demo-upload-list-cover{
        display: none;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0,0,0,.6);
    }
    .demo-upload-list:hover .demo-upload-list-cover{
        display: block;
    }
    .demo-upload-list-cover i{
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        margin: 0 2px;
    }
</style>


<template>
  
  <div class="user-avator-dropdown">
    <!-- <Badge :count="newsCount" :offset="[20,5]" class="mr-10" >
        <a href="http://localhost:8081/#/news/news"><Icon type="ios-notifications-outline" size="26"></Icon></a>
      </Badge> -->
    <Dropdown @on-click="handleClick">
      <Avatar :src="userAvator"/>
      <Icon :size="18" type="md-arrow-dropdown"></Icon>
      <DropdownMenu slot="list">
         <component2 v-if="viewAccessTwo"> 
            <DropdownItem name="edit" >编辑个人信息</DropdownItem>
            <DropdownItem name="upassword" >修改密码</DropdownItem>
            <DropdownItem name="upic" >修改头像</DropdownItem> 
         </component2> 
          <DropdownItem name="logout">退出登录</DropdownItem>
      </DropdownMenu>
    </Dropdown>
    <Modal
     v-model="saveItem"
     :title="itemTitle"
     @on-cancel='closeSaveItem'>
     <Form ref="formData" :model="formData" :label-width="80">
       <input type="hidden" name='id' v-model="formData.userId">
       <FormItem label="姓名">
           <Input v-model="formData.name" placeholder="请填写您的姓名" :maxlength="10"></Input>
       </FormItem>
       <FormItem label="手机号">
           <Input v-model="formData.phone" placeholder="请填写您的手机号码" :maxlength="11"></Input>
       </FormItem>
     </Form>
     <div slot="footer">
         <Button type="default"  @click="closeSaveItem">关闭</Button>
         <Button type="primary" :disabled='saveItemStatu'  @click="saveItemOk">确认</Button>
     </div>
   </Modal> 
   <Modal
     v-model="saveItem1"
     :title="itemTitle1"
     @on-cancel='closeSaveItem'>
     <Form ref="formData" :model="formData" :label-width="80">
       <input type="hidden" name='id' v-model="formData.userId">
         <FormItem label="旧密码" >
           <Input  v-model="formData.oldPassword" placeholder="请填写您的旧密码" :maxlength="11"></Input>
         </FormItem>
         <FormItem label="新密码">
            <Input type='password' v-model="formData.newPassword" placeholder="请填写您的新密码" :maxlength="11"></Input>
          </FormItem>
         <FormItem label="确认密码" >
            <Input type='password' v-model="formData.confirmPwd" placeholder="请确认新密码" :maxlength="11"></Input>
          </FormItem> 
     </Form>
     <div slot="footer">
         <Button type="default"  @click="closeSaveItem">关闭</Button>
         <Button type="primary" :disabled='saveItemStatu'  @click="saveItemOk1">确认</Button>
     </div>
   </Modal> 

   <Modal
      v-model="upLoadPic"
      title="上传头像"
      @on-cancel='closeUpload'>
      <div class="demo-upload-list" v-for="item in uploadList">
          <img :src="item.url">
          <div class="demo-upload-list-cover">
              <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
          </div>
      </div>
      <Upload
          ref="upload"
          :show-upload-list="false"
          :default-file-list="defaultList"
          :on-success="handleSuccess"
          :format="['jpg','jpeg','png']"
          :max-size="2048"
          :on-format-error="handleFormatError"
          :on-exceeded-size="handleMaxSize"
          :before-upload="handleBeforeUpload"
          multiple
          type="drag"
          action="/api/current/updateCurrentPic"
          :headers="{userId:userId}"
          style="display: inline-block;width:58px;">
          <div style="width: 58px;height:58px;line-height: 58px;">
              <Icon type="ios-camera" size="20"></Icon>
          </div>
      </Upload>
      <div slot="footer">
          <Button type="default"  @click="closeUpload">关闭</Button>
      </div>
    </Modal>
    <Modal title="View Image" v-model="picShow">
        <img :src="'https://o5wwk8baw.qnssl.com/' + imgName + '/large'" v-if="picShow" style="width: 100%">
    </Modal>
 </div>

</template>

<script>

import './user.less'
import { hasOneOf } from '@/libs/tools'
import { mapActions } from 'vuex'
import ds from '@/assets/images/ds.png' 
import { updateCurrent , updateCurrent1,removeCurrentPic,updateCurrentPic,selectNewsCount} from '@/api/data'

export default {
 // inject:['reload'],
  name: 'User',
  props: {
    userAvator: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      formData:{},      //表单信息
      saveItem:false,     //保存操作框
      saveItemStatu:false,    //保存点击状态
      itemTitle:'编辑个人信息',

      saveItem1:false,
      itemTitle1:'修改密码',

      upLoadPic: false,   // 照片上传模态框
      spicture:[],          //照片上传
      teacherId:0,        //照片上传参数

      // 图片上传
      defaultList: [],
      imgName: '',
      picShow: false,
      uploadList: [],

      count:0,
      content:ds.png,
    }
  },
  methods: {
    ...mapActions([
      'handleLogOut'
    ]),
    handleClick (name) {
      switch (name) {
        case 'logout':
          this.handleLogOut().then(() => {
            this.$router.push({
              name: 'login'
            })
          })
          break;
        case 'edit':
        //alert(1);
        this.saveItem = true;
        this.formData = this.$store.state.user;
        break;
        case 'upassword' :
        this.saveItem1 = true;
        this.formData = this.$store.state.user;
        break;
        case 'upic' :
        this.upLoadPic = true;
        console.log(JSON.stringify(this.$store.state.user))
        this.userId = this.$store.state.user.userId;
        var defaultPicObj = {};
            defaultPicObj.name=this.$store.state.user.headPic;
            defaultPicObj.url=this.$store.state.user.avatorImgPath;
            this.uploadList.push(defaultPicObj);
      }
    },

    closeUpload(){
     alert(1);
      this.upLoadPic = false;
      this.defaultList=[];
      this.uploadList=[];
      location.reload();
    },

    // 图片上传
    handleView (name) {
        this.imgName = name;
        this.picShow = true;
    },
    handleRemove (file) {
        /*const fileList = this.$refs.upload.fileList;
        this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);*/
        this.formData.id=this.userId;
        this.formData.headPic=this.$store.state.user.headPic;
        removeCurrentPic(this.formData).then(res => {
            //console.log(JSON.stringify(res));
            if(res.data.success){
              this.$Message.success({
              content:'删除头像成功'
            });
             this.uploadList.splice(this.uploadList.indexOf(file), 1)
             //this.upLoadPic = false;
             //that.pageInit();
            }else if(res.data.errorMsg){
              this.$Message.warning({
                content:res.data.errorMsg
              })
            }
          })
    },
     handleSuccess (res, file) {
        //alert(1);
        file.url = 'http://localhost:8081/picture/'+this.$store.state.user.headPic;
        file.name = res.result.picName;
        console.log(file.url);
    },
    handleFormatError (file) {
        this.$Notice.warning({
            title: '文件格式不正确',
            desc: file.name + ' 的文件格式不正确,请选择jpg或png'
        });
    },
    handleMaxSize (file) {
        this.$Notice.warning({
            title: '超过文件大小限制',
            desc: file.name + ' 超出文件大小限制,请选择小于2M的图片上传'
        });
    },
     handleBeforeUpload(file) {
        // 创建一个 FileReader 对象
        let reader = new FileReader()
        // readAsDataURL 方法用于读取指定 Blob 或 File 的内容
        // 当读操作完成，readyState 变为 DONE，loadend 被触发，此时 result 属性包含数据：URL（以 base64 编码的字符串表示文件的数据）
        // 读取文件作为 URL 可访问地址
        reader.readAsDataURL(file)

        const _this = this
        reader.onloadend = function (e) {
            file.url = reader.result
            _this.uploadList.push(file)
        }
        const check = this.uploadList.length < 1;
        if (!check) {
            this.$Notice.warning({
                title: '最多可上传1张图片'
            });
        }
        return check;
    },
   // 关闭保存项目模态框
    closeSaveItem(){
      this.formData = {};
      this.saveItem = false;
      this.targetKeys=[];
      this.saveItem1 = false;
    },
    saveItemOk(){
      var that = this;
      var formData = this.formData;
      console.log(JSON.stringify(formData))
      if(!formData.name){
        this.$Message.warning({
          content:'请填写您的姓名！'
        });
        return;
      }else if (!/[\u4e00-\u9fa5_a-zA-Z]+$/.test(formData.name)){
        this.$Message.warning({
          content:'请填写正确的姓名'
        });
        return;
      };
      
      if(!formData.phone){
        this.$Message.warning({
          content:'请填写您的手机号'
        });
        return;
      }else if (!/^1(3|4|5|6|7|8)\d{9}$/.test(formData.phone)){
        this.$Message.warning({
          content:'请填写正确的手机号'
        });
        return;
      };
        updateCurrent(this.formData).then(res => {
          that.saveItemStatu = false;
          if(res.data.success){
            this.$Message.success({
              content:'修改用户成功'
            });
            that.saveItem = false;
            that.pageInit();
          }else if(res.data.errorMsg){
            this.$Message.warning({
              content:res.data.errorMsg
            })
          }
        })
    },



    saveItemOk1(){
      var that = this;
      var formData = this.formData;
      //console.log('55555'+JSON.stringify(formData))
        if(!formData.oldPassword){
          this.$Message.warning({
            content:'请填写您的旧密码！'
          });
          return;
        }else if (!/^[\w_-]{5,11}$/.test(formData.oldPassword)){
          this.$Message.warning({
            content:'请填写5-11密码'
          });
          return;
        };
        if(!formData.newPassword){
          this.$Message.warning({
            content:'请填写您的新密码！'
          });
          return;
        }else if (!/^[\w_-]{5,11}$/.test(formData.newPassword)){
          this.$Message.warning({
            content:'请填写5-11密码'
          });
          return;
        };
        if(!formData.confirmPwd){
          this.$Message.warning({
            content:'请确认您的密码！'
          });
          return;
        }else if (formData.confirmPwd !== formData.newPassword){
          this.$Message.warning({
            content:'两次密码请保持一致'
          });
          return;
        };
        //console.log(JSON.stringify(this.identity))
    //    this.saveItemStatu = true;
        updateCurrent1(this.formData).then(res => {
          // var that = this;
          that.saveItemStatu = false;
          if(res.data.success){
            this.$Message.success({
              content:'修改密码成功'
            });
            that.saveItem1 = false;
            that.pageInit();
          }else if(res.data.errorMsg){
            this.$Message.warning({
              content:res.data.errorMsg
            })
          }
        })
    }
  },
  mounted () {
    selectNewsCount().then(res => {
      if(res.data.success){
        this.count = res.data.result.count;
      }else if(res.data.errorMsg){
        this.$Message.warning({
          content:res.data.errorMsg
        })
      }
    })
  },
  computed: { 
      access () {
        return this.$store.state.user.access
      },

      newsCount(){
        return this.$store.state.user.newsCount
      },
      //所有权限
      viewAccessAll () {
        return hasOneOf(['superAdmin', 'teacher','student'], this.access)
      },
      //部分权限
      viewAccessTwo () {
        return hasOneOf(['teacher','student'], this.access)
      }
    }
}

</script>
