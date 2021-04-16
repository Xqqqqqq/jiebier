import { Index } from '../../../api-models/index/index';
const index = new Index();
const { $Toast } = require('../../../dist/base/index');
import { wx_gotoNewUrl } from '../../../utils/fn'
//获取应用实例
const app = getApp()
Page({
  data:{
    url: app.globalData.url,
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 500,
    goodInfo:{},
    showVideo:false,
    videoAutoplay: true,
    storeId: '',
    preImgList:[], //需要预览的图片list
    // videoList:[
    //   {
    //     src:'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1819216937,2118754409&fm=26&gp=0.jpg',
    //     videoSrc:'http://wxsnsdy.tc.qq.com/105/20210/snsdyvideodownload?filekey=30280201010421301f0201690402534804102ca905ce620b1241b726bc41dcff44e00204012882540400&bizid=1023&hy=SH&fileparam=302c020101042530230204136ffd93020457e3c4ff02024ef202031e8d7f02030f42400204045a320a0201000400',
    //     id: 1,
    //   },
    //   {
    //     src:'https://ss0.baidu.com/7Po3dSag_xI4khGko9WTAnF6hhy/zhidao/pic/item/9c16fdfaaf51f3de9ba8ee1194eef01f3a2979a8.jpg',
    //     videoSrc:'http://wxsnsdy.tc.qq.com/105/20210/snsdyvideodownload?filekey=30280201010421301f0201690402534804102ca905ce620b1241b726bc41dcff44e00204012882540400&bizid=1023&hy=SH&fileparam=302c020101042530230204136ffd93020457e3c4ff02024ef202031e8d7f02030f42400204045a320a0201000400',
    //     id: 2,
    //   },
    //   {
    //     src:'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=2853553659,1775735885&fm=26&gp=0.jpg',
    //     videoSrc:'http://wxsnsdy.tc.qq.com/105/20210/snsdyvideodownload?filekey=30280201010421301f0201690402534804102ca905ce620b1241b726bc41dcff44e00204012882540400&bizid=1023&hy=SH&fileparam=302c020101042530230204136ffd93020457e3c4ff02024ef202031e8d7f02030f42400204045a320a0201000400',
    //     id: 3,
    //   },
    // ],
    // videoindex: '',
    // isFull:false
  },
  // //点击播放
  // bindplay(e){
  //   let id = e.currentTarget.dataset.pid,
  //       videoindex = e.currentTarget.dataset.index
  //   let videoCtx = wx.createVideoContext(id)
  //   if(!this.data.videoindex){
  //     this.setData({
  //       videoindex: videoindex
  //     },function(){
  //       videoCtx.play();
  //     })
  //   }else{
  //     let videoCtxPrev = wx.createVideoContext('myVideo'+this.data.videoindex)
  //     videoCtxPrev.pause();    //暂停
  //     this.setData({
  //       videoindex:videoindex
  //     },function(){
  //       videoCtx.play();    //播放点击的视频
  //     }) 
  //   }
  // },
  // //判断是否在全屏状态
  // videoFull(e){
  //   if(e.detail.fullScreen){
  //     this.setData({
  //       isFull:true
  //     })
  //   }else{
  //     this.setData({
  //       isFull:false
  //     })
  //   }
  // },
  // //视频播放完毕
  // videoEnd:function(){
  //   var video=wx.createVideoContext('myVideo' + this.data.videoindex);
  //   if(this.data.isFull){    //处于全屏则退出
  //     video.exitFullScreen()
  //   } 
  //   this.setData({
  //     videoindex:''
  //   })
  // },
  onLoad(options){
    console.log(options.id)
    if(options){
      this.setData({
        storeId:options.id
      })
      this.getStoreDetails(this.data.storeId)
    }
  },
  getStoreDetails(id){
    index.getStoreDetails({
      storeId: id
    }).then(res => {
      if(res.code == 200){
        wx.setNavigationBarTitle({
          title: res.result.storeName 
        })
        this.data.preImgList = res.result.storeProductList.map(item => {
          return item.productImg
        })
        this.setData({
          goodInfo: res.result,
        })
      }else{
        $Toast({
          content: res.msg,
          type: 'error'
        });
      }
    })
  },
  openVideo(){
    this.setData({
      showVideo: true,
      videoAutoplay: true
    })
    console.log(this.data.videoAutoplay)
  },
  openImg(e){
    console.log(e.currentTarget.dataset.url)
    if(e.currentTarget.dataset.url){
      wx.previewImage({
        current: e.currentTarget.dataset.url,
        urls: this.data.preImgList
      })
    }
  }
})