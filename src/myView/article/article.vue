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
          <h3>文章管理</h3>
        </Col>
        <Col span="12" class="text-right">
            <Button type="primary" @click='addItem' class="mr-10">新建</Button>
            <Button type="error" @click="myDelete">删除</Button>
        </Col>
      </Row>
    </Card>
    <Card>
    <Row style="margin-bottom: 10px;">
          <span>关键字：</span>
          <Input placeholder="请输入文章名称" v-model.trim='searchText' style="width:200px;margin-right:20px;" />
          <Button type="primary" @click='search'>搜索</Button>
    </Row>
        <Table size="large"  @on-selection-change="selectOption" stripe ref="selection" :columns="tableCol" :data="tableData">
        </Table>
        <Page class='mt-10 text-right' :total="total" :current='currentPage' :page-size='pageSize' @on-change="changePage" @on-page-size-change="changeSize" show-sizer show-total/>
    </Card>

     <Modal
      v-model="saveItem"
      :title="itemTitle"
      :width="80"
      style="heigt:"
      @on-cancel='closeSaveItem'>
      <Form ref="formData" :model="formData" :label-width="80" >
        <input type="hidden" name='id' v-model="formData.id">
         <FormItem label="选择封面：">
            <Upload
              action=""
              :format = "['jpg','jpeg','png', 'gif']"
              :on-format-error="handleFormatError"
              :on-exceeded-size="handleMaxSize"
              :before-upload="handleBeforeUpload">
              <Button icon="ios-cloud-upload-outline">上传封面</Button>
            </Upload>
            <span v-if="this.boolPic ">{{this.formData.articleHeadPic}}</span>
          </FormItem>

          <FormItem label="文章标题：">
            <Input  placeholder="请填写文章标题..." :maxlength="50" v-model="formData.articleName" style="width: 300px" />
          </FormItem>
          <FormItem label="文章内容：" >
            <div>
                <mavon-editor class="editor-wrapper" ref=md @imgAdd="imgAdd"  v-model="formData.articleContent" :toolbars="toolbars" @change="mavonChangeHandle"/>
            </div>
          </FormItem>
          <FormItem label="文章标签：">
            <Tag v-for="item  in countTags" :key="item" :name="item" closable @on-close="handleClose">{{ item }}</Tag >
            <Input
              class="input-new-tag"
              v-if="inputVisible"
              v-model="inputValue"
              ref="saveTagInput"
              size="small"
              @keyup.enter.native="handleInputConfirm"
              @blur="handleInputConfirm"
            />

            <Button v-else size="small" type="dashed" icon="ios-add" @click="showInput"> 添加标签</Button>
          </FormItem>

          <FormItem label="文章类型：">
            <Select v-model="formData.articleType":label-in-value="true" style="width: 200px">
              <Option v-for="item in statusArr" :value="item.id" :key="item.id">{{ item.name }}
              </Option>
            </Select>
          </FormItem>

          <FormItem label="文章备注：">
            <Input  type="textarea"  placeholder="请填写文章备注..." v-model="formData.articleRemark" :maxlength="100" style="width: 500px"/>
          </FormItem>


          <FormItem label="上传附件：">
             <Upload
               action=""
               :format = "['zip']"
               :on-format-error="handleFormatError"
               :on-exceeded-size="handleMaxSize"
               :before-upload="handleUpload">
               <Button icon="ios-cloud-upload-outline">上传封面</Button>
             </Upload>
             <span v-if="this.formData.enclosure">{{this.formData.enclosure}}</span>
           </FormItem>
      </Form>
      <div slot="footer">
          <Button type="default"  @click="closeSaveItem">关闭</Button>
          <Button type="primary" :disabled='saveItemStatu'  @click="saveItemOk">发表/审核通过</Button>
          <Button type="error" :disabled='saveItemStatu'  @click="saveItemOk1">不通过</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { hasOneOf } from '@/libs/tools'
