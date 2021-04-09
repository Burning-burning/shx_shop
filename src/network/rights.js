import { request } from './request'

export const getRights = (type) => request({
  url: `rights/${type}`
})

export const saveRightsById = (roleId, rids) => request({
  url: `roles/${roleId}/rights`,
  method: 'post',
  data: { rids }
})
