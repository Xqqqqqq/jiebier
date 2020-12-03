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
  },
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