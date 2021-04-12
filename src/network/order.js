import { request } from './request'

export const getOrderLists = (query, pagenum, pagesize, user_id, pay_status, is_send, order_fapiao_title, order_fapiao_company, order_fapiao_content, consignee_addr) => request({
  url: 'orders',
  params: {
    query, pagenum, pagesize, user_id, pay_status, is_send, order_fapiao_title, order_fapiao_company, order_fapiao_content, consignee_addr
  }
})