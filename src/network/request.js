import axios from 'axios'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
export function request (config) {
  const instance = axios.create({
    baseURL: 'https://www.liulongbin.top:8888/api/private/v1/',
    timeout: 5000
  })
  instance.interceptors.request.use(config => {
    NProgress.start()
    config.headers.Authorization = window.sessionStorage.getItem('token')
    return config
  }, err => {
    console.log(err)
  })
  instance.interceptors.response.use(res => {
    NProgress.done()
    return res.data
  }, err => {
    console.log(err)
  })

  return instance(config)
}
