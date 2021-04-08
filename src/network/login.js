import { request } from './request'

export const login = (username, password) => request({
  url: 'login',
  method: 'post',
  data: {
    username,
    password
  }
})