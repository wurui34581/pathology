import { parse } from 'qs'
import modelExtend from 'dva-model-extend'
import { model } from 'utils/model'
import { createLabel } from './service'
import { message } from 'antd'

export default modelExtend(model, {
  namespace: 'image',
  state:{} ,

  effects: {
    * createLabel ( { payload }, { put, call } ) {
      const data = yield call(createLabel,payload)
      if (data.success) {
        message.success('保存标记成功')
      } else {
        message.success('保存标记失败')
      }
    }
  },


})
