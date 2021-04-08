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
    .editor-wrapper{
      height: 400px;
    }
    .input-new-tag {
    width: 80px;
    margin-left: 0px;
  }

</style>
<template>
  <div>
    <Card class="mb-10">
      <Row>
        <Col span="12">
          <h3>分类管理</h3>
        </Col>
        <Col span="12" class="text-right">
            <Button type="primary" @click='addItem' class="mr-10">新建</Button>
            <Button type="error" @click="myDelete">删除</Button>
        </Col>
      </Row>
    </Card>
	
	<Card>
		<Table size="large"  @on-selection-change="selectOption" stripe ref="selection" :columns="tableCol" :data="tableData">
		</Table>
		<Page class='mt-10 text-right' :total="total" :current='currentPage' :page-size='pageSize' @on-change="changePage" @on-page-size-change="changeSize" show-sizer show-total/>
	</Card>
    

     <Modal
      v-model="saveItem"
      :title="itemTitle"
      :width="25"
      style="heigt:"
      @on-cancel='closeSaveItem'>
      <Form ref="formData" :model="formData" :label-width="80" >
        <input type="hidden" name='id' v-model="formData.id">
            <FormItem label="分类名称：">
              <Input  placeholder="请填写分类名称..." :maxlength="50" v-model="formData.name" style="width: 300px" />
            </FormItem>
      </Form>
      <div slot="footer">
          <Button type="default"  @click="closeSaveItem">关闭</Button>
          <Button type="primary" :disabled='saveItemStatu'  @click="saveItemOk">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { hasOneOf } from '@/libs/tools'
import { categoryTableData,uploadFile,savecategory,commentDel,updatecategory,findCategory} from '@/api/data'
export default {

  data () {
    return {
      searchText: '', // 搜索内容初始化
      pageSize:10,
      currentPage:1,
      total:1,

      inputVisible: false,
      inputValue: '',

      formData:{},      //表单信息
      addUser:true,
      boolPic:false,
      contentxt:"",

      saveItem:false,
      saveItemStatu:false,
      itemTitle:'编辑',

      statusArr: [],

      selectItemArr: [],    // 选中项目id
      tableCol: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '类别',
          key: 'name'
        },
        {
          title: '操作',
          key: 'examineStatus',
          render: (h, params) => {
           // if(this.viewTeacher){
              return h('div', [
               h('Button', {
                props: {
                  type: 'primary',
                  size: 'large',
                  vertical:true,
                  disabled:this.viewStudent
                  //disabled:this.mainTeacher !== params.row.teacherId
                },
                on: {
                  click: () => {
                    let getData = JSON.parse(JSON.stringify(this.tableData[params.index]));
                    this.formData = getData;
                    this.saveItem = true;
                    this.addUser = false;
                    this.itemTitle = '编辑';
                  }
                }
              }, '编辑'),
            ])
           }
        }
      ],
      tableData: []
      
    }
  },
  methods: {
    async pageInit(){
      categoryTableData(this.pageSize,this.currentPage).then(res => {
        if(res.data){
          this.total = res.data.result.data.total
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
      this.recordData1 = [];
    },
    closeTextModal(){
      this.textModal = false;
      this.tableCurrentPage = 1;
      this.recordData = [];
    },
     closeSaveItem(){
      this.formData = {};
      this.saveItem = false;
      this.targetKeys=[];
      this.teachersList=[];
      this.countTags=[];
      this.inputVisible = false;
    },
    addItem(){
      this.formData = {};
      this.boolPic =false;
      this.itemTitle = '添加';
      this.addUser = true;
      this.saveItem = true;
     },

     saveItemOk(){
      if(this.addUser){
          savecategory(this.formData).then(res => {
              if(res.data.result && res.data.result.error){
                this.$Message.warning({
                  content:res.data.result.error
                })
                return;
              }else if(res.data.status === 0){
				debugger
                this.$Message.success({
                  content:'保存成功'
                });
				this.saveItem = false;
                //that.saveItem1 = false;
                this.pageInit();
              }else if(res.data.errorMsg){
                this.$Message.warning({
                  content:res.data.errorMsg
                })
              }
              this.saveItemStatu = false;
            })
        }else {
          updatecategory(this.formData).then(res => {
              if(res.data.result && res.data.result.error){
                this.$Message.warning({
                  content:res.data.result.error
                })
                return;
              }else if(res.data.status === 0){
                this.$Message.success({
                  content:'修改成功'
                });
                this.saveItem = false;
                this.formData= {};
                this.pageInit();
              }else if(res.data.errorMsg){
                this.$Message.warning({
                  content:res.data.errorMsg
                })
              }
              this.saveItemStatu = false;
            })
        }
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
      if(selectItemArr.length<1){
        this.$Message.warning({
          content:'请选择项目！'
        })
        return;
      }
      commentDel('/category/deletes', selectItemArr).then(res => {
        if(res.data.status === 0){
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
      })
    },
    // 搜索
    search () {
      this.currentPage = 1;
      this.pageInit();
    },
    recordLoadMore(){
      if(this.tableCurrentPage === this.tableTotalPage){
        this.$Message.warning({
          content:'暂无更多数据'
        })
        return;
      }
      this.tableCurrentPage += 1;
      this.tableInit();
    },
    handleChange(newTargetKeys) {
        this.targetKeys = newTargetKeys;
    },
    render (item) {
        return item.label;
    },
    reloadMockData () {
        this.transfer = this.getMockData();
        this.targetKeys = this.getTargetKeys();
    },

    //图片上传
    imgAdd (pos, file) {
       uploadFile(file).then(res => {
        if(res){
             this.$refs.md.$img2Url(pos, 'http://localhost/pic/' + data.result.msg)
             this.$Message.success({
              content:'封面成功'
            });
          }
        })
      },

      handleFormatError (file) {
        this.$Notice.warning({
          title: '文件格式不正确',
          desc: '文件 ' + file.name + ' 格式不正确，请上传格式的图片。'
        })
      },

      handleMaxSize (file) {
        this.$Notice.warning({
          title: '超出文件大小限制',
          desc: '文件 ' + file.name + ' 太大，不能超过 2M。'
        })
      },

    handleUpload(file) {
        uploadFile(file).then(res => {
        if(res){
             this.formData.enclosure = res.data.result.msg
              this.boolPic = true
             this.$Message.success({
              content:'上传成功'
            });
          }
        })
      },

      handleBeforeUpload (file) {
        uploadFile(file).then(res => {
        if(res){
             this.formData.categoryHeadPic = res.data.result.msg
              this.boolPic = true
             this.$Message.success({
              content:'上传成功'
            });
          }
        })
      },
      mavonChangeHandle (context, html) {
       this.contentxt = html
        this.formData.categoryContent = marked(html)

      },
 //-----------------------------------------图片上传结束-------------------------------


      //标签部分
      handleClose(tag) {
        this.countTags.splice(this.countTags.indexOf(tag), 1);
      },

      showInput() {
        this.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },

      handleInputConfirm() {
        let inputValue = this.inputValue;
        if (inputValue) {
          this.countTags.push(inputValue);
        }
        this.inputVisible = false;
        this.inputValue = '';
      },
      //-----------------------------------------标签结束-------------------------------
  },
  mounted () {
    // 初始化
    categoryTableData(10, 1).then(res => {
    if(res.data){
        this.total = res.data.result.data.total
        this.tableData = res.data.result.data.list
      }
    })
		
  },
  computed: {
    editorId () {
      return `editor${this._uid}`
    },
    managerId () {
      return this.$store.state.user.userId
    }
  }
}
</script>
