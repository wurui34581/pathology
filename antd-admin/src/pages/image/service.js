import { request, config } from 'utils'

const { api } = config
const { postLabel } = api

export function createLabel (data) {
  return request({
    url: postLabel,
    method: 'post',
    data,
  })
}
