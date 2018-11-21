import React from 'react'
import PropTypes from 'prop-types'
import { Icon, Switch, Table } from 'antd'
import { config } from 'utils'
import styles from './Layout.less'
import classnames from 'classnames'


const columns = [{
  title: '文件',
  dataIndex: 'name',
  key: 'name',
}, {
  title: '状态',
  dataIndex: 'check',
  key: 'check',
  render: (text) => <span>{text?'已审核':'未审核'}</span>
}];

class PatientList extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      hoverState: false
    }
  }

  componentDidMount () {

  }

  getPic(id, record, index) {
    const { getPic } = this.props;
    getPic( id, record )
    this.setState({hoverState: true})
  }

  render () {
    const { siderFold, darkTheme, changeTheme, patientList } = this.props;
    const { hoverState } = this.state
    return (
      <div>
        <div className={styles.logo}>
          <img alt="logo" src={config.logo} />
          {siderFold ? '' : <span>{config.name}</span>}
        </div>
        {
          !siderFold ?
            <Table columns={columns}
                   dataSource={patientList}
                   pagination={{size: 'small', defaultPageSize: 7}}
                   rowKey={(record, key) => key}
                   rowClassName={classnames({[styles.tableRow]: hoverState})}
                   onRow={(record, index) => {
                     return {
                       onClick: () => {this.getPic( record.dzi_path, record, index )},
                       //onMouseEnter: () => { ()=>this.setState({hoverState: true}) }
                     };
                   }}/>: ''
        }

        {/*{!siderFold ? <div className={styles.switchtheme}>
          <span><Icon type="bulb" />切换主题</span>
          <Switch onChange={changeTheme} defaultChecked={darkTheme} checkedChildren="暗色" unCheckedChildren="亮色" />
        </div> : ''}*/}
      </div>
    )
  }
}


PatientList.propTypes = {
  siderFold: PropTypes.bool,
  darkTheme: PropTypes.bool,
  changeTheme: PropTypes.func,
  changeOpenKeys: PropTypes.func,
}

export default PatientList
