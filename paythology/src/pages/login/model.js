import { routerRedux } from 'dva/router'
import { login } from './service'

export default {
  namespace: 'login',

  state: {},

  effects: {
    * login ({
      payload,
    }, { put, call, select }) {
      //const data = yield call(login, payload)
      const data = {
        message: "Ok",
        statusCode: 200,
        success: true,
      }
      const { locationQuery } = yield select(_ => _.app)
      if (data.success) {
        const { from } = locationQuery
        //yield put({ type: 'app/query' })
        yield put({ type: 'app/patientList' })
        yield put(routerRedux.push('/image'))
        /*if (from && from !== '/login') {
          yield put(routerRedux.push(from))
        } else {
          yield put(routerRedux.push('/image'))
        }*/
      } else {
        throw data
      }
    },
  },

}
