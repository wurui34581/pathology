import styles from "../Layout/Header.less";

const upload = () => {
  return (
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
  )
}


