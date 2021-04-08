import axios from '@/libs/api.request'
import qs from 'qs'
 
export const login = ({ userName, password }) => {
  const data = qs.stringify({
    username: userName,
    password
  })
  console.log(data)
  return axios.request({
    url: '/login/login',
    data,
    method: 'post'
  })
}


export const getUserInfo = (token) => {
  return axios.request({
    url: '/manager/getCurrentManager',
    params: {
      token
    },
    method: 'get'
  })
}

export const logout = (token) => {
  return axios.request({
    url: '/login/noLogin',
    method: 'post'
  })
}
