import http from './public'
import {getStore, isNotBlank} from '../utils/storage'

// const getToken = isNotBlank(getStore('token')) ? getStore('token') : ''
// const headerdata = {headers: { token: getToken }}
// 登陆
export const userLogin1 = (params, headerdt) => {
  return http.fetchPost('/api/Mall/login', params, headerdt)
}

// 退出
export const userLogout = (params) => {
  return http.fetchPost('/api/Mall/logout', params)
}

// 获取用户信息
export const getUserInfo = (params) => {
  return http.fetchPost('/api/Mall/sys/user/getUserInfo', params)
}

// export const userInfo1 = (params, headerdata) => {
//   return http.fetchPost('/api/Mall/sys/user/info', params, headerdata)
// }

export const findGoodsTypeList = (params) => {
  return http.fetchPost('/api/Mall/beauty/byBrand/getByBrandListNoPage', params) 
}

// 首页轮番图列表
export const findIndexPhoto = (params) => {
  return http.fetchPost('/api/Mall/admin/doc/findIndexPhoto', params) 
}

// 新增收货地址
export const postByHarvestAddress = (params) => {
  return http.fetchPost('/api/Mall/beauty/byHarvestAddress/postByHarvestAddress', params) 
}

// 删除收货地址
export const deleteByHarvestAddress = (params) => {
  return http.fetchPost('/api/Mall/beauty/byHarvestAddress/deleteByHarvestAddress', params) 
}

// 收货地址列表
export const getByHarvestAddressListNoPage = (params) => {
  return http.fetchPost('/api/Mall/beauty/byHarvestAddress/getByHarvestAddressListNoPage', params) 
}

// 用户下单
export const buyAllToOrderr = (params) => {
  return http.fetchPost('/api/Mall/beauty/order/buyAllToOrder', params) 
}

// 门店的基本信息
export const getStoreById = (params) => {
  return http.fetchPost('/api/Mall/api/store/getStoreById', params) 
}

// 门店的基本信息
export const UploadPhoto = (params) => {
  return http.fetchPost('/api/Mall/sys/user/UploadPhoto', params) 
}


// // 登陆
// export const userLogin = (params) => {
//   return http.fetchPost('/apis/member/login', params)
// }
// // 退出登陆
// export const loginOut = (params) => {
//   return http.fetchGet('/apis/member/loginOut', params)
// }
// // 用户信息
// export const userInfo = (params) => {
//   return http.fetchGet('/apis/member/checkLogin', params)
// }
// // 注册账号
// export const register = (params) => {
//   return http.fetchPost('/apis/member/register', params)
// }
// // 上传图片
// export const upload = (params) => {
//   return http.fetchPost('/apis/member/imgaeUpload', params)
// }
// // 修改头像
// export const updateheadimage = (params) => {
//   return http.fetchPost('/apis/member/updateheadimage', params)
// }
// // 捐赠列表
// export const thanksList = (params) => {
//   return http.fetchGet('/apis/member/thanks', params)
// }
// // 首页接口
// export const productHome = (params) => {
//   return http.fetchGet('/apis/goods/home', params)
// }
// // 首页接口
// export const navList = (params) => {
//   return http.fetchGet('/apis/goods/navList', params)
// }
// // 推荐板块
// export const recommend = (params) => {
//   return http.fetchGet('/apis/goods/recommend', params)
// }
// // 捐赠板块
// export const thank = (params) => {
//   return http.fetchGet('/apis/goods/thank', params)
// }
// // 极验验证码
// export const geetest = (params) => {
//   return http.fetchGet('/apis/member/geetestInit?t=' + (new Date()).getTime(), params)
// }

