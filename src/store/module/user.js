import { login,regist ,logout, getUserInfo } from '@/api/user'
import { setToken, getToken } from '@/libs/util'
import { Modal,Message } from 'iview'

export default {
  state: {
    userName: '',
    userId: '',
    avatorImgPath: '',
    headPic: '',
    token: getToken(),
    access: '',
    hasGetInfo: false,
  },
  mutations: {
    setAvator (state, avatorPath) {
      state.avatorImgPath = avatorPath
    },
    setUserId (state, id) {
      state.userId = id
    },
    setUserName (state, userName) {
      state.userName = userName
    },
    setPassword (state, password) {
      state.password = password
    },
    setHeadPic (state, headPic) {
      state.headPic = headPic
    },
    setPhone (state, phone) {
      state.phone = phone
    },
    setName (state, name) {
      state.name = name
    },
    setNewsCount(state,newsCount){
      state.newsCount = newsCount
    },
    setToken (state, token) {
      state.token = token
      setToken(token)
    },
    setHasGetInfo (state, status) {
      state.hasGetInfo = status
    },
    setAccess(state,access){
      state.access=access
    }
  },
  actions: {
    // 登录
    handleLogin ({ commit }, {userName, password}) {
      userName = userName.trim()
      return new Promise((resolve, reject) => {
        login({
          userName,
          password
        }).then(res => {
          console.log("用户信息" +JSON.stringify(res))
          if(res.data.result){
            if(res.data.result.error){
              Message.error(res.data.result.error);
            }
          }
          const data = res.data
          commit('setToken', data.result.token)
          resolve()
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 退出登录
    handleLogOut ({ state, commit }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('setToken', '')
          commit('setAccess', [])
          resolve()
        }).catch(err => {
          reject(err)
        })
        // 如果你的退出登录无需请求接口，则可以直接使用下面三行代码而无需使用
        // commit('setToken', '')
        // commit('setAccess', [])
        // resolve()
      })
    },
    // 获取用户相关信息
    getUserInfo ({ state, commit }) {
      return new Promise((resolve, reject) => {
        try {
          getUserInfo(state.token).then(res => {
            console.log(JSON.stringify(res))
            const data = res.data
            if (null != data.result.headPic) {
              commit('setAvator', 'http://localhost:8081/picture/'+data.result.data.headPic)
            }else {
              commit('setAvator', 'http://localhost:8081/picture/'+'1.png')
            }

            commit('setUserName', data.result.data.username)
            commit('setHeadPic', data.result.data.headPic)
            commit('setPhone', data.result.data.phone)
            commit('setUserId', data.result.data.id)
            commit('setName', data.result.data.name)
            commit('setPassword', data.result.data.password)
            
            commit('setAccess', data.result.data.type)
            // commit('setNewsCount', data.result.count)
            commit('setHasGetInfo', true)
            resolve(data)
          }).catch(err => {
            reject(err)
          })
        } catch (error) {
          reject(error)
        }
      })
    }
  }
}
