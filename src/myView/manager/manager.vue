<style scoped>
  .time{
        font-size: 12px;
        color: blue;
    }
  .content{
      padding-left: 5px;
      font-size: 14px;
      font-weight: bold;
      color: red;
  }
</style>

<template>
  <div>

    <Card class="mb-10">
      <Row>
        <Col span="12">
        <h3>用户管理</h3>
        </Col>
        <Col span="12" class="text-right">
        <Button v-show ="access==='超级管理员'" type="primary" @click="addItem" class="mr-10">创建管理员</Button>
        <Button type="success" @click="myStart" class="mr-10">启用</Button>
        <Button type="warning" @click="myStop" class="mr-10">停用</Button>
        <Button v-show ="access==='超级管理员'" type="error" @click="myDelete">删除</Button>
        </Col>
      </Row>
    </Card>
    <Card>
      <Row style="margin-bottom: 10px;">
        <span>关键字：</span>
        <Input placeholder="请输入姓名查询" v-model.trim='searchText' style="width:200px;margin-right:20px;"></Input>
        <Button type="primary" @click='search'>搜索</Button>
      </Row>
      <Table size="large" @on-selection-change="selectOption" stripe ref="selection" :columns="tableCol" :data="tableData"></Table>
      <Page class='mt-10 text-right' :total="total" :current='currentPage' :page-size='pageSize' @on-change="changePage"
        @on-page-size-change="changeSize" show-sizer show-total />
    </Card>

    <Modal v-model="recordModal" title="历史登录信息" @on-cancel="closeRecordModal" width=25>
      <div style="height: 400px;overflow: auto;padding-left: 50px;">
        <TimelineItem v-for="(item, index) in this.ipList" :key="index">
          <p class="content">上次登录ip： {{ item.ip }}</p>
          <p class="time">登录时间： {{ item.loginTime }}</p>
        </TimelineItem>
      </div>
    </Modal>


    <Modal v-model="saveItem" :title="itemTitle" @on-cancel='closeSaveItem'>
      <Form ref="formData" :model="formData" :label-width="80">
        <input type="hidden" name='id' v-model="formData.id">
        <FormItem label="昵称">
          <Input v-model="formData.name" placeholder="请填写您的姓名" :maxlength="10"></Input>
        </FormItem>
