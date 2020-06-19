/* eslint-disable camelcase */
import Vue from 'vue'
import router from './router'
import store from './store/'
import App from './App'
import VueLazyload from 'vue-lazyload'
import infiniteScroll from 'vue-infinite-scroll'
import VueCookie from 'vue-cookie'
import { userInfo, userLogout } from './api'
import {
  Button, Pagination, Checkbox, Icon, Autocomplete, Loading, Message, Notification, Steps, Step, Table, TableColumn, Input, Dialog, Cascader,
  Select, Option, Radio, MessageBox, Form, FormItem, Collapse, CollapseItem, Popover, Upload, Row, Col
} from 'element-ui'
import VueContentPlaceholders from 'vue-content-placeholders'
import 'element-ui/lib/theme-chalk/index.css'
// import 'element-ui/lib/theme-default/index.css'
import { getStore, isNotBlank, setStore, removeStore } from '/utils/storage'
import { SoftKey3W } from '/utils/Syunew3'
import axios from 'axios'

Vue.use(VueContentPlaceholders)
Vue.use(Upload)
Vue.use(Row)
Vue.use(Col)
Vue.use(Collapse)
Vue.use(Popover)
Vue.use(CollapseItem)
Vue.use(Cascader)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Button)
Vue.use(Pagination)
Vue.use(Checkbox)
Vue.use(Icon)
Vue.use(Autocomplete)
Vue.use(Steps)
Vue.use(Step)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Input)
Vue.use(Dialog)
Vue.use(Select)
Vue.use(Option)
Vue.use(Radio)
Vue.use(Loading.directive)
Vue.prototype.$loading = Loading.service
Vue.prototype.$notify = Notification
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
Vue.use(infiniteScroll)
Vue.use(VueCookie)

Vue.use(VueLazyload, {
  // preLoad: 1.3,
  // error: 'dist/error.png',
  loading:'/shop/static/images/load.gif'
  // attempt: 1
})
Vue.config.productionTip = false

axios.interceptors.request.use(config => {
  // 在发送请求之前做些什么
  //判断是否存在token，如果存在将每个页面header都添加token
  // store.state.token  token是保存在vuex中
  if (sessionStorage.getItem('token')) {
    config.headers.token = sessionStorage.getItem('token')
  } else {
    router.push({
      path: '/login'
    })
  }
  return config
}, error => {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// http response 拦截器
axios.interceptors.response.use(
  response => {
    response.headers = {
      'Content-Type': 'application/x-www-form-urlencoded' // 设置很关键
    }
    return response
  },
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          //this.$store.commit('del_token')
          router.replace({
            path: '/login',
            query: { redirect: router.currentRoute.fullPath }//登录成功后跳入浏览的当前页面
          })
      }
    }
    return Promise.reject(error.response.data)
  })

const whiteList = ['/home', '/goods', '/login', '/shops', '/register', '/goodsDetails', '/thanks', '/search', '/refreshsearch', '/refreshgoods'] // 不需要登陆的页面
router.beforeEach(function (to, from, next) {
  // userInfo(params).then(res => {
  //   if (res.result.state !== 1) { // 没登录

  if (to.path !== '/login') {
    if (isNotBlank(sessionStorage.getItem('token'))) {
      next()
    } else {
      next({ path: '/login' })
    }
  } else {
    next()
  }
})

// var bConnect = 0

// enterload()

// function enterload() {
//   // if (getStore('token')&&sessionStorage.getItem('keyID')) return// 如果已自动登录则退出
//   if (isNotBlank(getStore('token')) && !isNotBlank(sessionStorage.getItem('keyID'))) {
//     console.log(isNotBlank(getStore('token')), !isNotBlank(sessionStorage.getItem('keyID')))
//     localStorage.clear()
//     sessionStorage.clear()
//     router.push({
//       path: '/login'
//     })
//   }
//   // 如果是IE10及以下浏览器，则使用AVCTIVEX控件的方式
//   if (navigator.userAgent.indexOf('MSIE') > 0 && !navigator.userAgent.indexOf('opera') > -1) {
//     setTimeout(Handle_IE10, 1000)
//     return
//   }
//   try {
//     var s_pnp = new SoftKey3W()
//     s_pnp.Socket_UK.onopen = function () {
//       bConnect = 1// 代表已经连接，用于判断是否安装了客户端服务
//       setTimeout(login_onclick, 500)
//     }

//     // 在使用事件插拨时，注意，一定不要关掉Sockey，否则无法监测事件插拨
//     s_pnp.Socket_UK.onmessage = function got_packet(Msg) {
//       var PnpData = JSON.parse(Msg.data)
//       if (PnpData.type == 'PnpEvent')// 如果是插拨事件处理消息
//       {
//         if (PnpData.IsIn) {
//           alert('UKEY已被插入，被插入的锁的路径是：' + PnpData.DevicePath)
//         } else {
//           alert('UKEY已被拨出，被拨出的锁的路径是：' + PnpData.DevicePath)
//           localStorage.clear()
//           sessionStorage.clear()
//           router.push({
//             path: '/login'
//           })
//           // userLogout().then(res => {
//           //   router.push({
//           //     path: '/login'
//           //   })
//           // })
//           // alert("UKEY已被拨出，被拨出的锁的路径是：" + PnpData.DevicePath);
//         }
//       }
//     }

