// import axios from 'axios'
import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/api/v1/test/',
    method: 'get',
    params
  })
}
export function getPassby(params) {
  return request({
    url: '/api/v1/getPassby/',
    method: 'get',
    params
  })
}
// var getUserPassby = (params) => {
//    return axios.get('http://127.0.0.1:5000/api/v1/test/', { params: params })
// }
