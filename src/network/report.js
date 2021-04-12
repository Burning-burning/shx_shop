import { request } from './request'
export const getReport = () => request({
  url: 'reports/type/1'
})