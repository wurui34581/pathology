import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { Menu, Icon, Popover, Layout, Drawer, Table, Progress , Modal, Button } from 'antd'
import classnames from 'classnames'
import styles from './Header.less'
import tus from 'tus-js-client'

const { SubMenu } = Menu;




export default class Header extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      visible: false,
      fileList: [],
      folder: [],
      uploadState: [],
      cancelUpload: false
    }
  }

  componentDidMount () {
    this.columns = [{
      title: '文件名',
      dataIndex: 'name',
    }, {
      title: '进度',
      dataIndex: 'progress',
      render: (text, record) =>(
        <Progress percent={record.progress} />
      )
    },{
      title: '重试',
      key: 'action',
      render: (text, record, index) => (
        <span>
      {
        record.state === 0?
          <Icon type="loading" theme="outlined" /> :
            record.state === 1?
              <Icon type="redo" theme="outlined" onClick={this.uploadFile.bind(this, index)}/>:''
      }
    </span>
      ),
    }];
  }

  handleClickMenu ( e ) {
    e.key === 'logout' && this.props.logout()
  }

  upload () {
    const { fileList } = this.state;
    const input = document.getElementById('file-input');
    input.addEventListener('change', (e) => {
      const files = e.target.files;
      let fileIndex = [];
      let fileArr = [];
      if (fileList !== files) {

        files && files.length?
          Array.from(files).map((file)=>{
            let obj = {
              name: file.name,
              progress: 0,
              state: 0,
            };
            fileIndex.push(0);
            fileArr.push(obj)
          }):'';
        this.setState({
          folder: files,
          fileList: fileArr,
          uploadState: fileIndex
        });
        setTimeout(()=>{
          this.startUpload(this.state.folder);
        })
      }
    });
    input.click();
  }


  showDrawer () {
    const { fileList } = this.state;
    this.setState({
      visible: true,
    },()=>{
      if( fileList && !fileList.length ) {
        let input = ReactDOM.findDOMNode(this.refs.customAttributes);
        input.setAttribute('webkitdirectory', '');
        input.setAttribute('directory', '');
        input.setAttribute('multiple', '');
      }
    })
  }

  onClose = () => {
    this.setState({
      visible: false,
    })
  };

  startUpload( folder ) {
    let that = this;
    let length = folder && folder.length;
    this.count = 0;
    for(let i = 0; i<length; i++){
      let file = folder[i];
      (function(mfile) {
          that.tusUpload( mfile, i, length );
        }
      )(file);
    }
  }

  tusUpload ( file, index, length=1 ) {
    const { dispatch } = this.props;
    let that = this;
    let upload = new tus.Upload(file, {
      endpoint: "http://192.168.10.138:8080/api/storge/tus/",
      chunkSize: 40 * 1024 * 1024,
      removeFingerprintOnSuccess: true,
      metadata: {
        filename: file.name,
        filetype: file.type
      },
      onError: error => {

        if (error.originalRequest) {
          that.count++;
          that.state.uploadState[index] = 1;
          that.state.fileList[index].state = 1;
          that.setState({
            uploadState: that.state.uploadState,
            fileList: that.state.fileList
          })
          if(that.count === length*2){
            that.setState({
              cancelUpload: true
            })
            that.count = 1;
          }
        } else {
          Modal.info({
            title: '上传失败',
            content: error,
          });
        }
      },
      onProgress: (bytesUploaded, bytesTotal) => {
        let progressPercent = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
        that.state.fileList[index].progress = progressPercent;
        that.setState({
          fileList: that.state.fileList
        })
      },
      onSuccess: e => {
        that.count++;

        if(that.count === 1){

        }else{

        }
        if(that.count === length){
          that.setState({
            fileList: [],
          })
        }
        let data = {
          status:"queue",
          hash_key: open_id,
          resources: `http://192.168.10.185:808/storge/resource/${open_id}`,
          type: "ultrasonic_v2",
          trigger: "done",
          caller: "http://192.168.10.165",
          result_zip:null
        };
        dispatch()

        that.dialogVisible = false;
      }
    });
    upload.start()
  }

  uploadFile ( index ) {
    let that = this;
    let file = this.state.folder[index];
    this.state.fileList[index].state = 0;
    this.setState({
      uploadState: that.state.uploadState,
      cancelUpload: false
    })
    this.tusUpload( file, index )
  }

  cancelUpload () {
    this.setState({
      fileList: [],
      cancelUpload: false,
      visible: false
    })
  }

  render() {
    const {user,
      switchSider,
      siderFold, } = this.props;
    const { fileList } = this.state;

    return(
      <Layout.Header className={styles.header}>
        <div className={styles.leftWrapper}>
          <div
              className={styles.button}
              onClick={switchSider}
            >
              <Icon type={classnames({ 'menu-unfold': siderFold, 'menu-fold': !siderFold })} />
            </div>
          <div className={styles.upload} onClick={this.showDrawer.bind(this)}>
            <Icon type="folder-add" theme="outlined" style={{ fontSize: 16, paddingRight: 12   }} />
            <span>影像导入</span>
          </div>
        </div>

        <div className={styles.rightWarpper}>
          <Menu mode="horizontal" onClick={this.handleClickMenu.bind(this)}>
            <SubMenu
              style={{
                float: 'right',
              }}
              title={<span>
              <Icon type="user" />
                {user.username}
            </span>}
            >
              <Menu.Item key="logout">
                退出登录
              </Menu.Item>
            </SubMenu>
          </Menu>

        </div>

        <Drawer
          title="影像导入"
          placement= 'left'
          width={450}
          closable={false}
          onClose={this.onClose}
          visible={this.state.visible}
        >
          <div style={{ display: 'flex', justifyContent: 'center', fontSize: 18}}>
            {
              fileList && fileList.length?
                <div>
                  <Table columns={this.columns}
                         dataSource={Array.from(fileList)}
                         pagination={false}
                         rowKey={(record,index)=> index}
                         rowClassName={styles.rowStyle}/>
                  {
                    this.state.cancelUpload &&
                    <Button type="primary"
                            style={{ marginTop: 25, float: 'right' }}
                            onClick={this.cancelUpload.bind(this)}>
                      取消上传
                    </Button>
                  }
                </div>

                :
                <div onClick={this.upload.bind(this)}>
                  <Icon type="folder-add" theme="outlined" style={{ fontSize: 30, paddingRight: 12 }}/>
                  <input type="file" style={{display: 'none'}} ref='customAttributes' multiple id="file-input"/>
                  <span>点击选择文件夹</span>
                </div>
            }
          </div>
        </Drawer>
      </Layout.Header>
    )
  }
}

Header.propTypes = {
  user: PropTypes.object,
  logout: PropTypes.func,
  switchSider: PropTypes.func,
  siderFold: PropTypes.bool,
}

