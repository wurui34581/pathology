import React from 'react'
import PropTypes from 'prop-types'
import { Icon, Switch, Table, Select } from 'antd'
import { config } from 'utils'
import styles from './Layout.less'
import classnames from 'classnames'
const Option = Select.Option;


/*const menu = (
  <Menu>
    <Menu.Item key="0">
      <span>TCGA-STAD</span>
    </Menu.Item>
    <Menu.Item key="1">
      <span>TCGA-LIHC</span>
    </Menu.Item>
    <Menu.Item key="2">
      <span>TCGA-PAAD</span>
    </Menu.Item>
    <Menu.Item key="3">
      <span>TCGA-CESC</span>
    </Menu.Item>
    <Menu.Item key="4">
      <span>TCGA-BRCA</span>
    </Menu.Item>
  </Menu>
);*/

const conclusionDes = [{
  data: 'normal',
  des: '正常'
},{
  data: 'hepatitis',
  des: '肝炎'
},{
  data: 'liver_cancer',
  des: '肝癌'
},{
  data: 'unknown',
  des: '其他'
}]

const columns = [{
  title: '文件',
  dataIndex: 'name',
  key: 'name',
}, {
  title: '状态',
  dataIndex: 'check',
  key: 'check',
  render: (text) => <span>{text?'已审核':'未审核'}</span>
},{
  title: '结论',
  dataIndex: 'conclusion',
  key: 'conclusion',
  render: (text) => {
    let conclusion = text?conclusionDes.find((c)=>{return c.data === text}):''
    return <span>{conclusion?conclusion.des:'暂无数据'}</span>
  }
}];

class PatientList extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      activeIndex: 0
    }
  }

  componentDidMount () {

  }

  getPic(id, record, index) {
    const { getPic } = this.props;
    getPic( id, record, index )
    this.setState({activeIndex: index})
  }
  setClassName(record,index){
    return index === this.state.activeIndex ? `${styles.tableRow}` : "";
  }
  selectType(value){
    console.log(value,'---value---')
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
        {/*<div style={{padding: 20}}>
          <Select defaultValue="TCGA-STAD" style={{ width: 120 }} onSelect={this.selectType.bind(this)}>
            <Option value="TCGA-STAD">JTCGA-STAD</Option>
            <Option value="TCGA-LIHC">TCGA-LIHC</Option>
            <Option value="TCGA-PAAD">TCGA-PAAD</Option>
            <Option value="TCGA-CESC">TCGA-CESC</Option>
            <Option value="TCGA-BRCA">TCGA-BRCA</Option>
          </Select>
        </div>*/}
        {
          !siderFold ?
            <Table columns={columns}
                   dataSource={patientList}
                   pagination={{size: 'small', defaultPageSize: 7}}
                   rowKey={(record, key) => key}
                   rowClassName={(record,index)=>{return index === this.state.activeIndex? styles.tableRow : "";}}
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
