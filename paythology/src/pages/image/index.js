import React from 'react'
import { connect } from 'dva'
import { Icon, Carousel, Tooltip, Slider, Button } from 'antd'
import { color } from 'utils'
import { Page } from 'components'
import styles from './index.less'
import { config } from 'utils'
import { pic } from '../../../public/public/logo.png'

const toolTip = ['标记'];
const iconType = ['edit'];
const APIV2 = config.APIV2




class Image extends React.Component{
  constructor (props) {
    super(props);
    this.state = {
      loading: true,
      curPage: 0
    }
  }

  componentDidMount () {
    this.openSeadragonInfo()
  }

  componentDidUpdate ( prevProps ) {
    const { app: { picUrl, results, labelState, picState, labelIndex }, dispatch } = this.props;
    if ( picUrl && picState && results.length ) {
      this.viewer && this.viewer.destroy()
      this.openSeadragonInfo()

      dispatch({ type: 'app/picState', payload: false })
    }
    if( labelState === !prevProps.labelState ){
      this.viewer.viewport.panTo(new OpenSeadragon.Point(results[labelIndex].area_center.x/100,results[labelIndex].area_center.y/100), true)
        .zoomTo(3);
    }
  }

  openSeadragonInfo() {
    const { app:{ picUrl, results } } = this.props;

    this.viewer = OpenSeadragon({
      id: "openseadragon1",
      prefixUrl: "/public/data/open/images/",
      tileSources: '/public/tall.dzi',
      showNavigator: true,
      navigatorPosition: 'BOTTOM_RIGHT',
      zoomInButton: 'zoom-in',
      zoomOutButton: 'zoom-out',
      fullPageButton: 'full-page',
      nextButton: 'next',
      previousButton: 'previous',
      //navigatorId: 'miniMap',
      navigatorWidth: 150,
      navigatorHeight: 150,
      isibilityRatio: 0.4,
      minZoomLevel: 0.9,
      maxZoomLevel: 40,
      zoomPerClick: 4,
      constrainDuringPan: true,
      panVertical: true,
      showSequenceControl:true,
    })
    let viewer = this.viewer;
    this.annotations = new OpenSeadragon.Annotations({ viewer })
    let loc = []
    results && results.length?
      results.map((item)=>{
        let anno = [
          'path',
          {
            d:item.annotation,
            'fill': "none",
            'stroke': "blue",
            'stroke-linecap': "round",
            'stroke-linejoin': "round",
            'stroke-width': "2",
            'vector-effect': "non-scaling-stroke",
          }
        ]
        loc.push(anno)
      }):null
    this.annotations.model.annotations = loc;
    this.annotations.setAnnotations(loc)
  }

  optionPic ( type, index ) {
    const { curPage } = this.state;
    const { dispatch } = this.props;
    //const { app:{ picUrl } } = this.props;
    const picUrl = ['/public/1.1.jpg','/public/1.2.jpg'];
    if (picUrl && picUrl.length ){
      switch ( type ) {
        case 'edit':
          console.log(this.refs.edit,'------')
          /*const button = new OpenSeadragon.Button({ element: this.refs.edit, })
          button.addHandler('click',(e)=>{
            console.log(e,'=========')
          })*/
          new OpenSeadragon.Control()

      }
    }
  }

  handleMouseWheel(event){
    let wheelDirection = event.deltaY;
    if(wheelDirection < 0){
      this.refs.carousel.innerSlider.slickPrev();
    }
    if(wheelDirection > 0){
      this.refs.carousel.innerSlider.slickNext();
    }
  }

  preloadPic( imgUrl ) {
    let imgLen = imgUrl && imgUrl.length;
    let count = 0;
    let that = this;
    for (let i = 0; i < imgLen; i++) {

      var mImage = new Image();
      mImage.onload = function () {
        count++;

        if((count/imgLen) >=0.8){
          that.setState({
            loading:false
          });
        }
      };
      mImage.src = ``

    }
  }

  saveLabel(){
    const { app: { picId, results, allResult } } = this.props;
    let annotations = this.annotations.model.annotations.slice(results.length);
    let annoMark = this.annotations.model.showSelect.reverse();
    let postData = []
    annotations && annotations.length?
      annotations.map((anno, index)=>{
        if(index%2){
          let annoInfo = {id: picId, anno: anno[1].d, type:annoMark[(index+1)/2-1], anno_id: (index+1)/2-1, width: allResult.width, height: allResult.height }
          postData.push(annoInfo)
        }

      }) : null
    this.props.dispatch({type: 'image/createLabel', payload: postData })
  }


  render () {
    const { loading } = this.state;
    //const { app: { picUrl } } = this.props;

    const picUrl = ['/public/1.1.jpg','/public/1.2.jpg', '/public/1.3.jpg','/public/1.4.jpg']

    return (<Page inner>
      <div className={styles.mainWrapper}>
        <div className={styles.tool}>
          {
            iconType.map((icon, index) => {
              return <Tooltip title={toolTip[index]} key={index}>
                <span ref={icon}>
                  <Icon type={icon} onClick={this.optionPic.bind(this, icon, index)} />
                </span>
              </Tooltip>
            })
          }
        </div>
        <div id="openseadragon1" style={{width: '100%',height: '95%'}} />
        <div className={styles.miniMapWrapper}>
          <div className={styles.readSlider}>
            {/*<Slider defaultValue={30} />*/}
          </div>
          {/*<div id="miniMap" className={styles.miniMap}/>*/}
        </div>
        <Button onClick={this.saveLabel.bind(this)} style={{marginTop: 20,float: 'right'}} type='primary'>保存所有标记</Button>
      </div>

    </Page>);
  }

}

export default connect(({ app, image, loading }) => ({ app, image, loading }))(Image)