<!--        <span style="color: red;margin-left: 80px;font-size:5px">*手机号为您的登录账号*</span>
 -->        <FormItem label="用户名">
          <Input v-model="formData.username" placeholder="请填写您的手机号码" :maxlength="11"></Input>
        </FormItem>
        <FormItem label="密码" v-if='addUser'>
          <Input type='password' v-model="formData.password" placeholder="请填写您的密码" :maxlength="11"></Input>
        </FormItem>
        <FormItem label="确认密码" v-if='addUser'>
          <Input type='password' v-model="formData.agiPassword" placeholder="请确认密码" :maxlength="11"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="default" @click="closeSaveItem">关闭</Button>
        <Button type="primary" :disabled='saveItemStatu' @click="saveItemOk">确认</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  import {
    commentDel,
    ManagerTableData,
    getIpByManagerId,
    addManager,
    updateManager,
    handle
  } from '@/api/data'

  export default {
    data() {
      return {
        // startTime: '', // 入住日期初始化
        // endTime: '',  // 退房日期初始化

        formData: {}, //表单信息
        addUser: true, //是否为新增用户
        saveItem: false,
        saveItemStatu:false,    //保存点击状态
        itemTitle:'',

        searchText: '', // 搜索内容初始化
        pageSize: 10,
        currentPage: 1,
        total: 1,
        recordModal: false,
        tableData: [],
        selectItemArr: [], // 选中项目id
        ipList: [],
        tableCol: [{
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: '姓名',
            key: 'name'
          },
          {
            title: '用户名',
            key: 'username'
          },
          {
            title: '角色',
            key: 'type'
          },
          {
            title: '状态',
            key: 'status',
            render: (h, params) => {
              // console.log("++++++"+JSON.stringify(params.row.name))
              var oName = params.row.status;
              if (oName === 1) {
                oName = "正常";
                return h('div', {
                  style: {
                    color: 'green',
                  }
                }, oName)
              } else {
                oName = "停用";
                return h('div', {
                  style: {
                    color: 'red',
                  }
                }, oName)
              }
            }
          },
          {
            title: '创建时间',
            key: 'createTime'
          },
          {
            title: '历史登录信息',
            key: 'examineStatus',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'large'
                  },
                  on: {
                    click: () => {
                      let managerId = params.row.id;
                      getIpByManagerId(managerId).then(res => {
                        if (res.data) {
                          this.ipList = res.data.result.data
                        } else {
                          this.$Message.warning({
                            content: res.data.errorMsg
                          })
                        }
                      })
                      this.recordModal = true;
                    }
                  }
                }, '详情')
              ])
            }
          },
          {
            title: '操作',
            key: 'examineStatus',
            width: 100,
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'large'
                  },
                  on: {
                    click: () => {
                      this.formData = params.row;
                      this.addUser = false;
                      this.itemTitle = '编辑管理员';
                      this.saveItem = true;
                    }
                  }
                }, '编辑')
              ])
            }
          },
          {
            title: '重置密码',
            key: 'examineStatus',
            width: 100,
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'large'
                  },
                  on: {
                    click: () => {
                      var formData = params.row;
                      formData.password = "123456"
                      updateManager(formData).then(res => {
                        // var that = this;
                        if (res.data.status === 0) {
                          this.$Message.success({
                            content: '密码重置成功'
                          });
                          that.pageInit();
                        } else if (res.data.errorMsg) {
                          this.$Message.warning({
                            content: res.data.errorMsg
                          })
                        }
                      })
                    },
                  }
                }, '重置密码')
              ])
            }
          }
        ],
      }
    },
    methods: {
      async pageInit() {
        ManagerTableData(this.pageSize, this.currentPage, this.searchText).then(res => {
          if (res.data) {
            this.total = res.data.result.pageSize
            this.tableData = res.data.result.data.list
          }
        })
      },
      changePage(page) {
        this.currentPage = page
        this.pageInit()
      },
      changeSize(size) {
        this.pageSize = size
        this.currentPage = 1
        this.pageInit()
      },
      // 选中项
      selectOption(selection, row) {
        this.selectItemArr = []
        for (let item of selection) {
          this.selectItemArr.push(item.id)
        }
      },
      // 启用用户
      myStart() {
        var selectItemArr = this.selectItemArr
        if (selectItemArr.length < 1) {
          this.$Message.warning({
            content: '请选择项目！'
          })
          return
        }
        handle('/manager/star', selectItemArr).then(res => {
          if (res.data.status === 0) {
            this.selectItemArr = []
            this.pageInit()
            this.$Message.success({
              content: '启用成功！'
            })
          } else if (res.data.errorMsg) {
            this.$Message.warning({
              content: res.data.errorMsg
            })
          }

          // this.tableData = res.data.result.data.pageList;
        })
      },
      // 停用用户
      myStop() {
        var selectItemArr = this.selectItemArr
        if (selectItemArr.length < 1) {
          this.$Message.warning({
            content: '请选择项目！'
          })
          return
        }
        handle('/manager/stop', selectItemArr).then(res => {
          if (res.data.status === 0) {
            this.selectItemArr = []
            this.pageInit()
            this.$Message.success({
              content: '停用成功！'
            })
          } else if (res.data.errorMsg) {
            this.$Message.warning({
              content: res.data.errorMsg
            })
          }

          // this.tableData = res.data.result.data.pageList;
        })
      },

      addItem() {
        this.formData = {};
        this.itemTitle = '创建管理员';
        this.addUser = true;
        this.saveItem = true;

      },

      // 关闭保存项目模态框
      closeSaveItem() {
        this.formData = {};
        this.saveItem = false;
      },

      saveItemOk() {
        var that = this;
        var formData = this.formData;
        //console.log(JSON.stringify(formData))
        if (!formData.name) {
          this.$Message.warning({
            content: '请填写姓名！'
          });
          return;
        }

        if (!formData.username) {
          this.$Message.warning({
            content: '请填写用户名！'
          });
          return;
        }


        if (this.addUser) {
          if (!formData.password) {
            this.$Message.warning({
              content: '请填写您的密码！'
            });
            return;
          } else if (!/^[\w_-]{5,11}$/.test(formData.password)) {
            this.$Message.warning({
              content: '请填写5-11密码'
            });
            return;
          };
          if (!formData.agiPassword) {
            this.$Message.warning({
              content: '请确认您的密码！'
            });
            return;
          } else if (formData.agiPassword !== formData.password) {
            this.$Message.warning({
              content: '两次密码请保持一致'
            });
            return;
          };

          addManager(this.formData).then(res => {
           if (res.data.status === 0) {
              this.$Message.success({
                content: '保存用户成功'
              });
              that.saveItem = false;
              that.pageInit();
            } else if (res.data.errorMsg) {
              this.$Message.warning({
                content: res.data.errorMsg
              })
            }
            that.saveItemStatu = false;
          })
        } else {
          this.saveItemStatu = true;
          updateManager(this.formData).then(res => {
            // var that = this;
            that.saveItemStatu = false;
            if (res.data.status === 0) {
              this.$Message.success({
                content: '修改用户成功'
              });
              that.saveItem = false;
              that.pageInit();
            } else if (res.data.errorMsg) {
              this.$Message.warning({
                content: res.data.errorMsg
              })
            }
          })
        }
      },



      // 删除
      myDelete() {
        var selectItemArr = this.selectItemArr
        if (selectItemArr.length < 1) {
          this.$Message.warning({
            content: '请选择项目！'
          })
          return
        }
        commentDel('/manager/delete', selectItemArr).then(res => {
          if (res.data.status === 0) {
            this.selectItemArr = []
            this.pageInit()
            this.$Message.success({
              content: '删除成功！'
            })
          } else if (res.data.errorMsg) {
            this.$Message.warning({
              content: res.data.errorMsg
            })
          }

          // this.tableData = res.data.result.data.pageList;
        })
      },
      // 入住日期
      myStartTime(newTime) {
        this.startTime = newTime
      },
      // 退房日期
      myEndTime(newTime) {
        this.endTime = newTime
      },
      // 搜索
      search() {
        this.currentPage = 1
        this.pageInit()
      },
      /* recordLoadMore(){
         if(this.tableCurrentPage === this.tableTotalPage){
           this.$Message.warning({
             content:'暂无更多数据'
           })
           return;
         }
         this.tableCurrentPage += 1;
         this.tableInit();
       },*/
      closeRecordModal() {
        this.recordModal = false
        this.tableCurrentPage = 1
        this.recordData = []
      }

    },
    mounted() {
      // 初始化
      ManagerTableData(10, 1).then(res => {
        if (res.data) {
          this.total = res.data.result.data.pageSize
          this.tableData = res.data.result.data.list
        }
      })
    },
    computed: {
      access () {
        console.log(this.$store.state.user)
        return this.$store.state.user.access
      }
    }

  }
</script>