import { articleTableData,uploadFile,saveArticle,commentDel,updateArticle,findCategory} from '@/api/data'
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
      itemTitle:'文章编辑',

      statusArr: [],

      selectItemArr: [],    // 选中项目id
      tableCol: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '文章名称',
          key: 'articleName'
        },
        {
          title: '作者',
          key: 'managerName'
        },
        {
          title: '文章标签',
          key: 'tags'
        },
        {
          title: '文章阅读量',
          key: 'articleReadCount'
        },
        {
          title: '文章审核状态',
          key: 'articleState',
          render: (h, params) => {
            // console.log("++++++"+JSON.stringify(params.row.name))
            var oName = params.row.articleState;
            if (oName === 0) {
              oName = "通过";
              return h('div', {
                style: {
                  color: 'green',
                }
              }, oName)
            } else {
              oName = "不通过";
              return h('div', {
                style: {
                  color: 'red',
                }
              }, oName)
            }
          }
        },
        {
          title: '发表时间',
          key: 'createTime'
        },
        {
          width:100,
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
                    this.boolPic = true;
                    this.itemTitle = '编辑文章';
                    if(this.formData.tags.length>=1){
                      this.countTags = this.formData.tags
                    }
                  }
                }
              }, '编辑/审核'),
            ])
           }
        }
      ],
      tableData: [],
      countTags: [],
      toolbars: {
          bold: true, // 粗体
          italic: true, // 斜体
          header: true, // 标题
          underline: true, // 下划线
          strikethrough: true, // 中划线
          mark: false, // 标记
          superscript: false, // 上角标
          subscript: false, // 下角标
          quote: true, // 引用
          ol: true, // 有序列表
          ul: true, // 无序列表
          link: true, // 链接
          imagelink: true, // 图片链接
          code: true, // code
          table: true, // 表格
          fullscreen: true, // 全屏编辑
          readmodel: false, // 沉浸式阅读
          htmlcode: true, // 展示html源码
          help: false, // 帮助
          /* 1.3.5 */
          undo: true, // 上一步
          redo: false, // 下一步
          trash: false, // 清空
          save: false, // 保存（触发events中的save事件）
          /* 1.4.2 */
          navigation: false, // 导航目录
          /* 2.1.8 */
          alignleft: true, // 左对齐
          aligncenter: true, // 居中
          alignright: true, // 右对齐
          /* 2.2.1 */
          subfield: true, // 单双栏模式
          preview: true, // 预览
          boxShadow: false
        }
    }
  },
  methods: {
    async pageInit(){
      articleTableData(this.pageSize,this.currentPage,this.searchText).then(res => {
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
      this.itemTitle = '添加文章';
      this.addUser = true;
      this.saveItem = true;
     },
     saveItemOk1(){
       var that = this;
       var formData = this.formData;
       formData.articleState = 1

       updateArticle(this.formData).then(res => {
             if(res.data.result && res.data.result.error){
               this.$Message.warning({
                 content:res.data.result.error
               })
               return;
             }else if(res.data.status === 0){
               this.$Message.success({
                 content:'文章修改成功'
               });
               that.saveItem = false;
               this.formData= {};
               that.pageInit();
             }else if(res.data.errorMsg){
               this.$Message.warning({
                 content:res.data.errorMsg
               })
             }
             that.saveItemStatu = false;
           })
       },

     saveItemOk(){
      var that = this;
      var formData = this.formData;
      let tag = ""
        for (let i = 0; i < this.countTags.length; i++) {
          // eslint-disable-next-line no-unused-vars
          tag += this.countTags[i] + ","
        }
        this.formData.articleTag = tag
        this.formData.managerId = this.managerId
        formData.articleContent = this.contentxt
        formData.articleState = 0

        if(formData.articleName === null || formData.articleName === ''){
          this.$Message.error('请输入文章名称')
          return
        }else if(formData.articleContent === null|| formData.articleContent === ''){
          this.$Message.error('请输入文章内容')
          return
        }else if(formData.articleTag === null || formData.articleTag === ''){
          this.$Message.error('请输入文章标签')
          return
        }
      if(this.addUser){
          saveArticle(this.formData).then(res => {
              if(res.data.result && res.data.result.error){
                this.$Message.warning({
                  content:res.data.result.error
                })
                return;
              }else if(res.data.status === 0){
                this.$Message.success({
                  content:'文章保存成功'
                });
                that.saveItem = false;
                //that.saveItem1 = false;
                that.pageInit();
              }else if(res.data.errorMsg){
                this.$Message.warning({
                  content:res.data.errorMsg
                })
              }
              that.saveItemStatu = false;
            })
        }else {
          updateArticle(this.formData).then(res => {
              if(res.data.result && res.data.result.error){
                this.$Message.warning({
                  content:res.data.result.error
                })
                return;
              }else if(res.data.status === 0){
                this.$Message.success({
                  content:'文章修改成功'
                });
                that.saveItem = false;
                this.formData= {};
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
      commentDel('/article/delete', selectItemArr).then(res => {
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
             this.formData.articleHeadPic = res.data.result.msg
              this.boolPic = true
             this.$Message.success({
              content:'上传成功'
            });
          }
        })
      },
      mavonChangeHandle (context, html) {
       this.contentxt = html
        this.formData.articleContent = marked(html)

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
    articleTableData(10, 1).then(res => {
    if(res.data){
        this.total = res.data.result.data.total
        this.tableData = res.data.result.data.list
      }
    })
	
	findCategory().then(res => {
    if(res.data){
       this.statusArr=res.data.result.data
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
