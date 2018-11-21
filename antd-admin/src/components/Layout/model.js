import { parse } from 'qs'
import modelExtend from 'dva-model-extend'
import { model } from 'utils/model'
import {savePatient, getPatients} from "../../pages/login/service";

export default modelExtend(model, {
  namespace: 'layout',
  state: {
    job_id: []
  },

  effects: {
    * task ({ payload, }, { put, call, select }) {
      const data = yield call(savePatient, payload);
      if (data.success) {
        yield put({ type: 'task', payload: data.data.job_id})
      } else {
        throw data
      }
    },
    * patientList ({ payload }, { put, call, select }) {
      const data = yield call(getPatients);

    }
  },

  reducers: {
    task( state, {payload}) {
      return{
        ...state,
        job_id: state.job_id.push(payload)
      }
    }
  }
})
