import { request } from './request'

export const getRoles = () => request({
  url: 'roles'
})
export const deleteRole = (roleId, rightId) => request({
  url: `roles/${roleId}/rights/${rightId}`,
  method: 'delete'
})
export const allocateRole = (id, rid) => request({
  url: `users/${id}/role`,
  method: 'put',
  data: {
    rid
  }
})