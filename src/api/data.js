import axios from '@/libs/api.request'
import qs from 'qs'

export const getTableData = () => {
  return axios.request({
    url: 'get_table_data',
    method: 'get'
  })
}

// 首页统计
export const findCategory = () => {
  return axios.request({
    url: '/article/getAllArticleType',
    method: 'get'
  })
}

//注册
export const regist =(formData)=> {
  console.log(JSON.stringify(formData))
  const data = qs.stringify({
    name:formData.name,
    phone:formData.phone,
    username:formData.username,
    password:formData.password,
    confirmPwd:formData.confirmPwd,
    identityId:formData.identity,
    subjectId:formData.subjectId
  })
   //console.log(data)
  return axios.request({
    url: '/regist.zhtml',
//    emulateJSON:true,
    data,
    method: 'post'
  })
}
// 首页统计
export const statisticAllData = () => {
  const data = qs.stringify({})
  return axios.request({
    url: '/statistic/statisticAll',
    data,
    method: 'post'
  })
}
export const statisticAllNotice = () => {
  const data = qs.stringify({})
  return axios.request({
    url: '/statistic/statisticAllNotice',
    data,
    method: 'post'
  })
}
// 删除方法
export const commentDel = (url, ids) => {
  const params = {
    ids:`${ids}`
  }
  return axios.request({
    url:url,
    params,
    method: 'delete'
  })
}

export const getIpByManagerId = (managerId) => {
  return axios.request({
    url: `/ip-address/${managerId}`,
    method: 'get'
  })
}

// 启用禁用方法
export const handle = (url, ids) => {
  const data = qs.stringify({
    ids
  },{ indices: false })
  return axios.request({
    url:url,
    data,
    method: 'put'
  })
}


// 删除方法
export const commentDels = (url, ids,states) => {
  const data = qs.stringify({
    ids,
    states
  },{ indices: false })
  return axios.request({
    url:url,
    data,
    method: 'post'
  })
}

export const newsTableData = (pageSize, currentPage,searchText) => {
  //alert(2)
  const params = {
    orderByClause:'createTime DESC',
    pageSize,
    currentPage,
    nickname: searchText
  }
  return axios.request({
    url: '/comment/list',
    params,
    method: 'get'
  })
}

// 管理员列表
export const ManagerTableData = (pageSize, currentPage,searchText) => {
  const params = {
    pageSize,
    currentPage,
    name: searchText
  }
  return axios.request({
     url: '/manager/list',
     params,
     method: 'get'
  })
}

//添加管理员
export const addManager = (formData) => {
  const data = qs.stringify({
    username:formData.username,
    password:formData.password,
    name:formData.name,
  })
 return axios.request({
   url: '/manager/save',
   data:data,
   method: 'post'
 })
}

//编辑管理员
export const updateManager = (formData) => {
  const data = qs.stringify({
    id:formData.id,
    username:formData.username,
    password:formData.password,
    name:formData.name,
  })
 return axios.request({
   url: '/manager/update',
   data:data,
   method: 'post'
 })
}

//分类列表
export const categoryTableData = (pageSize, currentPage) => {
  const params = {
    pageSize,
    currentPage,
  }
  return axios.request({
    url: '/category/list',
    params,
    method: 'get'
  })
}

//保存分类
export const savecategory = (formData) => {
	const data = qs.stringify({
	  name:formData.name,
	})
 return axios.request({
   url: '/category/save',
   data:data,
   method: 'post'
 })
}

//秀嘎分类
export const updatecategory = (formData) => {
	const data = qs.stringify({
	 id:formData.id,
	 name:formData.name,
	})
 return axios.request({
   url: '/category/save',
   data:data,
   method: 'post'
 })
}

//文章列表
export const articleTableData = (pageSize, currentPage,searchText) => {
  const params = {
    pageSize,
    currentPage,
    articleName:searchText
  }
  return axios.request({
    url: '/article/list',
    params,
    method: 'get'
  })
}

export const removeCurrentPic = (formData) => {
  const data = qs.stringify({
    id : formData.id,
    headPic:formData.headPic
  })
  console.log(JSON.stringify(data))
  return axios.request({
    url: '/current/removeCurrentPic',
    data,
    method: 'post'
  })
}

//上传文件
export const uploadFile = (file) => {
  let formData = new FormData()
  formData.append('file', file)
  return axios.request({
    url: '/file/upload',
    data: formData,
    method: 'post'
  })
}

//保存文章
export const saveArticle = (formData) => {
 return axios.request({
   url: '/article/save',
   data:formData,
   method: 'post'
 })
}

export const updateArticle = (formData) => {
  return axios.request({
    url: '/article/update',
    data:formData,
    method: 'put'
  })
 }



// 当前登录人编辑
export const updateCurrent = (formData) => {
   //console.log('777'+JSON.stringify(formData));
  const data = qs.stringify({
    id:formData.userId,
    name:formData.name,
    phone:formData.phone,
//    oldpassword:formData.oldpassword,
//    password:formData.password,
//    confirmPwd:formData.confirmPwd,
    access:formData.access
  },{ indices: false })
  // console.log('666666'+JSON.stringify(data));
  return axios.request({
    url: '/current/updateCurrent',
    data,
    method: 'post'
  })
}

// 当前登录人编辑密码
export const updateCurrent1 = (formData) => {
   //console.log('777'+JSON.stringify(formData));
  const data = qs.stringify({
    id:formData.userId,
    oldPassword:formData.oldPassword,
    password:formData.newPassword,
    confirmPwd:formData.confirmPwd,
    access:formData.access
  },{ indices: false })
   //console.log('666666'+JSON.stringify(data));
  return axios.request({
    url: '/current/updateCurrent1',
    data,
    method: 'post'
  })
}



export const getDragList = () => {
  return axios.request({
    url: 'get_drag_list',
    method: 'get'
  })
}

export const errorReq = () => {
  return axios.request({
    url: 'error_url',
    method: 'post'
  })
}

export const saveErrorLogger = info => {
  return axios.request({
    url: 'save_error_logger',
    data: info,
    method: 'post'
  })
}
