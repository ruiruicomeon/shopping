import http from './public'
import { getStore, isNotBlank } from '../utils/storage'

// const getToken = isNotBlank(getStore('token')) ? getStore('token') : ''
// const headerdata = { headers: { token: getToken } }

// 查询产品列表(或查询商铺产品列表)
export const selectGoodsList = (params) => {
  return http.fetchPost('/api/Mall/api/goodsApi/selectGoodsList', params)
}

// 查询产品详情
export const getGoodsDeati = (params) => {
  return http.fetchPost('/api/Mall/api/goodsApi/getGoodsDeati', params)
}

// 查询商铺列表
export const getStoreList = (params) => {
  return http.fetchPost('/api/Mall/api/store/getStoreList', params)
}

// 产品详情
export const getGoodsDeatil = (params) => {
  return http.fetchPost('/api/Mall/api/goodsApi/getGoodsDeatil', params)
}

// 产品详情
export const findCartByGoodsJson = (params) => {
  return http.fetchPost('/api/Mall/beauty/order/findCartByGoodsJson', params)
}

// 用户下单
export const buyAllToOrder = (params) => {
  return http.fetchPost('/api/Mall/beauty/order/buyAllToOrder', params)
}

// 获取商城首页的商品列表
export const getIndexPageGoods = (params) => {
  return http.fetchPost('/api/Mall/api/goodsApi/goodsIndex', params )
}

// // 商品列表
// export const getAllGoods = (params) => {
//   return http.fetchGet('/apis/goods/allGoods', params)
// }
// // 获取购物车列表
// export const getCartList = (params) => {
//   return http.fetchPost('/apis/member/cartList', params)
// }
// // 加入购物车
// export const addCart = (params) => {
//   return http.fetchPost('/apis/member/addCart', params)
// }
// // 删除购物车
// export const delCart = (params) => {
//   return http.fetchPost('/apis/member/delCart', params)
// }
// // 删除购物车勾选商品
// export const delCartChecked = (params) => {
//   return http.fetchPost('/apis/member/delCartChecked', params)
// }
// // 编辑购物车
// export const cartEdit = (params) => {
//   return http.fetchPost('/apis/member/cartEdit', params)
// }
// // 全选
// export const editCheckAll = (params) => {
//   return http.fetchPost('/apis/member/editCheckAll', params)
// }
// // 删除整条购物车
// export const cartDel = (params) => {
//   return http.fetchPost('/apis/member/cartDel', params)
// }
// // 获取用户地址
// export const addressList = (params) => {
//   return http.fetchPost('/apis/member/addressList', params)
// }
// // 通过id获取地址
// export const getAddress = (params) => {
//   return http.fetchPost('/apis/member/address', params)
// }
// // 修改收货地址
// export const addressUpdate = (params) => {
//   return http.fetchPost('/apis/member/updateAddress', params)
// }
// // 添加收货地址
// export const addressAdd = (params) => {
//   return http.fetchPost('/apis/member/addAddress', params)
// }
// // 删除收货地址
// export const addressDel = (params) => {
//   return http.fetchPost('/apis/member/delAddress', params)
// }
// // 生成订单
// export const submitOrder = (params) => {
//   return http.fetchPost('/apis/member/addOrder', params)
// }
// // 支付
// export const payMent = (params) => {
//   return http.fetchPost('/apis/member/payOrder', params)
// }
// // 获取用户订单
// export const orderList = (params) => {
//   return http.fetchGet('/apis/member/orderList', params)
// }
// // 获取单个订单详情
// export const getOrderDet = (params) => {
//   return http.fetchGet('/apis/member/orderDetail', params)
// }
// // 取消订单
// export const cancelOrder = (params) => {
//   return http.fetchPost('/apis/member/cancelOrder', params)
// }
// // 商品详情
// export const productDet = (params) => {
//   return http.fetchGet('/apis/goods/productDet', params)
// }
// // 删除订单
// export const delOrder = (params) => {
//   return http.fetchGet('/apis/member/delOrder', params)
// }
// // 商品列表
// export const getSearch = (params) => {
//   return http.fetchGet('/apis/goods/search', params)
// }
// // 快速搜索
// export const getQuickSearch = (params) => {
//   return http.fetchGet('/apis/goods/quickSearch', params)
// }



