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

export const getParams = (id, sel) => request({
  url: `categories/${id}/attributes`,
  params: {
    sel
  }
})

export const addParams = (id, attr_name, attr_sel, attr_vals) => request({
  url: `categories/${id}/attributes`,
  method: 'post',
  data: {
    attr_name,
    attr_sel,
    attr_vals
  }
})

export const getParamsById = (id, attrId, attr_sel, attr_vals) => request({
  url: `categories/${id}/attributes/${attrId}`,
  params: {
    attr_sel,
    attr_vals
  }
})

export const editParams = (id, attrId, attr_name, attr_sel, attr_vals) => request({
  url: `categories/${id}/attributes/${attrId}`,
  method: 'put',
  data: {
    attr_name,
    attr_sel,
    attr_vals
  }
})

export const deleteParam = (id, attrId) => request({
  url: `categories/${id}/attributes/${attrId}`,
  method: 'delete'
})
export const saveParams = (id, attrId, attr_name, attr_sel, attr_vals) => request({
  url: `categories/${id}/attributes/${attrId}`,
  method: 'put',
  data: {
    attr_name,
    attr_sel,
    attr_vals
  }
})