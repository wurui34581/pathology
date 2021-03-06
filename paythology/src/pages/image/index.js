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
      tileSources: `${APIV2}${picUrl}`,
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

  /*optionPic ( type, index ) {
    const { curPage } = this.state;
    const { dispatch } = this.props;
    //const { app:{ picUrl } } = this.props;
    const picUrl = ['/public/1.1.jpg','/public/1.2.jpg'];
    if (picUrl && picUrl.length ){
      switch ( type ) {
        case 'caret-left':
          this.refs.carousel.innerSlider.slickPrev();
          break;
        case 'caret-right':
          this.refs.carousel.innerSlider.slickNext();
          break;
        case 'step-backward':
          this.refs.carousel.innerSlider.slickGoTo(0);
          break;
        case 'step-forward':
          this.refs.carousel.innerSlider.slickGoTo(picUrl.length);
          break;
        case 'edit':

          let loc = [['path',{
            d: "M41.94 91.89",
            fill: "none",
            stroke: "red",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeWidth: 2,
            vectorEffect: "non-scaling-stroke",
          }],['path',{
            d: "M41.94 91.89 L40.43 92.57 L39.09 93.07 L37.92 93.74 L37.58 94.08 L37.58 94.58 L37.25 95.25 L37.25 95.59 L37.25 95.92 L37.25 96.43 L37.25 96.76 L53.86 92.57 L51.85 90.72 L49.83 89.71 L48.32 89.04 L46.81 88.87 L41.44 88.37 L40.77 88.37 L39.09 89.71 L38.59 90.05 L38.42 90.55 L38.42 90.89 L38.08 91.39 L37.75 92.23 L37.75 92.57 L37.58 93.74 L37.58 94.24 L37.58 94.41",
            fill: "none",
            stroke: "red",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeWidth: 2,
            vectorEffect: "non-scaling-stroke",
          }]]
          //this.annotations.model.annotations = loc;
          this.annotations.setAnnotations(loc)

      }
    }
  }*/

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
        {/*<div className={styles.tool}>
          {
            iconType.map((icon, index) => {
              return <Tooltip title={toolTip[index]} key={index}>
                <Icon type={icon} onClick={this.optionPic.bind(this, icon, index)}/>
              </Tooltip>
            })
          }
        </div>*/}
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
