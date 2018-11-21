import { request, config } from 'utils'

const { api } = config
const { user, userLogout, userLogin, getPatients, resource, getResult, postAll, postPic } = api

export function login (params) {
  return request({
    url: userLogin,
    method: 'post',
    data: params,
  })
}

export function logout (params) {
  return request({
    url: userLogout,
    method: 'get',
    data: params,
  })
}

export function query (params) {
  return request({
    url: user.replace('/:id', ''),
    method: 'get',
    data: params,
  })
}

export function patientList () {
  return request({
    url: getPatients,
    method: 'get',
  })
}

export function picUrl (params) {
  return request({
    url: resource.replace('/:id', ''),
    method: 'get',
    data: params
  })
}

export function result (params) {
  return request({
    url: getResult.replace('/:job_id', ''),
    method: 'get',
    data: params
  })
}

export function allLabel (params) {
  return request({
    url: postAll,
    method: 'post',
    data: params
  })
}

export function postPicUrl (params) {
  return request({
    url: postPic,
    method: 'post',
    data: params
  })
}
