import axios from 'axios'
import { jsonToFormData } from '../utils/storage'
import Qs from 'qs'
axios.defaults.timeout = 10000
axios.defaults.headers.post['Content-Type'] = 'application/x-www=form-urlencoded'
export default {
  fetchGet(url, params = {}, headerdata = { timeout: 10000, headers: { ContentType: 'application/json;charset=utf-8' } }) {
    const value = Qs.stringify(params)
    return new Promise((resolve, reject) => {
      axios.get(`${url}?${value}`, headerdata).then(res => {
        resolve(res.data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  fetchPost(url, params = {}, headerdata = { timeout: 10000, headers: { ContentType: 'application/x-www=form-urlencoded' } }) {
    const value = jsonToFormData(params)
    return new Promise((resolve, reject) => {
      axios.post(url, value, headerdata).then(res => {
        resolve(res.data)
      }).catch(error => {
        console.log('error', error)
        reject(error)
      })
    })
  }
}
