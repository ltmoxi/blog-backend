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
  <div>
    <Card class="mb-10">
      <Row>
        <Col span="12">
          <h3>消息中心</h3>
        </Col>
        <Col span="12" class="text-right">
            <Button type="error" @click="myDelete">删除</Button>
        </Col>
      </Row>
    </Card>

    <Card>
    <Row style="margin-bottom: 10px;">
          <span>日期范围：</span>
          <Input placeholder="请输入评论人查询" v-model.trim='searchText' style="width:200px;margin-right:20px;"></Input>
          <Button type="primary" @click='search'>搜索</Button>
    </Row>
        <Table size="large"   @on-selection-change="selectOption" stripe ref="selection" :columns="tableCol" :data="tableData">
        </Table>
        <Page class='mt-10 text-right' :total="total" :current='currentPage' :page-size='pageSize' @on-change="changePage" @on-page-size-change="changeSize" show-sizer show-total/>
    </Card>

  </div>
</template>
<script>
import { hasOneOf } from '@/libs/tools'
import { newsTableData,commentDel} from '@/api/data'
export default {
  data () {
    return {
      searchText: '', // 搜索内容初始化
      startTime: '', // 入住日期初始化
      endTime: '',  // 退房日期初始化
      pageSize:10,
      currentPage:1,
      total:1,

      formData:{},      //表单信息

      selectItemArr: [],    // 选中项目id
      tableCol: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
		{
		  title: '所评论文章',
		  key:'articleName'
		},
        {
          title: '评论内容',
          key: 'content'
        },
        {
          title: '发布时间',
          key: 'createTime'
        }
      ],
      tableData: []
    }
  },
  methods: {
    async pageInit(){
      newsTableData(this.pageSize,this.currentPage,this.searchText,this.startTime,this.endTime).then(res => {
        if(res){
         this.total = res.data.result.data.pageSize
         this.tableData = res.data.result.data.list
        }else if(res.data.errorMsg){
          this.$Message.warning({
            content:res.data.errorMsg
          })
        }
      })
    },
    changePage(page){
      this.currentPage = page;
      this.pageInit();
    },
    changeSize(size){
      this.pageSize = size;
      this.currentPage = 1;
      this.pageInit();
    },
    closeRecordModal(){
      this.recordModal = false;
      this.tableCurrentPage = 1;
      this.recordData = [];
    },
    closeTextModal(){
      this.textModal = false;
      this.tableCurrentPage = 1;
      this.recordData = [];
    },

    // 选中项
    selectOption (selection, row) {
      this.selectItemArr = []
      for (let item of selection) {
        this.selectItemArr.push(item.id)
      }
    },
    // 删除
    myDelete () {
      var selectItemArr = this.selectItemArr
      console.log("++++++"+JSON.stringify(selectItemArr))
      if(selectItemArr.length<1){
        this.$Message.warning({
          content:'请选择项目！'
        })
        return;
      }
      commentDel('/comment/deletes', selectItemArr).then(res => {
        //console.log(JSON.stringify(res))
        if(res.data.status===0){
          this.selectItemArr=[];
          this.pageInit();
          this.$Message.success({
            content:'删除成功！'
          });
        }else if(res.data.errorMsg){
          this.$Message.warning({
            content:res.data.errorMsg
          })
        }

        // this.tableData = res.data.result.data.pageList;
      })
    },
    // 入住日期
    myStartTime (newTime) {
      this.startTime = newTime
    },
    // 退房日期
    myEndTime (newTime) {
      this.endTime = newTime
    },
    // 搜索
    search () {
      this.currentPage = 1;
      this.pageInit();
    }
  },
  mounted () {
    // 初始化
    newsTableData(10, 1).then(res => {
      if(res){
       this.total = res.data.result.data.pageSize
       this.tableData = res.data.result.data.list
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
    //所有权限
    viewAccessAll () {
      return hasOneOf(['superAdmin', 'teacher','student'], this.access)
    },
    //部分权限
    viewAccessTeacher () {
      return hasOneOf(['superAdmin','teacher'], this.access)
    },
  //部分权限
    viewTeacher () {
      return hasOneOf(['superAdmin','student'], this.access)
    },
    //部分权限
    viewAdmin () {
      return hasOneOf(['superAdmin'], this.access)
    },
    //部分权限
    viewStudent () {
      return hasOneOf(['student'], this.access)
    }
  }
}
</script>