//     s_pnp.Socket_UK.onclose = function () {

//     }
//     setTimeout(err_Connect, 3000)// 如果在一定时间内还没有连接成功，就提示要安装服务
//   } catch (e) {
//     alert(e.name + ': ' + e.message)
//     return false
//   }
// }

// function login_onclick() {
//   // 判断是否安装了服务程序，如果没有安装提示用户安装
//   if (bConnect == 0) {
//     window.alert('未能连接服务程序，请确定服务程序是否安装。'); return false
//   }
//   var DevicePath, ID_1, ID_2
//   try {
//     // 由于是使用事件消息的方式与服务程序进行通讯，
//     // 好处是不用安装插件，不分系统及版本，控件也不会被拦截，同时安装服务程序后，可以立即使用，不用重启浏览器
//     // 不好的地方，就是但写代码会复杂一些
//     var s_simnew1 = new SoftKey3W() // 创建UK类

//     s_simnew1.Socket_UK.onopen = function () {
//       s_simnew1.ResetOrder()// 这里调用ResetOrder将计数清零，这样，消息处理处就会收到0序号的消息，通过计数及序号的方式，从而生产流程
//     }

//     // 写代码时一定要注意，每调用我们的一个UKEY函数，就会生产一个计数，即增加一个序号，较好的逻辑是一个序号的消息处理中，只调用我们一个UKEY的函数
//     s_simnew1.Socket_UK.onmessage = function got_packet(Msg) {
//       var UK_Data = JSON.parse(Msg.data)
//       if (UK_Data.type != 'Process') return// 如果不是流程处理消息，则跳过
//       switch (UK_Data.order) {
//         case 0:
//           {
//             s_simnew1.FindPort(0)// 发送命令取UK的路径
//           }
//           break//! !!!!重要提示，如果在调试中，发现代码不对，一定要注意，是不是少了break,这个少了是很常见的错误
//         case 1:
//           {
//             if (UK_Data.LastError != 0) { window.alert('未发现加密锁，请插入加密锁'); s_simnew1.Socket_UK.close(); return false }
//             DevicePath = UK_Data.return_value// 获得返回的UK的路径
//             s_simnew1.GetID_1(DevicePath) // 发送命令取ID_1
//           }
//           break
//         case 2:
//           {
//             if (UK_Data.LastError != 0) { window.alert('返回ID号错误，错误码为：' + UK_Data.LastError.toString()); s_simnew1.Socket_UK.close(); return false }
//             ID_1 = UK_Data.return_value// 获得返回的UK的ID_1
//             s_simnew1.GetID_2(DevicePath) // 发送命令取ID_2
//           }
//           break
//         case 3:
//           {
//             if (UK_Data.LastError != 0) { window.alert('取得ID错误，错误码为：' + UK_Data.LastError.toString()); s_simnew1.Socket_UK.close(); return false }
//             ID_2 = UK_Data.return_value// 获得返回的UK的ID_2
//             alert(toHex(ID_1) + toHex(ID_2))
//             sessionStorage.setItem('keyID', toHex(ID_1) + toHex(ID_2))
//             // setStore('keyID', toHex(ID_1) + toHex(ID_2))
//             //! !!!!注意，这里一定要主动提交，
//             // frmlogin.submit();

//             // 所有工作处理完成后，关掉Socket
//           }
//           break
//       }
//     }
//     s_simnew1.Socket_UK.onclose = function () {

//     }
//     return true
//   } catch (e) {
//     alert(e.name + ': ' + e.message)
//   }
// }

// function err_Connect() {
//   if (bConnect == 1) return
//   alert('未能连接服务程序，请确定服务程序是否安装。')
// }

// var digitArray = new Array('0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f')

// function toHex(n) {
//   var result = ''
//   var start = true

//   for (var i = 32; i > 0;) {
//     i -= 4
//     var digit = (n >> i) & 0xf

//     if (!start || digit != 0) {
//       start = false
//       result += digitArray[digit]
//     }
//   }

//   return (result == '' ? '0' : result)
// }

// function Handle_IE10 () {
//   try {
//     var DevicePath,
//     s_simnew1,
//     // 创建或控件

//     s_simnew1 = new ActiveXObject('Syunew3A.s_simnew3')

//     DevicePath = s_simnew1.FindPort(0)// '来查找加密锁，0是指查找默认端口的锁
//     if (s_simnew1.LastError != 0) {
//       window.alert('未发现加密锁，请插入加密锁'); return false
//     } else {
//       // 获取锁的ID
//       frmlogin.KeyID.value = toHex(s_simnew1.GetID_1(DevicePath)) + toHex(s_simnew1.GetID_2(DevicePath))
//       if (s_simnew1.LastError != 0) {
//         window.alert('获取ID错误,错误码是' + s_simnew1.LastError.toString())
//         return false
//       }
//       frmlogin.submit()
//       return true
//     }
//   } catch (e) {
//     alert(e.name + ': ' + e.message + '。可能是没有安装相应的控件或插件')
//     return false
//   }
// }

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App)
})
