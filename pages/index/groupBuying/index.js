//index.js
import { Index } from '../../../api-models/index/index';
const index = new Index();
const { $Toast } = require('../../../dist/base/index');
import { wx_gotoNewUrl } from '../../../utils/fn'
//获取应用实例
const app = getApp()

Page({
  data : {
    url: app.globalData.url,
    targetTime: 0,
    clearTimer: false,
    endDate:'',
    sumGroupBuy:10, // 拼团人数上限
    visible: '',
    goodsid: '',
    productInfo:{},
    grayLength:0
  },
  onLoad(options){
    if(options.goodsid){
      this.setData({
        goodsid: options.goodsid
      })
    }
  },
  onShow(){
    let endDate = new Date();
    endDate.setTime(endDate.getTime()+(1000*60*60*24))
    this.data.endDate = `${this.myGetDate(endDate)} 03:00:00`
    this.setData({
      targetTime: new Date(this.data.endDate).getTime(),
    });
    this.getGroupInfo()
  },
  getGroupInfo(){
    index.getGroupInfo({
      productId: this.data.goodsid,
      userId: wx.getStorageSync('userInfo').id,
    }).then(res => {
      console.log('res',res)
      if(res.code == 200){
        this.setData({
          productInfo: res.result,
          grayLength: 10-res.result.users
        })
      }else{
        $Toast({
          content: res.msg,
          type: 'error'
        });
      }
    })
  },
  myGetDate(date){
    return `${date.getFullYear()}/${date.getMonth()+1}/${date.getDate()}`
  },
  onUnload() {
    this.setData({
        clearTimer: true
    });
  },
  submitGroup(){
    if(wx.getStorageSync('userInfo').id){
      if(this.data.productInfo.users && this.data.productInfo.users.length>0 && this.data.productInfo.users.length <10){ // 参与活动
        let newProductInfo = {
          productName: this.data.productInfo.productName,
          productPrice: this.data.productInfo.price,
          productImg: this.data.productInfo.productImg,
          productId: this.data.goodsid,
          productNum: 1,
          deliveryType: 2,
          status: '参与'
        }
        wx.setStorage({
          key: 'groupInfo',
          data: newProductInfo,
          success: function(res){
            wx_gotoNewUrl('navigateTo','/pages/classify/groupOrder/index')
          }
        })
      }else if(this.data.productInfo.users == null || this.data.productInfo.users.length == 0){ // 创建活动
        let newProductInfo = {
          productName: this.data.productInfo.productName,
          price: this.data.productInfo.price,
          productImg: this.data.productInfo.productImg,
          productId: this.data.goodsid,
          num: 1,
          deliveryType: 2,
          status: '创建'
        }
        wx.setStorage({
          key: 'groupInfo',
          data: newProductInfo,
          success: function(res){
            wx_gotoNewUrl('navigateTo','/pages/classify/groupOrder/index')
          }
        })
      }else{
        console.log("已结束")
      }
    }else{
      this.setData({
        visible: true
      })
    }
  },
  handleOk(){
    this.setData({
      visible: false
    })
    wx_gotoNewUrl('switchTab','/pages/mine/mine/index')
  },
  handleClose(){
    this.setData({
      visible: false
    })
  },
  onShareAppMessage: function (ops) {
    if (ops.from === 'button') {
      // 来自页面内转发按钮
    }
    return {
      title: this.data.productInfo.productName,
      path: `/pages/index/groupBuying/index`,  // 路径，传递参数到指定页面。
      imageUrl:this.data.productInfo.productImg, // 分享的封面图
      success: function (res) {
        // 转发成功
        console.log("转发成功:" + JSON.stringify(res));
      },
      fail: function (res) {
        // 转发失败
        console.log("转发失败:" + JSON.stringify(res));
      }
    }
  }
})