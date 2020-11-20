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
    videoAutoplay: false
  },
  onLoad(options){
    // if(options){
    //   wx.setNavigationBarTitle({
    //     title: options.goodsname 
    //   })
    //   this.setData({
    //     "goodsDetail.productId":options.goodsid
    //   })
    //   this.productDetail(options.goodsid)
    // }
  },
  productDetail(id){
    index.productDetail({
      id: id
    }).then(res => {
      if(res.code == 200){
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
  }
})