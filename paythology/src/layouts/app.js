/* global window */
/* global document */
import React from 'react'
import NProgress from 'nprogress'
import PropTypes from 'prop-types'
import pathToRegexp from 'path-to-regexp'
import { connect } from 'dva'
import { Loader, MyLayout } from 'components'
import { Layout } from 'antd'
import { classnames, config } from 'utils'
import { Helmet } from 'react-helmet'
import { withRouter } from 'dva/router'
import Error from '../pages/404'
import '../themes/index.less'
import './app.less'

const { Content, Footer, Sider } = Layout
const { Header, styles } = MyLayout
const { prefix, openPages } = config

let lastHref

class App extends React.Component{
  constructor(props){
    super(props)
  }

  componentDidMount () {
    this.props.dispatch({ type:'app/patientList' })
  }

  render () {
    const { children, dispatch, app, loading, location, } = this.props;

    const {
      user, siderFold, darkTheme, isNavbar, menuPopoverVisible, navOpenKeys, menu, permissions, patientList, results, allResult
    } = app

    let { pathname } = location
    pathname = pathname.startsWith('/') ? pathname : `/${pathname}`
    const { iconFontJS, iconFontCSS, logo } = config
    /*const current = menu.filter(item => pathToRegexp(item.route || '').exec(pathname))
    const hasPermission = current.length ? permissions.visit.includes(current[0].id) : false*/
    const { href } = window.location

    if (lastHref !== href) {
      NProgress.start()
      if (!loading.global) {
        NProgress.done()
        lastHref = href
      }
    }

    const headerProps = {
      user,
      location,
      siderFold,
      isNavbar,
      menuPopoverVisible,
      navOpenKeys,
      switchMenuPopover () {
        dispatch({ type: 'app/switchMenuPopver' })
      },
      logout () {
        dispatch({ type: 'app/logout' })
      },
      switchSider () {
        dispatch({ type: 'app/switchSider' })
      },
      changeOpenKeys (openKeys) {
        dispatch({ type: 'app/handleNavOpenKeys', payload: { navOpenKeys: openKeys } })
      },
      localPicUrl (folder) {
        dispatch({ type: 'app/postPicUrl', payload: { folder } })
      },
    }

    const siderProps = {
      patientList,
      location,
      siderFold,
      darkTheme,
      navOpenKeys,
      getPic (id, record) {
        dispatch({ type: 'app/getPic', payload: id })
        dispatch({ type: 'app/getResults', payload: record.result })
        dispatch({ type: 'app/getPicId', payload: record.id })
        dispatch({ type: 'app/getAll', payload: record })
        dispatch({ type: 'app/picState', payload: true })
      },
      changeTheme () {
        dispatch({ type: 'app/switchTheme' })
      },
      changeOpenKeys (openKeys) {
        window.localStorage.setItem(`${prefix}navOpenKeys`, JSON.stringify(openKeys))
        dispatch({ type: 'app/handleNavOpenKeys', payload: { navOpenKeys: openKeys } })
      },
    }

    const resultProps = {
      results,
      allResult,
      labelInfo ( label, index ) {
        dispatch({ type: 'app/currentLabel', payload: { label, index } })
      },
      confirmResult ( type ) {
        dispatch({ type: 'app/confirmResult', payload: { type, id: allResult.id } })
      }
    }

    if (openPages && openPages.includes(pathname)) {
      return (<div>
        <Loader fullScreen spinning={loading.effects['app/query']} />
        {children}
      </div>)
    }

    return (
      <div>
        <Loader fullScreen spinning={loading.effects['app/query']} />
        <Helmet>
          <title>病理智能辅助诊断平台</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <link rel="icon" href={logo} type="image/x-icon" />
          {iconFontJS && <script src={iconFontJS} />}
          {iconFontCSS && <link rel="stylesheet" href={iconFontCSS} />}
        </Helmet>

        <Layout className={classnames({ [styles.dark]: darkTheme, [styles.light]: !darkTheme })}>
          {!isNavbar && <Sider
            trigger={null}
            collapsible
            collapsed={siderFold}
            width={280}>
            <MyLayout.PatientList {...siderProps} />
          </Sider>}
          <Layout style={{ height: '100vh' }} id="mainContainer">
            <Header {...headerProps} />
            <Layout>
              <Content>
                {children}
              </Content>
              <Sider
                trigger={null}
                width={280}
                style={{ margin: '24px 0' }}>
                <MyLayout.Result {...resultProps} />
              </Sider>
            </Layout>
            <Footer >
              {config.footerText}
            </Footer>
          </Layout>
        </Layout>
      </div>
    )
  }
}

App.propTypes = {
  children: PropTypes.element.isRequired,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  app: PropTypes.object,
  loading: PropTypes.object,
}

export default withRouter(connect(({ app, loading }) => ({ app, loading }))(App))
