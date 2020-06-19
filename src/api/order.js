import http from './public'
import { getStore, isNotBlank } from '../utils/storage'

// const getToken = isNotBlank(getStore('token')) ? getStore('token') : ''
// const headerdata = { headers: { token: getToken } }
const APPCODE = '0189d6817a5247d3a7d7a8fa058abfc3'
const headerdata = {
  headers: {
    authorization: `APPCODE ${APPCODE}`,
    'Access-Control-Allow-Origin': 'http://xfm-erp.vip:8081',
    'access-control-allow-credentials': 'true',
    withCredentials: false
  }
}
// 查询用户订单
export const getUserOrderList = (params) => {
  return http.fetchPost('/api/Mall/beauty/order/findOrderList', params)
}

//  用户取消订单 
export const userCancelOrder = (params) => {
  return http.fetchPost('/api/Mall/beauty/order/cancelOrader', params)
}

// 用户确认收货
export const userConfrmTakeGoods = (params) => {
  return http.fetchPost('/api/Mall/beauty/order/takeGoods', params)
}

// 用户获取订单详情
export const getOrderDet = (params) => {
  return http.fetchGet('/api/Mall/beauty/order/findOrderDetails', params)
}

// 用户申请退货
export const applyRefund = (params) => {
  return http.fetchPost('/api/Mall/beauty/order/applyRefund', params)
}

//  商家同意退货之后用户填写物流信息
export const fillLogistice = (params) => {
  return http.fetchPost('/api/Mall/beauty/order/orderReturnsLogistics', params)
}

// 快递物流查询 authorization: `APPCODE ${APPCODE}`
export const getKdi = (params) => {
  return http.fetchGet(`/api/Mall/beauty/order/sendGetLogistics`, params)
}
