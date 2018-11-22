import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { Icon, Switch, Table, Button, Tabs  } from 'antd'
import { config } from 'utils'
import styles from './Layout.less'

const TabPane = Tabs.TabPane;
const APIV2 = config.APIV2


const columns = [{
  title: '编号',
  dataIndex: 'area_id',
  key: 'area_id',
}, {
  title: '面积',
  dataIndex: 'area',
  key: 'area',
  render: (text) => <span>{text.toFixed(2)}%</span>
}, {
  title: '结论',
  dataIndex: 'conclusion',
  key: 'conclusion',
  render: (text)=>{
    let conclusion = conclusionDes.find((c)=>{return c.data === text})
    return (<span>{conclusion.des}</span>)
  }
},/*{
  title: '概率',
  dataIndex: 'probability',
  key: 'probability',
  render: (text)=><span>{text}%</span>
},*/];

const conclusionDes = [{
  data: 'normal',
  des: '正常'
},{
  data: 'abnormal',
  des: '异常'
}]

class Result extends React.Component {
  constructor (props) {
    super(props);
  }

  componentDidMount () {

  }

  labelInfo ( record, index ) {
    const { labelInfo } = this.props;
    labelInfo( record, index )
  }

  confirmResult ( type ) {
    const { confirmResult } = this.props;
    confirmResult( type )
  }

  render () {
    const { results, allResult } = this.props;
    let conclusion = allResult && conclusionDes.find((c)=>{ return c.data === allResult.conclusion })
    return (
      <div className={styles.resultWrapper}>
        <Tabs type="card">
          <TabPane tab="ROI" key="1"><img src={`${APIV2}${allResult && allResult.roi_path}`} alt="" style={{width: '50%',marginLeft: '25%'}}/></TabPane>
          <TabPane tab="Heatmap" key="2"><img src={`${APIV2}${allResult && allResult.heatmap_path}`} alt="" style={{width: '50%', marginLeft: '25%'}}/></TabPane>
        </Tabs>
        <div>
          <div className={styles.resultTitle}>智能诊断结果</div>
          <div className={styles.resultInfo}>智能诊断结论：{conclusion ? conclusion.des:'暂无数据'}</div>
          <div className={styles.resultInfo}>平均阳性概率：{allResult && allResult.probability ? `${allResult.probability.toFixed(2)}%`:'暂无数据'}</div>
          <div className={styles.resultInfo}>疑似患癌区域个数：{allResult && allResult.cancerAreas_number ? `${allResult.cancerAreas_number}`:'暂无数据'}</div>
          <div className={styles.resultInfo}>疑似患癌面积所占百分比：{allResult && allResult.cancerAreas_percent ? `${allResult.cancerAreas_percent.toFixed(2)}%`:'暂无数据'}</div>

          <Table columns={columns}
                 dataSource={results}
                 size="small"
                 pagination={{size: 'small', defaultPageSize: 2}}
                 rowKey={(record, key) => key}
                 onRow={(record,index) => {
                   return {
                     onClick: () => {this.labelInfo( record, index )},
                   };
                 }}/>
        </div>

        <div>
          <div className={styles.resultTitle}>医师确认结果</div>
          <div className={styles.buttonGroup}>
            <Button type="primary" block onClick={this.confirmResult.bind(this, 'normal')}>正常</Button>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
              <Button type="primary" ghost onClick={this.confirmResult.bind(this, 'benign')} style={{width: 120}}>良性病变</Button>
              <Button type="danger" onClick={this.confirmResult.bind(this, 'dcis')} style={{width: 120}}>原位癌</Button>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
              <Button type="default" onClick={this.confirmResult.bind(this, 'nst')} style={{width: 120}}>浸润性癌</Button>
              <Button type="dashed" onClick={this.confirmResult.bind(this, 'unknown')} style={{width: 120}}>未知</Button>
            </div>
          </div>
        </div>
      </div>

    )
  }
}


Result.propTypes = {

}

export default Result
