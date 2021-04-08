import { request } from './request'

export const getMenus = () => request({
  url: '/menus'
})