import { request } from './request'
export const getWuliuInfo = (id) => request({
  url: `kuaidi/${id}`
})