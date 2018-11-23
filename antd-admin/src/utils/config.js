const APIV1 = '/api/v1'
const APIV2 = 'http://192.168.10.173:8080'

module.exports = {
  name: '病理标注工具',
  prefix: 'antdAdmin',
  footerText: '清影医疗 © 2018',
  logo: '/public/logo.png',
  iconFontCSS: '/public/iconfont.css',
  iconFontJS: '/public/iconfont.js',
  CORS: ['http://192.168.10.173:8080'],
  openPages: ['/login'],
  apiPrefix: '/api/v1',
  APIV1,
  APIV2,
  api: {
    userLogin: `${APIV1}/user/login`,
    userLogout: `${APIV1}/user/logout`,
    userInfo: `${APIV1}/userInfo`,
    users: `${APIV1}/users`,
    user: `${APIV1}/user/:id`,
    dashboard: `${APIV1}/dashboard`,
    v1test: `${APIV1}/test`,
    v2test: `${APIV1}/test`,

    task: `${APIV1}/task`,
    getPatients: `${APIV2}/patients`,
    resource: `${APIV2}/resource/:id`,
    getResult: `${APIV2}/result/:job_id`,
    postLabel: `${APIV2}/labels`,
    postAll: `${APIV2}/conclusion_all`,

  },
}
