import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { Icon, Switch, Table, Button, Tabs  } from 'antd'
import { config } from 'utils'
import styles from './Layout.less'

const TabPane = Tabs.TabPane;
const APIV2 = config.APIV2




const conclusionDes = [{
  data: 'normal',
  des: '正常'
},{
  data: 'benign',
  des: '良性病变'
},{
  data: 'dcis',
  des: '原位癌'
},{
  data: 'nst',
  des: '浸润性癌'
},{
  data: 'unknown',
  des: '未知'
}]

class Result extends React.Component {
  constructor (props) {
    super(props);
  }

  componentDidMount () {
    this.columns = [{
      title: '编号',
      dataIndex: 'anno_id',
      key: 'anno_id',
      render: (text)=><span>{text+1}</span>,
    }, {
      title: '结论',
      dataIndex: 'type',
      key: 'type',
      render: (text)=>{
        let conclusion = conclusionDes.find((c)=>{return c.data === text})
        return (<span>{conclusion.des}</span>)
      },
    }, {
      title: '操作',
      key: 'action',
      render: (text, record, index) => (
        <span onClick={this.deleteLabel.bind(this, index)} className={styles.actionStyle}>删除</span>
      ),
    },];
  }

  labelInfo ( record, index ) {
    const { labelInfo } = this.props;
    labelInfo( record, index )
  }

  confirmResult ( type ) {
    const { confirmResult } = this.props;
    confirmResult( type )
  }
  addLabel(){
    const { addLabel } = this.props;
    addLabel()
  }
  deleteLabel(index){
    const { deleteLabel } = this.props
    deleteLabel(index)
  }

  render () {
    const { results, allResult, labelsList } = this.props;
    let conclusion = allResult && conclusionDes.find((c)=>{ return c.data === allResult.conclusion })
    return (
      <div className={styles.resultWrapper}>
        {/*<Tabs type="card">
          <TabPane tab="ROI" key="1"><img src={`${APIV2}${allResult && allResult.roi_path}`} alt="" style={{width: '60%',marginLeft: '20%'}}/></TabPane>
          <TabPane tab="Heatmap" key="2"><img src={`${APIV2}${allResult && allResult.heatmap_path}`} alt="" style={{width: '60%', marginLeft: '20%'}}/></TabPane>
        </Tabs>
        <div>
          <div className={styles.resultTitle}>智能诊断结果</div>
          <div className={styles.resultInfo}>智能诊断结论：{conclusion && conclusion.des}</div>
          <div className={styles.resultInfo}>平均阳性概率：{allResult && allResult.probability && `${allResult.probability}%`}</div>
          <div className={styles.resultInfo}>疑似患癌区域个数：{allResult && allResult.probability && `${allResult.probability}%`}</div>
          <div className={styles.resultInfo}>疑似患癌面积所占百分比：{allResult && allResult.probability && `${allResult.probability}%`}</div>

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
        </div>*/}
        <div>
          <div className={styles.resultTitle}>医师标记</div>
          <Table columns={this.columns}
                 dataSource={labelsList}
                 size="small"
                 pagination={{size: 'small', defaultPageSize: 5}}
                 rowKey={(record, key) => key}
                 onRow={(record,index) => {
                   return {
                     //onClick: () => {this.labelInfo( record, index )},
                   };
                 }}/>
          <Button type="dashed" block onClick={this.addLabel.bind(this)}>+</Button>
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
