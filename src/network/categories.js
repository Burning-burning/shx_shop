import { request } from './request'
export const getCategoryList = (type, pagenum, pagesize) => request({
  url: 'categories',
  params: {
    type,
    pagenum,
    pagesize
  }
})
export const addCategory = (cat_pid, cat_name, cat_level) => request({
  url: 'categories',
  method: 'post',
  data: {
    cat_pid,
    cat_name,
    cat_level
  }
})