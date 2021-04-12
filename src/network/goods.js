import { request } from './request'
export const getGoodsList = (query, pagenum, pagesize) => request({
  url: 'goods',
  params: {
    query,
    pagenum,
    pagesize
  }
 })