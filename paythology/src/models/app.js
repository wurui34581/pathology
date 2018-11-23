/* global window */
/* global document */
/* global location */
/* eslint no-restricted-globals: ["error", "event"] */

import { routerRedux } from 'dva/router'
import { parse } from 'qs'
import config from 'config'
import { EnumRoleType } from 'enums'
import { query, logout, patientList, picUrl, result, allLabel, postPicUrl } from 'services/app'
import queryString from 'query-string'

const { prefix } = config

export default {
  namespace: 'app',
  state: {
    user: {username:'admin',password: 'admin',permissions: {role:'admin'}},
    permissions: {
      visit: [],
    },
    patientList: [],
    picUrl: '',
    results: [],
    labelState: false,
    allResult:null,
    picId: '',
    picState: true,
    fileNum: 0,
    curLabel: null,
    loop: false,
    labelIndex: 0,
    menuPopoverVisible: false,
    siderFold: window.localStorage.getItem(`${prefix}siderFold`) === 'true',
    darkTheme: window.localStorage.getItem(`${prefix}darkTheme`) === 'true',
    isNavbar: document.body.clientWidth < 769,
    navOpenKeys: JSON.parse(window.localStorage.getItem(`${prefix}navOpenKeys`)) || [],
    locationPathname: '',
    locationQuery: {},
  },
  subscriptions: {

    setupHistory ({ dispatch, history }) {
      history.listen((location) => {
        dispatch({
          type: 'updateState',
          payload: {
            locationPathname: location.pathname,
            locationQuery: location.query,
          },
        })
      })
    },

    setup ({ dispatch }) {
      dispatch({ type: 'query' })
      let tid
      window.onresize = () => {
        clearTimeout(tid)
        tid = setTimeout(() => {
          dispatch({ type: 'changeNavbar' })
        }, 300)
      }
    },

  },
  effects: {

    * query ({
      payload,
    }, { call, put, select }) {
      //const { success, user } = yield call(query, payload)
      console.log(user,'----------')
      const { success, user } = {success: false, user:{username:'admin',password: 'admin',permissions: {role:'admin'}}}
      const { locationPathname } = yield select(_ => _.app)
      if (success && user) {
        /*const { list } = yield call(menusService.query)
        const { permissions } = user
        let menu = list
        if (permissions.role === EnumRoleType.ADMIN || permissions.role === EnumRoleType.DEVELOPER) {
          permissions.visit = list.map(item => item.id)
        } else {
          menu = list.filter((item) => {
            const cases = [
              permissions.visit.includes(item.id),
              item.mpid ? permissions.visit.includes(item.mpid) || item.mpid === '-1' : true,
              item.bpid ? permissions.visit.includes(item.bpid) : true,
            ]
            return cases.every(_ => _)
          })
        }*/
        yield put({
          type: 'updateState',
          payload: {
            user,
            //permissions,
            //menu,
          },
        })
        yield put(routerRedux.push({
          pathname: '/image',
        }))
        if (location.pathname === '/login') {
          yield put(routerRedux.push({
            pathname: '/image',
          }))
        }
      } else if (config.openPages && config.openPages.indexOf(locationPathname) < 0) {
        yield put(routerRedux.push({
          pathname: '/login',
          search: queryString.stringify({
            from: locationPathname,
          }),
        }))
      }
    },

    * logout ({
      payload,
    }, { call, put }) {
      //const data = yield call(logout, parse(payload))
      const data = {
        message: "Ok",
        statusCode: 200,
        success: true,
      }

      if (data.success) {
        yield put({ type: 'updateState', payload: {
          user: {},
          //permissions: { visit: [] },
          /*menu: [{
              id: 1,
              icon: 'laptop',
              name: 'Dashboard',
              router: '/dashboard',
            }],*/
        }})
        yield put({ type: 'query' })
      } else {
        throw (data)
      }
    },

    * changeNavbar (action, { put, select }) {
      const { app } = yield (select(_ => _))
      const isNavbar = document.body.clientWidth < 769
      if (isNavbar !== app.isNavbar) {
        yield put({ type: 'handleNavbar', payload: isNavbar })
      }
    },

    * patientList ({ payload }, { call, put }) {

      const data = yield call(patientList)
      console.log(data,'-------')

      if(data.success){
        //const pic = yield call(picUrl)
        //const pic = ['/public/1.1.jpg','/public/1.2.jpg','/public/1.3.jpg','/public/1.4.jpg']
        yield put({ type: 'savePatient', payload: data.list })
        if(data.list.length){
          yield put({ type: 'getPic', payload: data.list[0].dzi_path })
          yield put({ type: 'getResults', payload: data.list[0].result })
          yield put({ type: 'getPicId', payload: data.list[0].id })
          yield put({ type: 'getAll', payload: data.list[0] })
        }
      }

    },
    * updatePatientList ({ payload }, { call, put }) {

      const data = yield call(patientList)

      if(data.success){
        yield put({ type: 'savePatient', payload: data.list })
      }

    },

    * getResult ({ payload }, { call, put }) {
      const data = yield call(result, payload)
      yield put({ type: 'result', payload: data })
    },
    * confirmResult({ payload }, { call, put }) {
      const data = yield call(allLabel, payload)
      if(data.success) {
        yield put({type: 'updatePatientList'})
      }
    },
    * postPicUrl({ payload }, { call, put }) {
      const data = yield call(postPicUrl, payload)
      if(data.success) {
        yield put({type: 'patientList'})
      }
    },
  },
  reducers: {
    updateState (state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },

    savePatient (state, { payload }) {
      return {
        ...state,
        patientList: payload
      }
    },

    getPicId (state, { payload }) {
      return {
        ...state,
        picId: payload
      }
    },

    getPic(state, { payload }){
      return {
        ...state,
        picUrl: payload
      }
    },
    getResults(state, { payload }){
      return {
        ...state,
        results: payload
      }
    },
    getAll(state, { payload }){
      return {
        ...state,
        allResult: payload
      }
    },
    picState(state, { payload }){
      return {
        ...state,
        picState: payload
      }
    },
    loop(state, { payload }){
      return {
        ...state,
        loop: payload
      }
    },
    fileNum(state, { payload }){
      return {
        ...state,
        fileNum: payload
      }
    },

    result (state, { payload }) {
      return {
        ...state,
        //result: payload.data
        result: [{
          size: 23,
          level: 2,
          label: [{
            x: 0.1,
            y: 0.1
          },{
            x: 0.2,
            y: 0.2
          },{
            x: 0.15,
            y: 0.2
          },{
            x: 0.1,
            y: 0.2
          },{
            x: 0.1,
            y: 0.1
          }]
        },{
          size: 23,
          level: 2,
          label: [{
            x: 0.1,
            y: 0.1
          },{
            x: 0.2,
            y: 0.2
          },{
            x: 0.15,
            y: 0.2
          },{
            x: 0.1,
            y: 0.2
          },{
            x: 0.1,
            y: 0.1
          }]
        },{
          size: 23,
          level: 2,
          label: [{
            x: 0.1,
            y: 0.1
          },{
            x: 0.2,
            y: 0.2
          },{
            x: 0.15,
            y: 0.2
          },{
            x: 0.1,
            y: 0.2
          },{
            x: 0.1,
            y: 0.1
          }]
        }]
      }
    },

    currentLabel ( state, { payload } ) {
      return {
        ...state,
        curLabel: payload.label,
        labelState: !state.labelState,
        labelIndex: payload.index
      }
    },

    switchSider (state) {
      window.localStorage.setItem(`${prefix}siderFold`, !state.siderFold)
      return {
        ...state,
        siderFold: !state.siderFold,
      }
    },

    switchTheme (state) {
      window.localStorage.setItem(`${prefix}darkTheme`, !state.darkTheme)
      return {
        ...state,
        darkTheme: !state.darkTheme,
      }
    },

    switchMenuPopver (state) {
      return {
        ...state,
        menuPopoverVisible: !state.menuPopoverVisible,
      }
    },

    handleNavbar (state, { payload }) {
      return {
        ...state,
        isNavbar: payload,
      }
    },

    handleNavOpenKeys (state, { payload: navOpenKeys }) {
      return {
        ...state,
        ...navOpenKeys,
      }
    },
  },
}
