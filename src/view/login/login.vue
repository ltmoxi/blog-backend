<style lang="less">
  @import './login.less';
</style>

<template>
  <div class="login">
    <div class="login-con">
      <Card icon="log-in" title="欢迎登录" :bordered="false">
        <div class="form-con">
          <login-form @on-success-valid="handleSubmit"></login-form>
          <!-- <Button style='margin-bottom: 10px;' @click="saveItem = true" long>注册</Button> -->
          <p class="login-tip">输入用户名和密码</p>
        </div>

      </Card>
    </div>
    <Modal
        v-model="saveItem"
        :title="itemTitle"
        @on-cancel='closeSaveItem'>
        <Form ref="formData" :model="formData" :label-width="80">
          <FormItem label="姓名">
            <Input v-model="formData.name" placeholder="请填写您的姓名" :maxlength="10"></Input>
        </FormItem>
          <FormItem label="手机号">
              <Input v-model="formData.phone" placeholder="请填写您的手机号码" :maxlength="11"></Input>
          </FormItem>
           <FormItem label="密码">
              <Input type='password' v-model="formData.password" placeholder="请填写您的密码" :maxlength="11"></Input>
          </FormItem>
          <FormItem label="确认密码">
             <Input type='password' v-model="formData.confirmPwd" placeholder="请确认密码" :maxlength="11"></Input>
          </FormItem>
          <FormItem label="注册身份">
              <RadioGroup v-model="formData.identity">
                  <Radio :label="1" :key="1"><span>学生</span></Radio>
                  <Radio :label="0" :key="0"><span>老师</span></Radio>
              </RadioGroup>
          </FormItem>
          <FormItem label="任教课程" v-if="formData.identity==0">
             <Row>
                <Col span="12" style="padding-right:10px">
                    <Select v-model="formData.subjectId" filterable>
                        <Option v-for="item in cityList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                    </Select>
                </Col>
            </Row>
          </FormItem>
        </Form>
        <div slot="footer">
            <Button type="default"  @click="closeSaveItem">关闭</Button>
            <Button type="primary" :disabled='saveItemStatu'  @click="saveItemOk">确认</Button>
        </div>
      </Modal>
  </div>
</template>

<script>
import LoginForm from '_c/login-form'
import { mapActions } from 'vuex'
import { regist,getAllClass} from '@/api/data'
export default {
  data () {
    return {
      saveItem:false,     //保存操作框
      saveItemStatu:false,     //保存点击状态
      itemTitle:'注册',   //保存操作框title
      // identity: '学生',
      formData:{
        identity:1
      },
      cityList: []
    }
  },
  components: {
    LoginForm
  },
  methods: {
    ...mapActions([
      'handleLogin',
      'getUserInfo'
    ]),
    handleSubmit ({ userName, password }) {
      this.handleLogin({ userName, password }).then(res => {
        this.getUserInfo().then(res => {
          this.$router.push({
            name: this.$config.homeName
          })
        })
      })
    },
    // 关闭保存项目模态框
    closeSaveItem(){
      this.formData = {};
      this.saveItem = false;
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

        if(!formData.password){
          this.$Message.warning({
            content:'请填写您的密码！'
          });
          return;
        }else if (!/^[\w_-]{5,11}$/.test(formData.password)){
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
        }else if (formData.confirmPwd !== formData.password){
          this.$Message.warning({
            content:'两次密码请保持一致'
          });
          return;
        };
        //console.log(JSON.stringify(this.identity))
        regist(this.formData).then(res => {
           console.log(JSON.stringify(res))
          if(res.data.result && res.data.result.error){
            this.$Message.warning({
              content:res.data.result.error
            })
            return;
          }else if(res.data.success){
            this.$Message.success({
              content:'注册用户成功'
            });
            that.saveItem = false;
            that.pageInit();
          }else if(res.data.errorMsg){
            this.$Message.warning({
              content:res.data.errorMsg
            })
          }
          that.saveItemStatu = false;
        })
    }
  },
  mounted () {
    // 初始化
    getAllClass().then(res => {
       //console.log("----"+JSON.stringify(res));
      if(res.data.success){
       this.cityList = res.data.result.clasies;
      }else if(res.data.errorMsg){
        this.$Message.warning({
          content:res.data.errorMsg
        })
      }
    })
  }
}
</script>
