import { request, config } from 'utils'

const { api } = config
const { task, getPatients } = api

export function task (data) {
  return request({
    url: task,
    method: 'post',
    data,
  })
}

export function getPatients () {
  return request({
    url: getPatients
  })
}
